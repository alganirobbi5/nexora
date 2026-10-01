<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Transaction;
use App\Models\FinancialGoal;

class DashboardTest extends TestCase
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

    public function test_unauthenticated_request_returns_401(): void
    {
        $response = $this->getJson('/api/dashboard', $this->spaHeaders());

        $response->assertStatus(401);
    }

    public function test_authenticated_user_with_no_data_receives_zeros(): void
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->actingAs($user, 'web')
            ->getJson('/api/dashboard', $this->spaHeaders());

        $response->assertJson([
            'balance' => 0,
            'income' => 0,
            'expenses' => 0,
            'active_goals' => 0,
        ]);
    }

    public function test_dashboard_calculates_income_expenses_and_balance_correctly(): void
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test2@example.com',
            'password' => bcrypt('password'),
        ]);

        // Create income transactions
        $income1 = new Transaction([
            'user_id' => $user->id,
            'type' => 'income',
            'amount' => 1000000,
            'transaction_date' => now()->toDateString(),
        ]);
        $income1->save();

        $income2 = new Transaction([
            'user_id' => $user->id,
            'type' => 'income',
            'amount' => 500000,
            'transaction_date' => now()->toDateString(),
        ]);
        $income2->save();

        // Create expense transaction
        $expense = new Transaction([
            'user_id' => $user->id,
            'type' => 'expense',
            'amount' => 300000,
            'transaction_date' => now()->toDateString(),
        ]);
        $expense->save();

        $response = $this->actingAs($user, 'web')
            ->getJson('/api/dashboard', $this->spaHeaders());

        $response->assertJson([
            'income' => 1500000,
            'expenses' => 300000,
            'balance' => 1200000,
        ]);
    }

    public function test_active_goals_counts_only_active_goals(): void
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test3@example.com',
            'password' => bcrypt('password'),
        ]);

        // Create 2 active goals with all required fields
        $goal1 = new FinancialGoal([
            'user_id' => $user->id,
            'status' => 'active',
            'title' => 'Goal 1',
            'target_amount' => 1000000,
        ]);
        $goal1->save();

        $goal2 = new FinancialGoal([
            'user_id' => $user->id,
            'status' => 'active',
            'title' => 'Goal 2',
            'target_amount' => 500000,
        ]);
        $goal2->save();

        // Create 1 completed goal with all required fields
        $goal3 = new FinancialGoal([
            'user_id' => $user->id,
            'status' => 'completed',
            'title' => 'Goal 3',
            'target_amount' => 200000,
        ]);
        $goal3->save();

        // Create 1 archived goal with all required fields
        $goal4 = new FinancialGoal([
            'user_id' => $user->id,
            'status' => 'archived',
            'title' => 'Goal 4',
            'target_amount' => 300000,
        ]);
        $goal4->save();

        $response = $this->actingAs($user, 'web')
            ->getJson('/api/dashboard', $this->spaHeaders());

        $response->assertJson([
            'active_goals' => 2,
        ]);
    }

    public function test_other_users_data_is_excluded(): void
    {
        $userA = User::create([
            'name' => 'User A',
            'email' => 'usera@example.com',
            'password' => bcrypt('password'),
        ]);

        $userB = User::create([
            'name' => 'User B',
            'email' => 'userb@example.com',
            'password' => bcrypt('password'),
        ]);

        // Create data for User B with all required fields
        $transactionB = new Transaction([
            'user_id' => $userB->id,
            'type' => 'income',
            'amount' => 99999999,
            'transaction_date' => now()->toDateString(),
        ]);
        $transactionB->save();

        $goalB = new FinancialGoal([
            'user_id' => $userB->id,
            'status' => 'active',
            'title' => 'Goal B',
            'target_amount' => 500000,
        ]);
        $goalB->save();

        // Authenticate as User A
        $response = $this->actingAs($userA, 'web')
            ->getJson('/api/dashboard', $this->spaHeaders());

        // User A should only see their own data (zeros)
        $response->assertJson([
            'income' => 0,
            'active_goals' => 0,
        ]);
    }
}