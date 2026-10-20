<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFinancialGoalContributionRequest;
use App\Http\Requests\UpdateFinancialGoalContributionRequest;
use App\Models\FinancialGoal;
use App\Models\FinancialGoalContribution;
use Illuminate\Http\Request;

class FinancialGoalContributionController extends Controller
{
    public function index(Request $request, FinancialGoal $goal)
    {
        $this->ensureGoalIsOwned($request, $goal);

        $contributions = $goal->contributions()
            ->orderByDesc('contribution_date')
            ->orderByDesc('id')
            ->get();

        return response()->json($contributions);
    }

    public function store(
        StoreFinancialGoalContributionRequest $request,
        FinancialGoal $goal
    ) {
        $this->ensureGoalIsOwned($request, $goal);

        $contribution = $goal->contributions()->create(
            $request->validated()
        );

        return response()->json($contribution->fresh(), 201);
    }

    public function update(
        UpdateFinancialGoalContributionRequest $request,
        FinancialGoal $goal,
        FinancialGoalContribution $contribution
    ) {
        $this->ensureGoalIsOwned($request, $goal);
        $this->ensureContributionBelongsToGoal($contribution, $goal);

        $contribution->update($request->validated());

        return response()->json($contribution->fresh());
    }

    public function destroy(
        Request $request,
        FinancialGoal $goal,
        FinancialGoalContribution $contribution
    ) {
        $this->ensureGoalIsOwned($request, $goal);
        $this->ensureContributionBelongsToGoal($contribution, $goal);

        $contribution->delete();

        return response()->noContent();
    }

    private function ensureGoalIsOwned(
        Request $request,
        FinancialGoal $goal
    ): void {
        if ($goal->user_id !== $request->user()->id) {
            abort(403);
        }
    }

    private function ensureContributionBelongsToGoal(
        FinancialGoalContribution $contribution,
        FinancialGoal $goal
    ): void {
        if ($contribution->financial_goal_id !== $goal->id) {
            abort(404);
        }
    }
}
