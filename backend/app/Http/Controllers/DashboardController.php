<?php

namespace App\Http\Controllers;

use App\Models\FinancialGoal;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'year' => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'month' => ['nullable', 'integer', 'min:1', 'max:12'],
        ]);

        $now = now();
        $year = (int) ($validated['year'] ?? $now->year);
        $month = (int) ($validated['month'] ?? $now->month);

        $periodStart = Carbon::create($year, $month, 1)->startOfMonth();
        $periodEnd = $periodStart->copy()->endOfMonth();

        $monthlyIncome = (int) Transaction::where('user_id', $user->id)
            ->where('type', 'income')
            ->whereBetween('transaction_date', [$periodStart, $periodEnd])
            ->sum('amount');

        $monthlyExpenses = (int) Transaction::where('user_id', $user->id)
            ->where('type', 'expense')
            ->whereBetween('transaction_date', [$periodStart, $periodEnd])
            ->sum('amount');

        $activeGoals = FinancialGoal::where('user_id', $user->id)
            ->where('status', 'active')
            ->count();

        return response()->json([
            'selected_year' => $year,
            'selected_month' => $month,
            'monthly_income' => $monthlyIncome,
            'monthly_expenses' => $monthlyExpenses,
            'net_cash_flow' => $monthlyIncome - $monthlyExpenses,
            'six_month_trend' => $this->sixMonthTrend($user->id, $periodStart),
            'category_breakdown' => $this->categoryBreakdown(
                $user->id,
                $periodStart,
                $periodEnd,
                $monthlyExpenses
            ),
            'recent_transactions' => $this->recentTransactions($user->id),
            'active_goals' => $activeGoals,
        ]);
    }

    /**
     * Six consecutive calendar months ending in the selected period.
     *
     * @return array<int, array<string, int|string>>
     */
    private function sixMonthTrend(int $userId, Carbon $periodStart): array
    {
        $trend = [];
        $cursor = $periodStart->copy()->subMonths(5)->startOfMonth();

        for ($index = 0; $index < 6; $index++) {
            $start = $cursor->copy()->startOfMonth();
            $end = $cursor->copy()->endOfMonth();

            $income = (int) Transaction::where('user_id', $userId)
                ->where('type', 'income')
                ->whereBetween('transaction_date', [$start, $end])
                ->sum('amount');

            $expenses = (int) Transaction::where('user_id', $userId)
                ->where('type', 'expense')
                ->whereBetween('transaction_date', [$start, $end])
                ->sum('amount');

            $trend[] = [
                'year' => (int) $cursor->year,
                'month' => (int) $cursor->month,
                'label' => $cursor->format('M Y'),
                'income' => $income,
                'expenses' => $expenses,
                'net_cash_flow' => $income - $expenses,
            ];

            $cursor->addMonthNoOverflow()->startOfMonth();
        }

        return $trend;
    }

    /**
     * Expense totals per category for the selected month.
     *
     * @return array<int, array<string, int|float|string|null>>
     */
    private function categoryBreakdown(
        int $userId,
        Carbon $periodStart,
        Carbon $periodEnd,
        int $totalExpenses
    ): array {
        $transactions = Transaction::where('user_id', $userId)
            ->where('type', 'expense')
            ->whereBetween('transaction_date', [$periodStart, $periodEnd])
            ->with('category')
            ->get();

        $breakdown = $transactions
            ->groupBy(fn (Transaction $transaction) => $transaction->category_id ?? 'none')
            ->map(function ($items) use ($totalExpenses) {
                $category = $items->first()->category;
                $amount = (int) $items->sum('amount');

                return [
                    'category_id' => $category?->id,
                    'category_name' => $category?->name ?? 'Tanpa kategori',
                    'amount' => $amount,
                    'percentage' => $totalExpenses > 0
                        ? round($amount / $totalExpenses * 100, 1)
                        : 0,
                ];
            })
            ->values()
            ->all();

        usort($breakdown, function (array $a, array $b) {
            if ($a['amount'] !== $b['amount']) {
                return $b['amount'] <=> $a['amount'];
            }

            $nameComparison = strcasecmp($a['category_name'], $b['category_name']);

            if ($nameComparison !== 0) {
                return $nameComparison;
            }

            return ($a['category_id'] ?? PHP_INT_MAX)
                <=> ($b['category_id'] ?? PHP_INT_MAX);
        });

        return $breakdown;
    }

    /**
     * Latest transactions, newest by date then id.
     *
     * @return array<int, array<string, mixed>>
     */
    private function recentTransactions(int $userId): array
    {
        return Transaction::where('user_id', $userId)
            ->with('category')
            ->orderByDesc('transaction_date')
            ->orderByDesc('id')
            ->limit(5)
            ->get()
            ->map(function (Transaction $transaction) {
                return [
                    'id' => $transaction->id,
                    'type' => $transaction->type,
                    'amount' => (int) $transaction->amount,
                    'description' => $transaction->description,
                    'transaction_date' => $transaction->transaction_date->toDateString(),
                    'category_id' => $transaction->category_id,
                    'category' => $transaction->category ? [
                        'id' => $transaction->category->id,
                        'name' => $transaction->category->name,
                        'icon' => $transaction->category->icon,
                        'color' => $transaction->category->color,
                    ] : null,
                ];
            })
            ->values()
            ->all();
    }
}
