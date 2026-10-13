<?php

namespace Tests\Feature;

use App\Models\FinancialGoal;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FinancialGoalTest extends TestCase
{
    use RefreshDatabase;

    protected function spaHeaders(): array
    {
        return [
            'Origin' => 'http://localhost:5173',
            'Referer' => 'http://localhost:5173/',
            'Accept' => 'application/json',
        ];
    }

    public function test_unauthenticated_user_cannot_access_financial_goals(): void
    {
        $response = $this->getJson('/api/financial-goals', $this->spaHeaders());

        $response->assertStatus(401);
    }

    public function test_authenticated_user_sees_only_own_goals(): void
    {
        $userA = User::create([
            'name' => 'User A',
            'email' => 'goala@example.com',
            'password' => 'password123',
        ]);

        $userB = User::create([
            'name' => 'User B',
            'email' => 'goalb@example.com',
            'password' => 'password123',
        ]);

        FinancialGoal::create([
            'user_id' => $userA->id,
            'title' => 'Emergency Fund',
            'target_amount' => 7500000,
            'current_amount' => 1000000,
            'status' => 'active',
        ]);

        FinancialGoal::create([
            'user_id' => $userB->id,
            'title' => 'Other User Goal',
            'target_amount' => 5000000,
            'current_amount' => 0,
            'status' => 'active',
        ]);

        $this->actingAs($userA, 'web');

        $response = $this->getJson('/api/financial-goals', $this->spaHeaders());

        $response->assertOk()
            ->assertJsonFragment(['title' => 'Emergency Fund'])
            ->assertJsonMissing(['title' => 'Other User Goal']);
    }

    public function test_goals_are_ordered_correctly(): void
    {
        $user = User::create([
            'name' => 'Order User',
            'email' => 'goalorder@example.com',
            'password' => 'password123',
        ]);

        FinancialGoal::create([
            'user_id' => $user->id,
            'title' => 'Archived Goal',
            'target_amount' => 1000000,
            'current_amount' => 1000000,
            'deadline' => '2026-01-01',
            'status' => 'archived',
        ]);

        FinancialGoal::create([
            'user_id' => $user->id,
            'title' => 'Later Active',
            'target_amount' => 5000000,
            'current_amount' => 0,
            'deadline' => '2027-12-31',
            'status' => 'active',
        ]);

        FinancialGoal::create([
            'user_id' => $user->id,
            'title' => 'Near Active',
            'target_amount' => 3000000,
            'current_amount' => 0,
            'deadline' => '2027-01-01',
            'status' => 'active',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->getJson('/api/financial-goals', $this->spaHeaders());

        $response->assertOk();
        $response->assertJsonPath('0.title', 'Near Active');
        $response->assertJsonPath('1.title', 'Later Active');
        $response->assertJsonPath('2.title', 'Archived Goal');
    }

    public function test_authenticated_user_can_create_goal(): void
    {
        $user = User::create([
            'name' => 'Goal Creator',
            'email' => 'goalcreate@example.com',
            'password' => 'password123',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->postJson('/api/financial-goals', [
            'title' => 'Emergency Fund',
            'target_amount' => 7500000,
            'current_amount' => 1000000,
            'deadline' => '2027-12-31',
            'status' => 'active',
        ], $this->spaHeaders());

        $response->assertStatus(201)
            ->assertJson([
                'title' => 'Emergency Fund',
                'target_amount' => 7500000,
                'current_amount' => 1000000,
                'status' => 'active',
                'user_id' => $user->id,
            ]);

        $this->assertDatabaseHas('financial_goals', [
            'user_id' => $user->id,
            'title' => 'Emergency Fund',
            'target_amount' => 7500000,
        ]);
    }

    public function test_create_uses_default_values(): void
    {
        $user = User::create([
            'name' => 'Default User',
            'email' => 'goaldefault@example.com',
            'password' => 'password123',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->postJson('/api/financial-goals', [
            'title' => 'Laptop Fund',
            'target_amount' => 15000000,
        ], $this->spaHeaders());

        $response->assertStatus(201)
            ->assertJson([
                'current_amount' => 0,
                'status' => 'active',
            ]);

        $this->assertDatabaseHas('financial_goals', [
            'user_id' => $user->id,
            'title' => 'Laptop Fund',
            'current_amount' => 0,
            'status' => 'active',
        ]);
    }

    public function test_request_user_id_is_ignored_on_create(): void
    {
        $userA = User::create([
            'name' => 'Owner A',
            'email' => 'goalownera@example.com',
            'password' => 'password123',
        ]);

        $userB = User::create([
            'name' => 'Owner B',
            'email' => 'goalownerb@example.com',
            'password' => 'password123',
        ]);

        $this->actingAs($userA, 'web');

        $response = $this->postJson('/api/financial-goals', [
            'title' => 'Protected Goal',
            'target_amount' => 5000000,
            'user_id' => $userB->id,
        ], $this->spaHeaders());

        $response->assertStatus(201)
            ->assertJsonPath('user_id', $userA->id);

        $this->assertDatabaseHas('financial_goals', [
            'title' => 'Protected Goal',
            'user_id' => $userA->id,
        ]);
    }

    public function test_invalid_create_request_returns_422(): void
    {
        $user = User::create([
            'name' => 'Validation User',
            'email' => 'goalvalidation@example.com',
            'password' => 'password123',
        ]);

        $this->actingAs($user, 'web');

        $this->postJson('/api/financial-goals', [
            'target_amount' => 1000000,
        ], $this->spaHeaders())
            ->assertStatus(422)
            ->assertJsonValidationErrors('title');

        $this->postJson('/api/financial-goals', [
            'title' => 'Invalid Target',
            'target_amount' => 0,
        ], $this->spaHeaders())
            ->assertStatus(422)
            ->assertJsonValidationErrors('target_amount');

        $this->postJson('/api/financial-goals', [
            'title' => 'Invalid Current',
            'target_amount' => 1000000,
            'current_amount' => -1,
        ], $this->spaHeaders())
            ->assertStatus(422)
            ->assertJsonValidationErrors('current_amount');

        $this->postJson('/api/financial-goals', [
            'title' => 'Invalid Status',
            'target_amount' => 1000000,
            'status' => 'invalid',
        ], $this->spaHeaders())
            ->assertStatus(422)
            ->assertJsonValidationErrors('status');
    }

    public function test_authenticated_user_can_update_own_goal(): void
    {
        $user = User::create([
            'name' => 'Goal Updater',
            'email' => 'goalupdate@example.com',
            'password' => 'password123',
        ]);

        $goal = FinancialGoal::create([
            'user_id' => $user->id,
            'title' => 'Old Goal',
            'target_amount' => 5000000,
            'current_amount' => 1000000,
            'status' => 'active',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->putJson('/api/financial-goals/' . $goal->id, [
            'title' => 'Updated Goal',
            'target_amount' => 8000000,
            'current_amount' => 3000000,
            'deadline' => '2028-01-01',
            'status' => 'completed',
        ], $this->spaHeaders());

        $response->assertOk()
            ->assertJson([
                'title' => 'Updated Goal',
                'target_amount' => 8000000,
                'current_amount' => 3000000,
                'status' => 'completed',
            ]);

        $this->assertDatabaseHas('financial_goals', [
            'id' => $goal->id,
            'title' => 'Updated Goal',
            'target_amount' => 8000000,
            'current_amount' => 3000000,
            'status' => 'completed',
        ]);
    }

    public function test_authenticated_user_cannot_update_another_users_goal(): void
    {
        $userA = User::create([
            'name' => 'Goal Owner',
            'email' => 'goalowner@example.com',
            'password' => 'password123',
        ]);

        $userB = User::create([
            'name' => 'Attacker',
            'email' => 'goalattacker@example.com',
            'password' => 'password123',
        ]);

        $goal = FinancialGoal::create([
            'user_id' => $userA->id,
            'title' => 'Private Goal',
            'target_amount' => 5000000,
            'current_amount' => 0,
            'status' => 'active',
        ]);

        $this->actingAs($userB, 'web');

        $response = $this->putJson('/api/financial-goals/' . $goal->id, [
            'title' => 'Hacked',
        ], $this->spaHeaders());

        $response->assertForbidden();
    }

    public function test_user_id_cannot_be_changed_through_update(): void
    {
        $userA = User::create([
            'name' => 'Original Owner',
            'email' => 'goaloriginal@example.com',
            'password' => 'password123',
        ]);

        $userB = User::create([
            'name' => 'Other User',
            'email' => 'goalother@example.com',
            'password' => 'password123',
        ]);

        $goal = FinancialGoal::create([
            'user_id' => $userA->id,
            'title' => 'Owned Goal',
            'target_amount' => 5000000,
            'current_amount' => 0,
            'status' => 'active',
        ]);

        $this->actingAs($userA, 'web');

        $response = $this->putJson('/api/financial-goals/' . $goal->id, [
            'title' => 'Still Mine',
            'user_id' => $userB->id,
        ], $this->spaHeaders());

        $response->assertOk();

        $this->assertDatabaseHas('financial_goals', [
            'id' => $goal->id,
            'user_id' => $userA->id,
            'title' => 'Still Mine',
        ]);
    }

    public function test_authenticated_user_can_delete_own_goal(): void
    {
        $user = User::create([
            'name' => 'Goal Deleter',
            'email' => 'goaldelete@example.com',
            'password' => 'password123',
        ]);

        $goal = FinancialGoal::create([
            'user_id' => $user->id,
            'title' => 'Delete Me',
            'target_amount' => 1000000,
            'current_amount' => 0,
            'status' => 'active',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->deleteJson(
            '/api/financial-goals/' . $goal->id,
            [],
            $this->spaHeaders()
        );

        $response->assertNoContent();

        $this->assertDatabaseMissing('financial_goals', [
            'id' => $goal->id,
        ]);
    }

    public function test_authenticated_user_cannot_delete_another_users_goal(): void
    {
        $userA = User::create([
            'name' => 'Goal Owner Delete',
            'email' => 'goalownerdelete@example.com',
            'password' => 'password123',
        ]);

        $userB = User::create([
            'name' => 'Unauthorized Deleter',
            'email' => 'goalunauthorizeddelete@example.com',
            'password' => 'password123',
        ]);

        $goal = FinancialGoal::create([
            'user_id' => $userA->id,
            'title' => 'Protected Goal',
            'target_amount' => 1000000,
            'current_amount' => 0,
            'status' => 'active',
        ]);

        $this->actingAs($userB, 'web');

        $response = $this->deleteJson(
            '/api/financial-goals/' . $goal->id,
            [],
            $this->spaHeaders()
        );

        $response->assertForbidden();

        $this->assertDatabaseHas('financial_goals', [
            'id' => $goal->id,
        ]);
    }
}