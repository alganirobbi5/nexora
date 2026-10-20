<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryBudgetRequest;
use App\Http\Requests\UpdateCategoryBudgetRequest;
use App\Models\Category;
use App\Models\CategoryBudget;
use App\Models\Transaction;
use Illuminate\Http\Request;

class CategoryBudgetController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $year = $request->integer('year') ?? now()->year;
        $month = $request->integer('month') ?? now()->month;

        $budgets = CategoryBudget::where('user_id', $user->id)
            ->when($year, fn ($q) => $q->where('year', $year))
            ->when($month, fn ($q) => $q->where('month', $month))
            ->get();

        $budgets = $budgets->map(function ($budget) use ($user, $year, $month) {
            $usedAmount = Transaction::where('user_id', $user->id)
                ->where('type', 'expense')
                ->where('category_id', $budget->category_id)
                ->whereYear('transaction_date', $year)
                ->whereMonth('transaction_date', $month)
                ->sum('amount');

            $used = $usedAmount ?? 0;
            $limit = $budget->limit_amount;
            $remaining = max($limit - $used, 0);
            $overspent = max($used - $limit, 0);
            $percentage = $limit > 0 ? round($used / $limit * 100) : 0;

            $status = '';
            $statusColor = '';
            if ($overspent > 0) {
                $status = 'Melebihi budget';
                $statusColor = 'red';
            } elseif ($used >= $limit * 0.8) {
                $status = 'Mendekati batas';
                $statusColor = 'orange';
            } else {
                $status = 'Aman';
                $statusColor = 'green';
            }

            return [
                'id' => $budget->id,
                'category_id' => $budget->category_id,
                'category' => $budget->category,
                'year' => $budget->year,
                'month' => $budget->month,
                'limit_amount' => $budget->limit_amount,
                'used_amount' => $used,
                'remaining_amount' => $remaining,
                'overspent_amount' => $overspent,
                'percentage' => $percentage,
                'status' => $status,
                'status_color' => $statusColor,
            ];
        });

        return response()->json([
            'selected_month' => $month,
            'selected_year' => $year,
            'budgets' => $budgets->values()->toArray(),
        ]);
    }

    public function store(StoreCategoryBudgetRequest $request)
    {
        $user = $request->user();

        $validated = $request->validated();
        $validated['user_id'] = $user->id;

        $budget = CategoryBudget::create($validated);

        return response()->json([
            'id' => $budget->id,
            'category_id' => $budget->category_id,
            'category' => $budget->category,
            'year' => $budget->year,
            'month' => $budget->month,
            'limit_amount' => $budget->limit_amount,
            'message' => 'Budget created successfully',
        ], 201);
    }

    public function update(UpdateCategoryBudgetRequest $request, CategoryBudget $budget)
    {
        $user = $request->user();

        if ($budget->category->user_id !== $user->id) {
            return response()->json([
                'error' => 'The category does not belong to you.',
            ], 403);
        }

        $validated = $request->validated();

        if (isset($validated['category_id'])) {
            $category = Category::find($validated['category_id']);
            if ($category->user_id !== $user->id) {
                return response()->json([
                    'error' => 'The category does not belong to you.',
                ], 403);
            }
            if ($category->type !== 'expense') {
                return response()->json([
                    'error' => 'Budget can only be set for expense categories.',
                ], 400);
            }
        }

        $budget->update($validated);

        return response()->json([
            'id' => $budget->id,
            'category_id' => $budget->category_id,
            'category' => $budget->category,
            'year' => $budget->year,
            'month' => $budget->month,
            'limit_amount' => $budget->limit_amount,
            'message' => 'Budget updated successfully',
        ]);
    }

    public function destroy(CategoryBudget $budget, Request $request)
    {
        $user = $request->user();

        if ($budget->category->user_id !== $user->id) {
            return response()->json([
                'error' => 'The category does not belong to you.',
            ], 403);
        }

        $budget->delete();

        return response()->json([
            'message' => 'Budget deleted successfully',
        ]);
    }
}
