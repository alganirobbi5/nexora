<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\Transaction;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    /**
     * List authenticated user's transactions, newest first.
     */
    public function index(): JsonResponse
    {
        $transactions = auth()->user()->transactions()
            ->latest('transaction_date')
            ->get();

        return response()->json($transactions);
    }

    /**
     * Store a new transaction for the authenticated user.
     */
    public function store(StoreTransactionRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Never accept user_id from client - always use authenticated user
        $validated['user_id'] = auth()->id();

        // Category validation: if category_id supplied, must belong to user or be global
        if (isset($validated['category_id'])) {
            $category = Category::find($validated['category_id']);

            if (!$category) {
                return response()->json([
                    'message' => 'Category not found.',
                ], 404);
            }

            // Allow if category belongs to user OR is global (user_id = null)
            if ($category->user_id !== null && $category->user_id !== auth()->id()) {
                return response()->json([
                    'message' => 'Unauthorized category access.',
                ], 403);
            }

            $validated['category_id'] = $category->id;
        }

        $transaction = auth()->user()->transactions()->create($validated);

        return response()->json($transaction, 201);
    }

    /**
     * Update the authenticated user's transaction.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction): JsonResponse
    {
        // Ensure user can only update their own transaction
        if ($transaction->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized transaction access.',
            ], 403);
        }

        $validated = $request->validated();

        // Category validation if being updated
        if (isset($validated['category_id'])) {
            $category = Category::find($validated['category_id']);

            if (!$category) {
                return response()->json([
                    'message' => 'Category not found.',
                ], 404);
            }

            // Allow if category belongs to user OR is global (user_id = null)
            if ($category->user_id !== null && $category->user_id !== auth()->id()) {
                return response()->json([
                    'message' => 'Unauthorized category access.',
                ], 403);
            }

            $validated['category_id'] = $category->id;
        }

        $transaction->update($validated);

        return response()->json($transaction);
    }

    /**
     * Delete the authenticated user's transaction.
     */
    public function destroy(Transaction $transaction): JsonResponse
    {
        // Ensure user can only delete their own transaction
        if ($transaction->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized transaction access.',
            ], 403);
        }

        $transaction->delete();

        return response()->json([], 204);
    }
}