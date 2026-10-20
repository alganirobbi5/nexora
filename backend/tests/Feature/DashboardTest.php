<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\FinancialGoal;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class DashboardTest extends TestCase
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
            'name' => 'Dashboard User '.$suffix,
            'email' => 'dashboard-'.$suffix.'@example.com',
            'password' => bcrypt('password'),
        ]);
    }

    private function makeCategory(
        User $user,
        string $name,
        string $type = 'expense'
    ): Category {
        return Category::create([
            'user_id' => $user->id,
            'name' => $name,
            'type' => $type,
        ]);
    }

    private function makeTransaction(User $user, array $attributes): Transaction
    {
        return Transaction::create(array_merge([
            'user_id' => $user->id,
            'type' => 'expense',
            'amount' => 1000,
            'transaction_date' => '2026-03-01',
        ], $attributes));
    }

    public function test_unauthenticated_request_returns_401(): void
    {
        $response = $this->getJson('/api/dashboard', $this->spaHeaders());

        $response->assertUnauthorized();
    }

    public function test_dashboard_defaults_to_current_period_and_zero_fills(): void
    {
        $this->travelTo(Carbon::create(2026, 3, 15, 12, 0, 0));

        $user = $this->makeUser('defaults');

        $response = $this->actingAs($user, 'web')
            ->getJson('/api/dashboard', $this->spaHeaders());

        $response->assertOk()
            ->assertJsonPath('selected_year', 2026)
            ->assertJsonPath('selected_month', 3)
            ->assertJsonPath('monthly_income', 0)
            ->assertJsonPath('monthly_expenses', 0)
            ->assertJsonPath('net_cash_flow', 0)
            ->assertJsonPath('active_goals', 0)
            ->assertJsonCount(6, 'six_month_trend')
            ->assertJsonCount(0, 'category_breakdown')
            ->assertJsonCount(0, 'recent_transactions');

        foreach ($response->json('six_month_trend') as $month) {
            $this->assertEquals(0, $month['income']);
            $this->assertEquals(0, $month['expenses']);
            $this->assertEquals(0, $month['net_cash_flow']);
            $this->assertArrayHasKey('label', $month);
        }
    }

    public function test_dashboard_defaults_to_current_month_when_transactions_exist(): void
    {
        $this->travelTo(Carbon::create(2026, 3, 15, 12, 0, 0));

        $user = $this->makeUser('defaults-data');

        $this->makeTransaction($user, [
            'type' => 'income',
            'amount' => 300000,
            'transaction_date' => '2026-03-05',
        ]);

        $this->makeTransaction($user, [
            'type' => 'income',
            'amount' => 900000,
            'transaction_date' => '2026-02-05',
        ]);

        $response = $this->actingAs($user, 'web')
            ->getJson('/api/dashboard', $this->spaHeaders());

        $response->assertOk()
            ->assertJsonPath('selected_year', 2026)
            ->assertJsonPath('selected_month', 3)
            ->assertJsonPath('monthly_income', 300000);
    }

    public function test_monthly_income_expenses_and_net_cash_flow_use_selected_month(): void
    {
        $user = $this->makeUser('monthly');

        $this->makeTransaction($user, [
            'type' => 'income',
            'amount' => 1000000,
            'transaction_date' => '2026-03-01',
        ]);

        $this->makeTransaction($user, [
            'type' => 'income',
            'amount' => 500000,
            'transaction_date' => '2026-03-31',
        ]);

        $this->makeTransaction($user, [
            'type' => 'income',
            'amount' => 9000000,
            'transaction_date' => '2026-02-28',
        ]);

        $this->makeTransaction($user, [
            'type' => 'expense',
            'amount' => 300000,
            'transaction_date' => '2026-03-15',
        ]);

        $this->makeTransaction($user, [
            'type' => 'expense',
            'amount' => 2000000,
            'transaction_date' => '2026-04-01',
        ]);

        $response = $this->actingAs($user, 'web')
            ->getJson('/api/dashboard?year=2026&month=3', $this->spaHeaders());

        $response->assertOk()
            ->assertJsonPath('monthly_income', 1500000)
            ->assertJsonPath('monthly_expenses', 300000)
            ->assertJsonPath('net_cash_flow', 1200000);
    }

    public function test_net_cash_flow_can_be_negative(): void
    {
        $user = $this->makeUser('negative');

        $this->makeTransaction($user, [
            'type' => 'income',
            'amount' => 100000,
            'transaction_date' => '2026-03-01',
        ]);

        $this->makeTransaction($user, [
            'type' => 'expense',
            'amount' => 250000,
            'transaction_date' => '2026-03-02',
        ]);

        $response = $this->actingAs($user, 'web')
            ->getJson('/api/dashboard?year=2026&month=3', $this->spaHeaders());

        $response->assertOk()->assertJsonPath('net_cash_flow', -150000);
    }

    public function test_dashboard_uses_transaction_date_instead_of_created_at(): void
    {
        $user = $this->makeUser('dates');

        $included = $this->makeTransaction($user, [
            'type' => 'income',
            'amount' => 700000,
            'transaction_date' => '2026-03-10',
        ]);

        DB::table('transactions')
            ->where('id', $included->id)
            ->update(['created_at' => '2020-01-01 00:00:00']);

        $excluded = $this->makeTransaction($user, [
            'type' => 'income',
            'amount' => 800000,
            'transaction_date' => '2026-02-10',
        ]);

        DB::table('transactions')
            ->where('id', $excluded->id)
            ->update(['created_at' => '2026-03-15 00:00:00']);

        $response = $this->actingAs($user, 'web')
            ->getJson('/api/dashboard?year=2026&month=3', $this->spaHeaders());

        $response->assertOk()->assertJsonPath('monthly_income', 700000);
    }

    public function test_selected_year_filters_transactions(): void
    {
        $user = $this->makeUser('year-filter');

        $this->makeTransaction($user, [
            'type' => 'income',
            'amount' => 111000,
            'transaction_date' => '2025-03-10',
        ]);

        $this->makeTransaction($user, [
            'type' => 'income',
            'amount' => 222000,
            'transaction_date' => '2026-03-10',
        ]);

        $this->actingAs($user, 'web')
            ->getJson('/api/dashboard?year=2025&month=3', $this->spaHeaders())
            ->assertOk()
            ->assertJsonPath('monthly_income', 111000);

        $this->actingAs($user, 'web')
            ->getJson('/api/dashboard?year=2026&month=3', $this->spaHeaders())
            ->assertOk()
            ->assertJsonPath('monthly_income', 222000);
    }

    public function test_other_users_data_is_excluded(): void
    {
        $userA = $this->makeUser('isolation-a');
        $userB = $this->makeUser('isolation-b');

        $categoryB = $this->makeCategory($userB, 'Other Food');

        $this->makeTransaction($userB, [
            'type' => 'income',
            'amount' => 99999999,
            'transaction_date' => '2026-03-10',
        ]);

        $this->makeTransaction($userB, [
            'type' => 'expense',
            'amount' => 88888888,
            'category_id' => $categoryB->id,
            'transaction_date' => '2026-03-11',
        ]);

        $response = $this->actingAs($userA, 'web')
            ->getJson('/api/dashboard?year=2026&month=3', $this->spaHeaders());

        $response->assertOk()
            ->assertJsonPath('monthly_income', 0)
            ->assertJsonPath('monthly_expenses', 0)
            ->assertJsonPath('net_cash_flow', 0)
            ->assertJsonCount(0, 'category_breakdown')
            ->assertJsonCount(0, 'recent_transactions');
    }

    public function test_six_month_trend_returns_exactly_six_zero_filled_months(): void
    {
        $user = $this->makeUser('trend');

        $this->makeTransaction($user, [
            'type' => 'income',
            'amount' => 500000,
            'transaction_date' => '2026-03-10',
        ]);

        $this->makeTransaction($user, [
            'type' => 'expense',
            'amount' => 100000,
            'transaction_date' => '2026-01-10',
        ]);

        $response = $this->actingAs($user, 'web')
            ->getJson('/api/dashboard?year=2026&month=3', $this->spaHeaders());

        $response->assertOk()->assertJsonCount(6, 'six_month_trend');

        $trend = $response->json('six_month_trend');

        $expectedMonths = [
            [2025, 10],
            [2025, 11],
            [2025, 12],
            [2026, 1],
            [2026, 2],
            [2026, 3],
        ];

        foreach ($expectedMonths as $index => [$year, $month]) {
            $this->assertEquals($year, $trend[$index]['year']);
            $this->assertEquals($month, $trend[$index]['month']);
        }

        $this->assertEquals(100000, $trend[3]['expenses']);
        $this->assertEquals(500000, $trend[5]['income']);
        $this->assertEquals(0, $trend[0]['income']);
        $this->assertEquals(0, $trend[0]['expenses']);
        $this->assertEquals(0, $trend[0]['net_cash_flow']);
        $this->assertEquals(0, $trend[4]['income']);
    }

    public function test_six_month_trend_handles_year_boundary(): void
    {
        $user = $this->makeUser('year-boundary');

        $response = $this->actingAs($user, 'web')
            ->getJson('/api/dashboard?year=2026&month=1', $this->spaHeaders());

        $response->assertOk()->assertJsonCount(6, 'six_month_trend');

        $trend = $response->json('six_month_trend');

        $expectedMonths = [
            [2025, 8],
            [2025, 9],
            [2025, 10],
            [2025, 11],
            [2025, 12],
            [2026, 1],
        ];

        foreach ($expectedMonths as $index => [$year, $month]) {
            $this->assertEquals($year, $trend[$index]['year']);
            $this->assertEquals($month, $trend[$index]['month']);
        }
    }

    public function test_category_breakdown_groups_only_selected_month_expenses(): void
    {
        $user = $this->makeUser('breakdown');
        $otherUser = $this->makeUser('breakdown-other');

        $food = $this->makeCategory($user, 'Food');
        $transport = $this->makeCategory($user, 'Transport');
        $salary = $this->makeCategory($user, 'Salary', 'income');
        $otherFood = $this->makeCategory($otherUser, 'Food');

        $this->makeTransaction($user, [
            'type' => 'expense',
            'amount' => 100000,
            'category_id' => $food->id,
            'transaction_date' => '2026-03-05',
        ]);

        $this->makeTransaction($user, [
            'type' => 'expense',
            'amount' => 50000,
            'category_id' => $food->id,
            'transaction_date' => '2026-03-20',
        ]);

        $this->makeTransaction($user, [
            'type' => 'expense',
            'amount' => 100000,
            'category_id' => $transport->id,
            'transaction_date' => '2026-03-10',
        ]);

        $this->makeTransaction($user, [
            'type' => 'income',
            'amount' => 5000000,
            'category_id' => $salary->id,
            'transaction_date' => '2026-03-01',
        ]);

        $this->makeTransaction($user, [
            'type' => 'expense',
            'amount' => 999000,
            'category_id' => $food->id,
            'transaction_date' => '2026-02-10',
        ]);

        $this->makeTransaction($otherUser, [
            'type' => 'expense',
            'amount' => 888000,
            'category_id' => $otherFood->id,
            'transaction_date' => '2026-03-10',
        ]);

        $response = $this->actingAs($user, 'web')
            ->getJson('/api/dashboard?year=2026&month=3', $this->spaHeaders());

        $response->assertOk()->assertJsonCount(2, 'category_breakdown');

        $breakdown = $response->json('category_breakdown');

        $this->assertEquals($food->id, $breakdown[0]['category_id']);
        $this->assertEquals('Food', $breakdown[0]['category_name']);
        $this->assertEquals(150000, $breakdown[0]['amount']);
        $this->assertEquals(60, $breakdown[0]['percentage']);

        $this->assertEquals($transport->id, $breakdown[1]['category_id']);
        $this->assertEquals('Transport', $breakdown[1]['category_name']);
        $this->assertEquals(100000, $breakdown[1]['amount']);
        $this->assertEquals(40, $breakdown[1]['percentage']);
    }

    public function test_category_breakdown_ties_are_ordered_by_name(): void
    {
        $user = $this->makeUser('breakdown-ties');

        $beta = $this->makeCategory($user, 'Beta');
        $alpha = $this->makeCategory($user, 'Alpha');

        $this->makeTransaction($user, [
            'type' => 'expense',
            'amount' => 100000,
            'category_id' => $beta->id,
            'transaction_date' => '2026-03-05',
        ]);

        $this->makeTransaction($user, [
            'type' => 'expense',
            'amount' => 100000,
            'category_id' => $alpha->id,
            'transaction_date' => '2026-03-06',
        ]);

        $response = $this->actingAs($user, 'web')
            ->getJson('/api/dashboard?year=2026&month=3', $this->spaHeaders());

        $breakdown = $response->json('category_breakdown');

        $this->assertEquals('Alpha', $breakdown[0]['category_name']);
        $this->assertEquals('Beta', $breakdown[1]['category_name']);
    }

    public function test_category_breakdown_is_empty_when_there_are_no_expenses(): void
    {
        $user = $this->makeUser('no-expenses');

        $this->makeTransaction($user, [
            'type' => 'income',
            'amount' => 500000,
            'transaction_date' => '2026-03-05',
        ]);

        $response = $this->actingAs($user, 'web')
            ->getJson('/api/dashboard?year=2026&month=3', $this->spaHeaders());

        $response->assertOk()
            ->assertJsonPath('monthly_expenses', 0)
            ->assertJsonCount(0, 'category_breakdown');

        $this->assertSame([], $response->json('category_breakdown'));
    }

    public function test_recent_transactions_are_limited_and_ordered_by_date_then_id(): void
    {
        $user = $this->makeUser('recent');

        $first = $this->makeTransaction($user, [
            'type' => 'expense',
            'amount' => 10000,
            'transaction_date' => '2026-03-01',
        ]);

        $second = $this->makeTransaction($user, [
            'type' => 'expense',
            'amount' => 20000,
            'transaction_date' => '2026-03-02',
        ]);

        $third = $this->makeTransaction($user, [
            'type' => 'expense',
            'amount' => 30000,
            'transaction_date' => '2026-03-03',
        ]);

        $fourth = $this->makeTransaction($user, [
            'type' => 'expense',
            'amount' => 40000,
            'transaction_date' => '2026-03-04',
        ]);

        $fifth = $this->makeTransaction($user, [
            'type' => 'expense',
            'amount' => 50000,
            'transaction_date' => '2026-03-05',
        ]);

        $this->makeTransaction($user, [
            'type' => 'expense',
            'amount' => 60000,
            'transaction_date' => '2026-03-06',
        ]);

        $otherUser = $this->makeUser('recent-other');

        $this->makeTransaction($otherUser, [
            'type' => 'expense',
            'amount' => 999999,
            'transaction_date' => '2026-03-31',
        ]);

        $response = $this->actingAs($user, 'web')
            ->getJson('/api/dashboard?year=2026&month=3', $this->spaHeaders());

        $response->assertOk()->assertJsonCount(5, 'recent_transactions');

        $recent = $response->json('recent_transactions');

        $this->assertEquals(60000, $recent[0]['amount']);
        $this->assertEquals(50000, $recent[1]['amount']);
        $this->assertEquals(40000, $recent[2]['amount']);
        $this->assertEquals(30000, $recent[3]['amount']);
        $this->assertEquals(20000, $recent[4]['amount']);

        $this->assertNotContains($first->id, array_column($recent, 'id'));
        $this->assertContains($second->id, array_column($recent, 'id'));
        $this->assertContains($third->id, array_column($recent, 'id'));
        $this->assertContains($fourth->id, array_column($recent, 'id'));
        $this->assertContains($fifth->id, array_column($recent, 'id'));
    }

    public function test_recent_transactions_with_same_date_are_ordered_by_id_desc(): void
    {
        $user = $this->makeUser('recent-same-date');

        $older = $this->makeTransaction($user, [
            'type' => 'expense',
            'amount' => 10000,
            'transaction_date' => '2026-03-10',
        ]);

        $newer = $this->makeTransaction($user, [
            'type' => 'expense',
            'amount' => 20000,
            'transaction_date' => '2026-03-10',
        ]);

        $response = $this->actingAs($user, 'web')
            ->getJson('/api/dashboard?year=2026&month=3', $this->spaHeaders());

        $recent = $response->json('recent_transactions');

        $this->assertEquals($newer->id, $recent[0]['id']);
        $this->assertEquals($older->id, $recent[1]['id']);
    }

    public function test_recent_transactions_include_description_and_category(): void
    {
        $user = $this->makeUser('recent-fields');
        $food = $this->makeCategory($user, 'Food');

        $this->makeTransaction($user, [
            'type' => 'expense',
            'amount' => 50000,
            'description' => 'Lunch',
            'category_id' => $food->id,
            'transaction_date' => '2026-03-10',
        ]);

        $response = $this->actingAs($user, 'web')
            ->getJson('/api/dashboard?year=2026&month=3', $this->spaHeaders());

        $response->assertOk();

        $recent = $response->json('recent_transactions.0');

        $this->assertEquals('expense', $recent['type']);
        $this->assertEquals(50000, $recent['amount']);
        $this->assertEquals('Lunch', $recent['description']);
        $this->assertEquals('2026-03-10', $recent['transaction_date']);
        $this->assertEquals($food->id, $recent['category_id']);
        $this->assertEquals('Food', $recent['category']['name']);
    }

    public function test_invalid_month_returns_validation_error(): void
    {
        $user = $this->makeUser('invalid-month');

        foreach ([0, 13, 'abc'] as $month) {
            $this->actingAs($user, 'web')
                ->getJson(
                    "/api/dashboard?year=2026&month={$month}",
                    $this->spaHeaders()
                )
                ->assertStatus(422)
                ->assertJsonValidationErrors('month');
        }
    }

    public function test_invalid_year_returns_validation_error(): void
    {
        $user = $this->makeUser('invalid-year');

        foreach (['abc', 1800, 2200] as $year) {
            $this->actingAs($user, 'web')
                ->getJson(
                    "/api/dashboard?year={$year}&month=3",
                    $this->spaHeaders()
                )
                ->assertStatus(422)
                ->assertJsonValidationErrors('year');
        }
    }

    public function test_active_goals_counts_only_active_goals(): void
    {
        $user = $this->makeUser('goals');

        $this->makeGoal($user, 'active');
        $this->makeGoal($user, 'active');
        $this->makeGoal($user, 'completed');
        $this->makeGoal($user, 'archived');

        $response = $this->actingAs($user, 'web')
            ->getJson('/api/dashboard?year=2026&month=3', $this->spaHeaders());

        $response->assertOk()->assertJsonPath('active_goals', 2);
    }

    private function makeGoal(User $user, string $status): FinancialGoal
    {
        return FinancialGoal::create([
            'user_id' => $user->id,
            'title' => 'Goal '.$status.' '.uniqid(),
            'target_amount' => 1000000,
            'opening_amount' => 0,
            'current_amount' => 0,
            'status' => $status,
        ]);
    }
}
