<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\FinancialGoal;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $income = Transaction::where('user_id', $user->id)
            ->where('type', 'income')
            ->sum('amount');

        $expenses = Transaction::where('user_id', $user->id)
            ->where('type', 'expense')
            ->sum('amount');

        $balance = $income - $expenses;

        $activeGoals = FinancialGoal::where('user_id', $user->id)
            ->where('status', 'active')
            ->count();

        return response()->json([
            'balance' => $balance,
            'income' => $income,
            'expenses' => $expenses,
            'active_goals' => $activeGoals,
        ]);
    }
}