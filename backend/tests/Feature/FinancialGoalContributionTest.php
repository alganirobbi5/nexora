<?php

namespace Tests\Feature;

use App\Models\FinancialGoal;
use App\Models\FinancialGoalContribution;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FinancialGoalContributionTest extends TestCase
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

    private function makeUser(string $suffix): User
    {
        return User::create([
            'name' => 'Contribution User ' . $suffix,
            'email' => 'contribution-' . $suffix . '@example.com',
            'password' => 'password123',
        ]);
    }

    private function makeGoal(User $user, array $overrides = []): FinancialGoal
    {
        $openingAmount = $overrides['opening_amount'] ?? 0;

        return FinancialGoal::create(array_merge([
            'user_id' => $user->id,
            'title' => 'Goal',
            'target_amount' => 1000000,
            'opening_amount' => $openingAmount,
            'current_amount' => $openingAmount,
            'status' => 'active',
        ], $overrides));
    }

    public function test_unauthenticated_user_cannot_access_contributions(): void
    {
        $user = $this->makeUser('guest');
        $goal = $this->makeGoal($user);

        $this->getJson(
            "/api/financial-goals/{$goal->id}/contributions"
        )->assertUnauthorized();
    }

    public function test_authenticated_user_can_list_own_goal_contributions(): void
    {
        $user = $this->makeUser('list');
        $goal = $this->makeGoal($user);

        FinancialGoalContribution::create([
            'financial_goal_id' => $goal->id,
            'amount' => 100000,
            'contribution_date' => '2026-01-10',
        ]);

        FinancialGoalContribution::create([
            'financial_goal_id' => $goal->id,
            'amount' => 250000,
            'contribution_date' => '2026-02-10',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->getJson(
            "/api/financial-goals/{$goal->id}/contributions",
            $this->spaHeaders()
        );

        $response->assertOk()->assertJsonCount(2);
        $response->assertJsonFragment(['amount' => 100000]);
        $response->assertJsonFragment(['amount' => 250000]);
    }

    public function test_authenticated_user_can_create_contribution(): void
    {
        $user = $this->makeUser('create');
        $goal = $this->makeGoal($user);

        $this->actingAs($user, 'web');

        $response = $this->postJson(
            "/api/financial-goals/{$goal->id}/contributions",
            [
                'amount' => 150000,
                'contribution_date' => '2026-03-05',
                'note' => 'Monthly saving',
            ],
            $this->spaHeaders()
        );

        $response->assertStatus(201)
            ->assertJson([
                'financial_goal_id' => $goal->id,
                'amount' => 150000,
                'note' => 'Monthly saving',
            ]);

        $this->assertDatabaseHas('financial_goal_contributions', [
            'financial_goal_id' => $goal->id,
            'amount' => 150000,
        ]);
    }

    public function test_authenticated_user_can_update_contribution(): void
    {
        $user = $this->makeUser('update');
        $goal = $this->makeGoal($user);

        $contribution = FinancialGoalContribution::create([
            'financial_goal_id' => $goal->id,
            'amount' => 100000,
            'contribution_date' => '2026-01-10',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->putJson(
            "/api/financial-goals/{$goal->id}/contributions/{$contribution->id}",
            [
                'amount' => 275000,
                'contribution_date' => '2026-01-15',
                'note' => 'Corrected amount',
            ],
            $this->spaHeaders()
        );

        $response->assertOk()
            ->assertJson([
                'id' => $contribution->id,
                'amount' => 275000,
                'note' => 'Corrected amount',
            ]);

        $this->assertDatabaseHas('financial_goal_contributions', [
            'id' => $contribution->id,
            'amount' => 275000,
        ]);
    }

    public function test_authenticated_user_can_delete_contribution(): void
    {
        $user = $this->makeUser('delete');
        $goal = $this->makeGoal($user);

        $contribution = FinancialGoalContribution::create([
            'financial_goal_id' => $goal->id,
            'amount' => 100000,
            'contribution_date' => '2026-01-10',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->deleteJson(
            "/api/financial-goals/{$goal->id}/contributions/{$contribution->id}",
            [],
            $this->spaHeaders()
        );

        $response->assertNoContent();

        $this->assertDatabaseMissing('financial_goal_contributions', [
            'id' => $contribution->id,
        ]);
    }

    public function test_contribution_amount_must_be_greater_than_zero(): void
    {
        $user = $this->makeUser('amount-validation');
        $goal = $this->makeGoal($user);

        $this->actingAs($user, 'web');

        foreach ([0, -100] as $amount) {
            $this->postJson(
                "/api/financial-goals/{$goal->id}/contributions",
                [
                    'amount' => $amount,
                    'contribution_date' => '2026-03-05',
                ],
                $this->spaHeaders()
            )
                ->assertStatus(422)
                ->assertJsonValidationErrors('amount');
        }
    }

    public function test_contribution_date_is_required_and_valid(): void
    {
        $user = $this->makeUser('date-validation');
        $goal = $this->makeGoal($user);

        $this->actingAs($user, 'web');

        $this->postJson(
            "/api/financial-goals/{$goal->id}/contributions",
            ['amount' => 100000],
            $this->spaHeaders()
        )
            ->assertStatus(422)
            ->assertJsonValidationErrors('contribution_date');

        $this->postJson(
            "/api/financial-goals/{$goal->id}/contributions",
            [
                'amount' => 100000,
                'contribution_date' => 'not-a-date',
            ],
            $this->spaHeaders()
        )
            ->assertStatus(422)
            ->assertJsonValidationErrors('contribution_date');
    }

    public function test_contribution_note_is_optional(): void
    {
        $user = $this->makeUser('note-optional');
        $goal = $this->makeGoal($user);

        $this->actingAs($user, 'web');

        $response = $this->postJson(
            "/api/financial-goals/{$goal->id}/contributions",
            [
                'amount' => 125000,
                'contribution_date' => '2026-04-01',
            ],
            $this->spaHeaders()
        );

        $response->assertStatus(201);
        $this->assertNull($response->json('note'));

        $this->assertDatabaseHas('financial_goal_contributions', [
            'financial_goal_id' => $goal->id,
            'amount' => 125000,
            'note' => null,
        ]);
    }

    public function test_contributions_are_ordered_by_date_desc_then_id_desc(): void
    {
        $user = $this->makeUser('ordering');
        $goal = $this->makeGoal($user);

        $oldest = FinancialGoalContribution::create([
            'financial_goal_id' => $goal->id,
            'amount' => 100000,
            'contribution_date' => '2026-01-10',
        ]);

        $sameDateFirst = FinancialGoalContribution::create([
            'financial_goal_id' => $goal->id,
            'amount' => 200000,
            'contribution_date' => '2026-02-10',
        ]);

        $sameDateSecond = FinancialGoalContribution::create([
            'financial_goal_id' => $goal->id,
            'amount' => 300000,
            'contribution_date' => '2026-02-10',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->getJson(
            "/api/financial-goals/{$goal->id}/contributions",
            $this->spaHeaders()
        );

        $response->assertOk();
        $response->assertJsonPath('0.id', $sameDateSecond->id);
        $response->assertJsonPath('1.id', $sameDateFirst->id);
        $response->assertJsonPath('2.id', $oldest->id);
    }

    public function test_user_cannot_view_another_users_goal_contributions(): void
    {
        $owner = $this->makeUser('view-owner');
        $attacker = $this->makeUser('view-attacker');
        $goal = $this->makeGoal($owner);

        $this->actingAs($attacker, 'web');

        $this->getJson(
            "/api/financial-goals/{$goal->id}/contributions",
            $this->spaHeaders()
        )->assertForbidden();
    }

    public function test_user_cannot_add_contribution_to_another_users_goal(): void
    {
        $owner = $this->makeUser('add-owner');
        $attacker = $this->makeUser('add-attacker');
        $goal = $this->makeGoal($owner);

        $this->actingAs($attacker, 'web');

        $this->postJson(
            "/api/financial-goals/{$goal->id}/contributions",
            [
                'amount' => 100000,
                'contribution_date' => '2026-03-05',
            ],
            $this->spaHeaders()
        )->assertForbidden();

        $this->assertDatabaseCount('financial_goal_contributions', 0);
    }

    public function test_user_cannot_update_another_users_contribution(): void
    {
        $owner = $this->makeUser('update-owner');
        $attacker = $this->makeUser('update-attacker');
        $goal = $this->makeGoal($owner);

        $contribution = FinancialGoalContribution::create([
            'financial_goal_id' => $goal->id,
            'amount' => 100000,
            'contribution_date' => '2026-01-10',
        ]);

        $this->actingAs($attacker, 'web');

        $this->putJson(
            "/api/financial-goals/{$goal->id}/contributions/{$contribution->id}",
            ['amount' => 999999],
            $this->spaHeaders()
        )->assertForbidden();

        $this->assertDatabaseHas('financial_goal_contributions', [
            'id' => $contribution->id,
            'amount' => 100000,
        ]);
    }

    public function test_user_cannot_delete_another_users_contribution(): void
    {
        $owner = $this->makeUser('delete-owner');
        $attacker = $this->makeUser('delete-attacker');
        $goal = $this->makeGoal($owner);

        $contribution = FinancialGoalContribution::create([
            'financial_goal_id' => $goal->id,
            'amount' => 100000,
            'contribution_date' => '2026-01-10',
        ]);

        $this->actingAs($attacker, 'web');

        $this->deleteJson(
            "/api/financial-goals/{$goal->id}/contributions/{$contribution->id}",
            [],
            $this->spaHeaders()
        )->assertForbidden();

        $this->assertDatabaseHas('financial_goal_contributions', [
            'id' => $contribution->id,
        ]);
    }

    public function test_contribution_id_cannot_be_used_under_unrelated_goal(): void
    {
        $user = $this->makeUser('unrelated-goal');
        $goal = $this->makeGoal($user);
        $otherGoal = $this->makeGoal($user, ['title' => 'Other Goal']);

        $contribution = FinancialGoalContribution::create([
            'financial_goal_id' => $goal->id,
            'amount' => 100000,
            'contribution_date' => '2026-01-10',
        ]);

        $this->actingAs($user, 'web');

        $this->putJson(
            "/api/financial-goals/{$otherGoal->id}/contributions/{$contribution->id}",
            ['amount' => 200000],
            $this->spaHeaders()
        )->assertNotFound();

        $this->deleteJson(
            "/api/financial-goals/{$otherGoal->id}/contributions/{$contribution->id}",
            [],
            $this->spaHeaders()
        )->assertNotFound();

        $this->assertDatabaseHas('financial_goal_contributions', [
            'id' => $contribution->id,
            'amount' => 100000,
        ]);
    }

    public function test_collected_amount_is_opening_plus_contributions(): void
    {
        $user = $this->makeUser('collected');
        $goal = $this->makeGoal($user, ['opening_amount' => 200000]);

        FinancialGoalContribution::create([
            'financial_goal_id' => $goal->id,
            'amount' => 100000,
            'contribution_date' => '2026-01-10',
        ]);

        FinancialGoalContribution::create([
            'financial_goal_id' => $goal->id,
            'amount' => 150000,
            'contribution_date' => '2026-02-10',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->getJson(
            '/api/financial-goals',
            $this->spaHeaders()
        );

        $response->assertOk();
        $goalData = $response->json('0');

        $this->assertEquals(200000, $goalData['opening_amount']);
        $this->assertEquals(250000, $goalData['contributions_total']);
        $this->assertEquals(450000, $goalData['collected_amount']);
        $this->assertEquals(550000, $goalData['remaining_amount']);
        $this->assertEquals(45, $goalData['progress_percentage']);
        $this->assertEquals(450000, $goalData['current_amount']);
    }

    public function test_remaining_amount_never_below_zero(): void
    {
        $user = $this->makeUser('remaining');
        $goal = $this->makeGoal($user, ['opening_amount' => 900000]);

        FinancialGoalContribution::create([
            'financial_goal_id' => $goal->id,
            'amount' => 300000,
            'contribution_date' => '2026-01-10',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->getJson(
            '/api/financial-goals',
            $this->spaHeaders()
        );

        $response->assertOk();
        $this->assertEquals(0, $response->json('0.remaining_amount'));
        $this->assertGreaterThanOrEqual(
            0,
            $response->json('0.remaining_amount')
        );
    }

    public function test_goal_can_exceed_target_and_progress_can_exceed_100(): void
    {
        $user = $this->makeUser('over-target');
        $goal = $this->makeGoal($user, ['opening_amount' => 800000]);

        FinancialGoalContribution::create([
            'financial_goal_id' => $goal->id,
            'amount' => 450000,
            'contribution_date' => '2026-01-10',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->getJson(
            '/api/financial-goals',
            $this->spaHeaders()
        );

        $response->assertOk();
        $goalData = $response->json('0');

        $this->assertEquals(1250000, $goalData['collected_amount']);
        $this->assertEquals(0, $goalData['remaining_amount']);
        $this->assertEquals(125, $goalData['progress_percentage']);
    }

    public function test_editing_contribution_changes_collected_total(): void
    {
        $user = $this->makeUser('edit-collected');
        $goal = $this->makeGoal($user, ['opening_amount' => 100000]);

        $contribution = FinancialGoalContribution::create([
            'financial_goal_id' => $goal->id,
            'amount' => 50000,
            'contribution_date' => '2026-01-10',
        ]);

        $this->actingAs($user, 'web');

        $this->putJson(
            "/api/financial-goals/{$goal->id}/contributions/{$contribution->id}",
            ['amount' => 120000],
            $this->spaHeaders()
        )->assertOk();

        $response = $this->getJson(
            '/api/financial-goals',
            $this->spaHeaders()
        );

        $this->assertEquals(220000, $response->json('0.collected_amount'));
        $this->assertEquals(120000, $response->json('0.contributions_total'));
    }

    public function test_deleting_contribution_changes_collected_total(): void
    {
        $user = $this->makeUser('delete-collected');
        $goal = $this->makeGoal($user, ['opening_amount' => 100000]);

        $contribution = FinancialGoalContribution::create([
            'financial_goal_id' => $goal->id,
            'amount' => 50000,
            'contribution_date' => '2026-01-10',
        ]);

        $this->actingAs($user, 'web');

        $this->deleteJson(
            "/api/financial-goals/{$goal->id}/contributions/{$contribution->id}",
            [],
            $this->spaHeaders()
        )->assertNoContent();

        $response = $this->getJson(
            '/api/financial-goals',
            $this->spaHeaders()
        );

        $this->assertEquals(100000, $response->json('0.collected_amount'));
        $this->assertEquals(0, $response->json('0.contributions_total'));
    }

    public function test_contributions_do_not_create_or_modify_transactions(): void
    {
        $user = $this->makeUser('transaction-isolation');
        $goal = $this->makeGoal($user);

        Transaction::create([
            'user_id' => $user->id,
            'type' => 'income',
            'amount' => 1000000,
            'transaction_date' => '2026-01-01',
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'type' => 'expense',
            'amount' => 200000,
            'transaction_date' => '2026-01-02',
        ]);

        $transactionCount = Transaction::count();
        $transactionTotal = Transaction::sum('amount');

        $this->actingAs($user, 'web');

        $createResponse = $this->postJson(
            "/api/financial-goals/{$goal->id}/contributions",
            [
                'amount' => 150000,
                'contribution_date' => '2026-03-05',
            ],
            $this->spaHeaders()
        )->assertStatus(201);

        $contributionId = $createResponse->json('id');

        $this->putJson(
            "/api/financial-goals/{$goal->id}/contributions/{$contributionId}",
            ['amount' => 175000],
            $this->spaHeaders()
        )->assertOk();

        $this->deleteJson(
            "/api/financial-goals/{$goal->id}/contributions/{$contributionId}",
            [],
            $this->spaHeaders()
        )->assertNoContent();

        $this->assertDatabaseCount('transactions', $transactionCount);
        $this->assertEquals($transactionTotal, Transaction::sum('amount'));
        $this->assertDatabaseMissing('transactions', ['type' => 'deposit']);
    }

    public function test_legacy_current_amount_is_used_as_opening_amount_on_create(): void
    {
        $user = $this->makeUser('legacy-create');

        $this->actingAs($user, 'web');

        $response = $this->postJson(
            '/api/financial-goals',
            [
                'title' => 'Legacy Savings',
                'target_amount' => 5000000,
                'current_amount' => 750000,
            ],
            $this->spaHeaders()
        );

        $response->assertStatus(201);
        $response->assertJson([
            'opening_amount' => 750000,
            'contributions_total' => 0,
            'collected_amount' => 750000,
            'current_amount' => 750000,
        ]);

        $this->assertDatabaseHas('financial_goals', [
            'user_id' => $user->id,
            'opening_amount' => 750000,
            'current_amount' => 750000,
        ]);

        $this->assertDatabaseCount('financial_goal_contributions', 0);
    }

    public function test_legacy_current_amount_is_backfilled_without_double_counting(): void
    {
        $user = $this->makeUser('legacy-backfill');

        $goal = FinancialGoal::create([
            'user_id' => $user->id,
            'title' => 'Pre Migration Goal',
            'target_amount' => 10000000,
            'opening_amount' => 0,
            'current_amount' => 4000000,
            'status' => 'active',
        ]);

        $migration = require database_path(
            'migrations/2026_10_20_060000_add_opening_amount_to_financial_goals_table.php'
        );

        $migration->up();

        $goal = $goal->fresh();

        $this->assertEquals(4000000, $goal->opening_amount);
        $this->assertEquals(4000000, $goal->current_amount);
        $this->assertEquals(0, $goal->contributions_total);
        $this->assertEquals(4000000, $goal->collected_amount);

        $this->assertDatabaseCount('financial_goal_contributions', 0);
    }

    public function test_legacy_current_amount_update_does_not_double_count_contributions(): void
    {
        $user = $this->makeUser('legacy-update');
        $goal = $this->makeGoal($user, ['opening_amount' => 200000]);

        FinancialGoalContribution::create([
            'financial_goal_id' => $goal->id,
            'amount' => 100000,
            'contribution_date' => '2026-01-10',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->putJson(
            "/api/financial-goals/{$goal->id}",
            ['current_amount' => 350000],
            $this->spaHeaders()
        );

        $response->assertOk();
        $response->assertJson([
            'opening_amount' => 250000,
            'contributions_total' => 100000,
            'collected_amount' => 350000,
            'current_amount' => 350000,
        ]);

        $this->assertEquals(350000, $response->json('collected_amount'));
    }

    public function test_dashboard_active_goal_count_is_unaffected_by_contributions(): void
    {
        $user = $this->makeUser('dashboard');
        $goal = $this->makeGoal($user);

        FinancialGoalContribution::create([
            'financial_goal_id' => $goal->id,
            'amount' => 100000,
            'contribution_date' => '2026-01-10',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->getJson('/api/dashboard', $this->spaHeaders());

        $response->assertOk()->assertJsonPath('active_goals', 1);
    }
}
