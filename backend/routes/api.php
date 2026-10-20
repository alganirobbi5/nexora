<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryBudgetController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FinancialGoalContributionController;
use App\Http\Controllers\FinancialGoalController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here you can register API routes for your application. These routes
| are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'application' => 'NEXORA API',
    ]);
});

// Category budget CRUD
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/budgets', [CategoryBudgetController::class, 'index']);
    Route::post('/budgets', [CategoryBudgetController::class, 'store']);
    Route::put('/budgets/{budget}', [CategoryBudgetController::class, 'update']);
    Route::delete('/budgets/{budget}', [CategoryBudgetController::class, 'destroy']);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::put('/transactions/{transaction}', [TransactionController::class, 'update']);
    Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    Route::get('/financial-goals', [FinancialGoalController::class, 'index']);
    Route::post('/financial-goals', [FinancialGoalController::class, 'store']);
    Route::put('/financial-goals/{financialGoal}', [FinancialGoalController::class, 'update']);
    Route::delete('/financial-goals/{financialGoal}', [FinancialGoalController::class, 'destroy']);
    Route::get('/financial-goals/{goal}/contributions', [FinancialGoalContributionController::class, 'index']);
    Route::post('/financial-goals/{goal}/contributions', [FinancialGoalContributionController::class, 'store']);
    Route::put('/financial-goals/{goal}/contributions/{contribution}', [FinancialGoalContributionController::class, 'update']);
    Route::delete('/financial-goals/{goal}/contributions/{contribution}', [FinancialGoalContributionController::class, 'destroy']);
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::put('/tasks/{task}', [TaskController::class, 'update']);
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
