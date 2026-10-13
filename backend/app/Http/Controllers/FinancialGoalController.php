<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFinancialGoalRequest;
use App\Http\Requests\UpdateFinancialGoalRequest;
use App\Models\FinancialGoal;
use Illuminate\Http\Request;

class FinancialGoalController extends Controller
{
    public function index(Request $request)
    {
        return FinancialGoal::query()
            ->where('user_id', $request->user()->id)
            ->orderByRaw("CASE WHEN status = 'active' THEN 0 ELSE 1 END")
            ->orderByRaw("CASE WHEN deadline IS NULL THEN 1 ELSE 0 END")
            ->orderBy('deadline')
            ->orderByDesc('created_at')
            ->get();
    }

    public function store(StoreFinancialGoalRequest $request)
    {
        $data = $request->validated();

        $goal = FinancialGoal::create([
            ...$data,
            'user_id' => $request->user()->id,
            'current_amount' => $data['current_amount'] ?? 0,
            'status' => $data['status'] ?? 'active',
        ]);

        return response()->json($goal, 201);
    }

    public function update(
        UpdateFinancialGoalRequest $request,
        FinancialGoal $financialGoal
    ) {
        if ($financialGoal->user_id !== $request->user()->id) {
            abort(403);
        }

        $financialGoal->update($request->validated());

        return response()->json($financialGoal->fresh());
    }

    public function destroy(Request $request, FinancialGoal $financialGoal)
    {
        if ($financialGoal->user_id !== $request->user()->id) {
            abort(403);
        }

        $financialGoal->delete();

        return response()->noContent();
    }
}
