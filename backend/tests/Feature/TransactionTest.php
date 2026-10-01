<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Default SPA headers for Sanctum stateful requests.
     */
    protected function spaHeaders(): array
    {
        return [
            'Origin' => 'http://localhost:5173',
            'Referer' => 'http://localhost:5173/',
            'Accept' => 'application/json',
        ];
    }

    /** =====================================================
     * 1. Unauthenticated user cannot access transactions
     * ===================================================== */
    public function test_unauthenticated_user_cannot_access_transactions(): void
    {
        $response = $this->getJson('/api/transactions', $this->spaHeaders());

        $response->assertStatus(401);
    }

/** =====================================================
     * 2. Authenticated user only sees own transactions
     * ===================================================== */
    public function test_authenticated_user_only_see_own_transactions(): void
    {
        $userA = User::create([
            'name' => 'User A',
            'email' => 'usera@example.com',
            'password' => 'password123',
        ]);

        $userB = User::create([
            'name' => 'User B',
            'email' => 'userb@example.com',
            'password' => 'password123',
        ]);

        // Create transactions for both users
        $userA->transactions()->create([
            'type' => 'income',
            'amount' => 1000000,
            'description' => 'Salary A',
            'transaction_date' => now()->toDateString(),
        ]);

        $userB->transactions()->create([
            'type' => 'expense',
            'amount' => 500000,
            'description' => 'Expense B',
            'transaction_date' => now()->toDateString(),
        ]);

        // Authenticate as User A
        $this->actingAs($userA, 'web');

        $response = $this->getJson('/api/transactions', $this->spaHeaders());

        $response->assertOk();

        $response->assertJsonPath('0.type', 'income');
        $response->assertJsonPath('0.amount', 1000000);
        $response->assertJsonPath('0.description', 'Salary A');

    }

    /** =====================================================
     * 3. Create income transaction succeeds
     * ===================================================== */
    public function test_create_income_transaction_succeeds(): void
    {
        $user = User::create([
            'name' => 'Income User',
            'email' => 'income@example.com',
            'password' => 'password123',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->postJson('/api/transactions', [
            'type' => 'income',
            'amount' => 1000000,
            'description' => 'Salary',
            'transaction_date' => '2026-10-01',
        ], $this->spaHeaders());

        $response->assertStatus(201)
            ->assertJson([
                'type' => 'income',
                'amount' => 1000000,
                'description' => 'Salary',
                'user_id' => $user->id,
            ]);

        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'amount' => 1000000,
            'type' => 'income',
        ]);
    }

    /** =====================================================
     * 4. Create expense transaction succeeds
     * ===================================================== */
    public function test_create_expense_transaction_succeeds(): void
    {
        $user = User::create([
            'name' => 'Expense User',
            'email' => 'expense@example.com',
            'password' => 'password123',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->postJson('/api/transactions', [
            'type' => 'expense',
            'amount' => 250000,
            'description' => 'Groceries',
            'transaction_date' => '2026-10-01',
        ], $this->spaHeaders());

        $response->assertStatus(201)
            ->assertJson([
                'type' => 'expense',
                'amount' => 250000,
            ]);
    }

    /** =====================================================
     * 5. Invalid transaction fails validation
     * ===================================================== */
    public function test_invalid_transaction_fails_validation(): void
    {
        $user = User::create([
            'name' => 'Validation User',
            'email' => 'validate@example.com',
            'password' => 'password123',
        ]);

        $this->actingAs($user, 'web');

        // Test invalid type
        $response = $this->postJson('/api/transactions', [
            'type' => 'invalid_type',
            'amount' => 100000,
            'transaction_date' => '2026-10-01',
        ], $this->spaHeaders());

        $response->assertStatus(422)
            ->assertJsonValidationErrors('type');

        // Test amount = 0
        $response = $this->postJson('/api/transactions', [
            'type' => 'income',
            'amount' => 0,
            'transaction_date' => '2026-10-01',
        ], $this->spaHeaders());

        $response->assertStatus(422)
            ->assertJsonValidationErrors('amount');

        // Test missing transaction_date
        $response = $this->postJson('/api/transactions', [
            'type' => 'income',
            'amount' => 100000,
        ], $this->spaHeaders());

        $response->assertStatus(422)
            ->assertJsonValidationErrors('transaction_date');
    }

    /** =====================================================
     * 6. Authenticated user can update own transaction
     * ===================================================== */
    public function test_authenticated_user_can_update_own_transaction(): void
    {
        $user = User::create([
            'name' => 'Updater User',
            'email' => 'update@example.com',
            'password' => 'password123',
        ]);

        $transaction = $user->transactions()->create([
            'type' => 'income',
            'amount' => 1000000,
            'description' => 'Original',
            'transaction_date' => '2026-10-01',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->putJson('/api/transactions/' . $transaction->id, [
            'description' => 'Updated',
            'amount' => 500000,
        ], $this->spaHeaders());

        $response->assertOk()
            ->assertJson([
                'description' => 'Updated',
                'amount' => 500000,
            ]);

        $this->assertDatabaseHas('transactions', [
            'id' => $transaction->id,
            'description' => 'Updated',
            'amount' => 500000,
        ]);
    }

    /** =====================================================
     * 7. Authenticated user cannot update another user's transaction
     * ===================================================== */
    public function test_authenticated_user_cannot_update_another_users_transaction(): void
    {
        $userA = User::create([
            'name' => 'Owner',
            'email' => 'owner@example.com',
            'password' => 'password123',
        ]);

        $userB = User::create([
            'name' => 'Updater',
            'email' => 'updater@example.com',
            'password' => 'password123',
        ]);

        $transaction = $userA->transactions()->create([
            'type' => 'income',
            'amount' => 1000000,
            'description' => 'Own',
            'transaction_date' => '2026-10-01',
        ]);

        $this->actingAs($userB, 'web');

        $response = $this->putJson('/api/transactions/' . $transaction->id, [
            'description' => 'Hacked',
        ], $this->spaHeaders());

        $response->assertForbidden();
    }

    /** =====================================================
     * 8. Authenticated user can delete own transaction
     * ===================================================== */
    public function test_authenticated_user_can_delete_own_transaction(): void
    {
        $user = User::create([
            'name' => 'Deleter User',
            'email' => 'deleter@example.com',
            'password' => 'password123',
        ]);

        $transaction = $user->transactions()->create([
            'type' => 'income',
            'amount' => 1000000,
            'description' => 'ToDelete',
            'transaction_date' => '2026-10-01',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->deleteJson('/api/transactions/' . $transaction->id, [], $this->spaHeaders());

        $response->assertNoContent();

        $this->assertDatabaseMissing('transactions', [
            'id' => $transaction->id,
        ]);
    }

    /** =====================================================
     * 9. Authenticated user cannot delete another user's transaction
     * ===================================================== */
    public function test_authenticated_user_cannot_delete_another_users_transaction(): void
    {
        $userA = User::create([
            'name' => 'Owner',
            'email' => 'owner2@example.com',
            'password' => 'password123',
        ]);

        $userB = User::create([
            'name' => 'Deleter',
            'email' => 'deleter2@example.com',
            'password' => 'password123',
        ]);

        $transaction = $userA->transactions()->create([
            'type' => 'income',
            'amount' => 1000000,
            'description' => 'ToProtect',
            'transaction_date' => '2026-10-01',
        ]);

        $this->actingAs($userB, 'web');

        $response = $this->deleteJson('/api/transactions/' . $transaction->id, [], $this->spaHeaders());

        $response->assertForbidden();

        $this->assertDatabaseHas('transactions', [
            'id' => $transaction->id,
        ]);
    }

    /** =====================================================
     * 10. User can use their own category
     * ===================================================== */
    public function test_user_can_use_own_category(): void
    {
        $user = User::create([
            'name' => 'Category User',
            'email' => 'category@example.com',
            'password' => 'password123',
        ]);

        $category = $user->categories()->create([
            'name' => 'My Category',
            'type' => 'income',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->postJson('/api/transactions', [
            'type' => 'income',
            'amount' => 500000,
            'category_id' => $category->id,
            'description' => 'With Category',
            'transaction_date' => '2026-10-01',
        ], $this->spaHeaders());

        $response->assertStatus(201)
            ->assertJson(['category_id' => $category->id]);
    }

    /** =====================================================
     * 11. User can use global category
     * ===================================================== */
    public function test_user_can_use_global_category(): void
    {
        $user = User::create([
            'name' => 'Global User',
            'email' => 'global@example.com',
            'password' => 'password123',
        ]);

        $category = Category::create([
            'name' => 'Global Category',
            'type' => 'expense',
            'user_id' => null,
        ]);

        $this->actingAs($user, 'web');

        $response = $this->postJson('/api/transactions', [
            'type' => 'expense',
            'amount' => 300000,
            'category_id' => $category->id,
            'description' => 'Global',
            'transaction_date' => '2026-10-01',
        ], $this->spaHeaders());

        $response->assertStatus(201)
            ->assertJson(['category_id' => $category->id]);
    }

    /** =====================================================
     * 12. User cannot use another user's category
     * ===================================================== */
    public function test_user_cannot_use_another_users_category(): void
    {
        $userA = User::create([
            'name' => 'Category Owner A',
            'email' => 'catega@example.com',
            'password' => 'password123',
        ]);

        $userB = User::create([
            'name' => 'Category Owner B',
            'email' => 'categb@example.com',
            'password' => 'password123',
        ]);

        $category = $userB->categories()->create([
            'name' => 'B\'s Category',
            'type' => 'expense',
        ]);

        $this->actingAs($userA, 'web');

        $response = $this->postJson('/api/transactions', [
            'type' => 'expense',
            'amount' => 300000,
            'category_id' => $category->id,
            'description' => 'Unauthorized',
            'transaction_date' => '2026-10-01',
        ], $this->spaHeaders());

        // Should fail validation/authorization
        $response->assertStatus(422);
    }

    /** =====================================================
     * 13. Index returns newest transaction_date first
     * ===================================================== */
    public function test_index_returns_newest_first(): void
    {
        $user = User::create([
            'name' => 'Sort User',
            'email' => 'sort@example.com',
            'password' => 'password123',
        ]);

        // Create transactions with different dates
        $user->transactions()->create([
            'type' => 'income',
            'amount' => 100000,
            'description' => 'Old',
            'transaction_date' => '2026-09-01',
        ]);

        $user->transactions()->create([
            'type' => 'expense',
            'amount' => 50000,
            'description' => 'Newer',
            'transaction_date' => '2026-10-01',
        ]);

        $user->transactions()->create([
            'type' => 'income',
            'amount' => 200000,
            'description' => 'Newest',
            'transaction_date' => '2026-11-01',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->getJson('/api/transactions', $this->spaHeaders());

        $response->assertOk();

        $response->assertJsonPath('0.description', 'Newest');
        $response->assertJsonPath('1.description', 'Newer');
        $response->assertJsonPath('2.description', 'Old');
    }
}