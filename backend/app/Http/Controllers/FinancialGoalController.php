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
        $goals = FinancialGoal::query()
            ->where('user_id', $request->user()->id)
            ->withSum('contributions', 'amount')
            ->orderByRaw("CASE WHEN status = 'active' THEN 0 ELSE 1 END")
            ->orderByRaw("CASE WHEN deadline IS NULL THEN 1 ELSE 0 END")
            ->orderBy('deadline')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(
            $goals->map(fn (FinancialGoal $goal) => $goal->toApiArray())->values()
        );
    }

    public function store(StoreFinancialGoalRequest $request)
    {
        $data = $request->validated();

        // New goals store their initial savings as the opening balance.
        $openingAmount = (int) ($data['opening_amount'] ?? $data['current_amount'] ?? 0);

        $goal = FinancialGoal::create([
            'user_id' => $request->user()->id,
            'title' => $data['title'],
            'target_amount' => $data['target_amount'],
            'opening_amount' => $openingAmount,
            'current_amount' => $openingAmount,
            'deadline' => $data['deadline'] ?? null,
            'status' => $data['status'] ?? 'active',
        ]);

        return response()->json($goal->toApiArray(), 201);
    }

    public function update(
        UpdateFinancialGoalRequest $request,
        FinancialGoal $financialGoal
    ) {
        if ($financialGoal->user_id !== $request->user()->id) {
            abort(403);
        }

        $data = $request->validated();

        if (array_key_exists('opening_amount', $data)) {
            $openingAmount = (int) $data['opening_amount'];
        } elseif (array_key_exists('current_amount', $data)) {
            // Legacy clients send current_amount as a running total. Translate
            // it into an opening balance so contributions are not counted twice.
            $openingAmount = max(
                (int) $data['current_amount'] - $financialGoal->contributions_total,
                0
            );
        } else {
            $openingAmount = null;
        }

        if ($openingAmount !== null) {
            $data['opening_amount'] = $openingAmount;
            $data['current_amount'] = $openingAmount;
        }

        $financialGoal->update($data);

        return response()->json($financialGoal->fresh()->toApiArray());
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
