<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Transaction;
use App\Models\Category;
use App\Models\CategoryBudget;

class CategoryBudgetTest extends TestCase
{
    use RefreshDatabase;

    private function assertFirstBudgetUsage($response, array $expected): void
    {
        $response->assertOk();

        $budget = $response->json("budgets.0");
        $this->assertNotNull($budget, "No budget returned for the requested month.");

        foreach ($expected as $key => $value) {
            $this->assertEquals($value, $budget[$key], "Unexpected {$key} in budget response.");
        }
    }

    /** @test */
    public function test_unauthenticated_user_cannot_create_budget()
    {
        $this->postJson("/api/budgets", [
            "category_id" => 1,
            "year" => 2026,
            "month" => 3,
            "limit_amount" => 5000,
        ])
            ->assertUnauthorized();
    }

    /** @test */
    public function test_authenticated_user_can_create_budget()
    {
        $user = User::create(["name" => "Test User", "email" => "test@example.com", "password" => bcrypt("password")]);
        $category = Category::create(["user_id" => $user->id, "name" => "Food", "type" => "expense", "icon" => "fork-and-knife", "color" => "#ff6b6b"]);

        $this->actingAs($user, "web")
            ->postJson("/api/budgets", [
                "category_id" => $category->id,
                "year" => 2026,
                "month" => 3,
                "limit_amount" => 5000,
            ])
            ->assertStatus(201)
            ->assertJsonStructure([
                "id",
                "category_id",
                "category",
                "year",
                "month",
                "limit_amount",
                "message",
            ]);
    }

    /** @test */
    public function test_authenticated_user_can_list_budgets_for_month()
    {
        $user = User::create(["name" => "Test User", "email" => "test@example.com", "password" => bcrypt("password")]);
        $category = Category::create(["user_id" => $user->id, "name" => "Food", "type" => "expense", "icon" => "fork-and-knife", "color" => "#ff6b6b"]);

        CategoryBudget::create([
            "user_id" => $user->id,
            "category_id" => $category->id,
            "year" => 2026,
            "month" => 3,
            "limit_amount" => 5000,
        ]);

        $response = $this->actingAs($user, "web")
            ->getJson("/api/budgets?year=2026&month=3");

        $response->assertOk()->assertJsonCount(1, "budgets");
        $this->assertFirstBudgetUsage($response, [
            "year" => 2026,
            "month" => 3,
            "limit_amount" => 5000,
        ]);
    }

    /** @test */
    public function test_authenticated_user_can_list_budgets_without_filters()
    {
        $user = User::create(["name" => "Test User", "email" => "test@example.com", "password" => bcrypt("password")]);
        $category = Category::create(["user_id" => $user->id, "name" => "Food", "type" => "expense", "icon" => "fork-and-knife", "color" => "#ff6b6b"]);

        CategoryBudget::create([
            "user_id" => $user->id,
            "category_id" => $category->id,
            "year" => 2026,
            "month" => 3,
            "limit_amount" => 5000,
        ]);

        $this->actingAs($user, "web")
            ->getJson("/api/budgets")
            ->assertOk()
            ->assertJsonCount(1, "budgets");
    }

    /** @test */
    public function test_authenticated_user_can_update_own_budget()
    {
        $user = User::create(["name" => "Test User", "email" => "test@example.com", "password" => bcrypt("password")]);
        $category = Category::create(["user_id" => $user->id, "name" => "Food", "type" => "expense", "icon" => "fork-and-knife", "color" => "#ff6b6b"]);

        $budget = CategoryBudget::create([
            "user_id" => $user->id,
            "category_id" => $category->id,
            "year" => 2026,
            "month" => 3,
            "limit_amount" => 5000,
        ]);

        $this->actingAs($user, "web")
            ->putJson("/api/budgets/{$budget->id}", [
                "limit_amount" => 7500,
            ])
            ->assertOk()
            ->assertJson(["limit_amount" => 7500]);
    }

    /** @test */
    public function test_user_cannot_update_another_users_budget()
    {
        $user1 = User::create(["name" => "User One", "email" => "user1@example.com", "password" => bcrypt("password")]);
        $user2 = User::create(["name" => "User Two", "email" => "user2@example.com", "password" => bcrypt("password")]);
        $category = Category::create(["user_id" => $user1->id, "name" => "Food", "type" => "expense", "icon" => "fork-and-knife", "color" => "#ff6b6b"]);

        $budget = CategoryBudget::create([
            "user_id" => $user1->id,
            "category_id" => $category->id,
            "year" => 2026,
            "month" => 3,
            "limit_amount" => 5000,
        ]);

        $this->actingAs($user2, "web")
            ->putJson("/api/budgets/{$budget->id}", [
                "limit_amount" => 7500,
            ])
            ->assertForbidden();
    }

    /** @test */
    public function test_authenticated_user_can_delete_own_budget()
    {
        $user = User::create(["name" => "Test User", "email" => "test@example.com", "password" => bcrypt("password")]);
        $category = Category::create(["user_id" => $user->id, "name" => "Food", "type" => "expense", "icon" => "fork-and-knife", "color" => "#ff6b6b"]);

        $budget = CategoryBudget::create([
            "user_id" => $user->id,
            "category_id" => $category->id,
            "year" => 2026,
            "month" => 3,
            "limit_amount" => 5000,
        ]);

        $this->actingAs($user, "web")
            ->deleteJson("/api/budgets/{$budget->id}")
            ->assertOk()
            ->assertJson(["message" => "Budget deleted successfully"]);

        $this->assertDatabaseMissing("category_budgets", ["id" => $budget->id]);
    }

    /** @test */
    public function test_user_cannot_delete_another_users_budget()
    {
        $user1 = User::create(["name" => "User One", "email" => "user1@example.com", "password" => bcrypt("password")]);
        $user2 = User::create(["name" => "User Two", "email" => "user2@example.com", "password" => bcrypt("password")]);
        $category = Category::create(["user_id" => $user1->id, "name" => "Food", "type" => "expense", "icon" => "fork-and-knife", "color" => "#ff6b6b"]);

        $budget = CategoryBudget::create([
            "user_id" => $user1->id,
            "category_id" => $category->id,
            "year" => 2026,
            "month" => 3,
            "limit_amount" => 5000,
        ]);

        $this->actingAs($user2, "web")
            ->deleteJson("/api/budgets/{$budget->id}")
            ->assertForbidden();
    }

    /** @test */
    public function test_category_must_belong_to_authenticated_user()
    {
        $user = User::create(["name" => "Test User", "email" => "test@example.com", "password" => bcrypt("password")]);
        $otherUserCategory = Category::create(["user_id" => User::create(["name" => "Other User", "email" => "other@example.com", "password" => bcrypt("password")])->id, "name" => "Food", "type" => "expense", "icon" => "fork-and-knife", "color" => "#ff6b6b"]);

        $this->actingAs($user, "web")
            ->postJson("/api/budgets", [
                "category_id" => $otherUserCategory->id,
                "year" => 2026,
                "month" => 3,
                "limit_amount" => 5000,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors("category_id");
    }

    /** @test */
    public function test_category_must_be_expense_type()
    {
        $user = User::create(["name" => "Test User", "email" => "test@example.com", "password" => bcrypt("password")]);
        $incomeCategory = Category::create(["user_id" => $user->id, "name" => "Food", "type" => "income", "icon" => "fork-and-knife", "color" => "#ff6b6b"]);

        $this->actingAs($user, "web")
            ->postJson("/api/budgets", [
                "category_id" => $incomeCategory->id,
                "year" => 2026,
                "month" => 3,
                "limit_amount" => 5000,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors("category_id");
    }

    /** @test */
    public function test_duplicate_user_category_year_month_rejected()
    {
        $user = User::create(["name" => "Test User", "email" => "test@example.com", "password" => bcrypt("password")]);
        $category = Category::create(["user_id" => $user->id, "name" => "Food", "type" => "expense", "icon" => "fork-and-knife", "color" => "#ff6b6b"]);

        CategoryBudget::create([
            "user_id" => $user->id,
            "category_id" => $category->id,
            "year" => 2026,
            "month" => 3,
            "limit_amount" => 5000,
        ]);

        $this->actingAs($user, "web")
            ->postJson("/api/budgets", [
                "category_id" => $category->id,
                "year" => 2026,
                "month" => 3,
                "limit_amount" => 7500,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors("category_id");
    }

    /** @test */
    public function test_limit_amount_must_be_greater_than_zero()
    {
        $user = User::create(["name" => "Test User", "email" => "test@example.com", "password" => bcrypt("password")]);
        $category = Category::create(["user_id" => $user->id, "name" => "Food", "type" => "expense", "icon" => "fork-and-knife", "color" => "#ff6b6b"]);

        $this->actingAs($user, "web")
            ->postJson("/api/budgets", [
                "category_id" => $category->id,
                "year" => 2026,
                "month" => 3,
                "limit_amount" => 0,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors("limit_amount");

        $this->actingAs($user, "web")
            ->postJson("/api/budgets", [
                "category_id" => $category->id,
                "year" => 2026,
                "month" => 3,
                "limit_amount" => -100,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors("limit_amount");
    }

    /** @test */
    public function test_month_must_be_between_1_and_12()
    {
        $user = User::create(["name" => "Test User", "email" => "test@example.com", "password" => bcrypt("password")]);
        $category = Category::create(["user_id" => $user->id, "name" => "Food", "type" => "expense", "icon" => "fork-and-knife", "color" => "#ff6b6b"]);

        $this->actingAs($user, "web")
            ->postJson("/api/budgets", [
                "category_id" => $category->id,
                "year" => 2026,
                "month" => 13,
                "limit_amount" => 5000,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors("month");

        $this->actingAs($user, "web")
            ->postJson("/api/budgets", [
                "category_id" => $category->id,
                "year" => 2026,
                "month" => 0,
                "limit_amount" => 5000,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors("month");
    }

    /** @test */
    public function test_used_amount_calculated_from_matching_expense_transactions()
    {
        $user = User::create(["name" => "Test User", "email" => "test@example.com", "password" => bcrypt("password")]);
        $category = Category::create(["user_id" => $user->id, "name" => "Food", "type" => "expense", "icon" => "fork-and-knife", "color" => "#ff6b6b"]);

        $budget = CategoryBudget::create([
            "user_id" => $user->id,
            "category_id" => $category->id,
            "year" => 2026,
            "month" => 3,
            "limit_amount" => 5000,
        ]);

        Transaction::create([
            "user_id" => $user->id,
            "type" => "expense",
            "category_id" => $category->id,
            "amount" => 1200,
            "transaction_date" => "2026-03-15",
        ]);

        Transaction::create([
            "user_id" => $user->id,
            "type" => "expense",
            "category_id" => $category->id,
            "amount" => 800,
            "transaction_date" => "2026-03-20",
        ]);

        $response = $this->actingAs($user, "web")
            ->getJson("/api/budgets?year=2026&month=3");

        $this->assertFirstBudgetUsage($response, [
            "used_amount" => 2000,
            "remaining_amount" => 3000,
            "overspent_amount" => 0,
            "percentage" => 40,
        ]);
    }

    /** @test */
    public function test_income_transactions_do_not_count_toward_usage()
    {
        $user = User::create(["name" => "Test User", "email" => "test@example.com", "password" => bcrypt("password")]);
        $category = Category::create(["user_id" => $user->id, "name" => "Food", "type" => "expense", "icon" => "fork-and-knife", "color" => "#ff6b6b"]);

        $budget = CategoryBudget::create([
            "user_id" => $user->id,
            "category_id" => $category->id,
            "year" => 2026,
            "month" => 3,
            "limit_amount" => 5000,
        ]);

        Transaction::create([
            "user_id" => $user->id,
            "type" => "income",
            "category_id" => $category->id,
            "amount" => 3000,
            "transaction_date" => "2026-03-15",
        ]);

        Transaction::create([
            "user_id" => $user->id,
            "type" => "expense",
            "category_id" => $category->id,
            "amount" => 2000,
            "transaction_date" => "2026-03-20",
        ]);

        $response = $this->actingAs($user, "web")
            ->getJson("/api/budgets?year=2026&month=3");

        $this->assertFirstBudgetUsage($response, [
            "used_amount" => 2000,
            "remaining_amount" => 3000,
            "overspent_amount" => 0,
            "percentage" => 40,
        ]);
    }

    /** @test */
    public function test_transaction_edit_changes_used_amount()
    {
        $user = User::create(["name" => "Test User", "email" => "test@example.com", "password" => bcrypt("password")]);
        $category = Category::create(["user_id" => $user->id, "name" => "Food", "type" => "expense", "icon" => "fork-and-knife", "color" => "#ff6b6b"]);

        $budget = CategoryBudget::create([
            "user_id" => $user->id,
            "category_id" => $category->id,
            "year" => 2026,
            "month" => 3,
            "limit_amount" => 5000,
        ]);

        $transaction = Transaction::create([
            "user_id" => $user->id,
            "type" => "expense",
            "category_id" => $category->id,
            "amount" => 1000,
            "transaction_date" => "2026-03-15",
        ]);

        $this->actingAs($user, "web")
            ->putJson("/api/transactions/{$transaction->id}", [
                "amount" => 3000,
            ])
            ->assertOk();

        $this->assertDatabaseHas("transactions", [
            "id" => $transaction->id,
            "amount" => 3000,
        ]);

        $response = $this->actingAs($user, "web")
            ->getJson("/api/budgets?year=2026&month=3");

        $this->assertFirstBudgetUsage($response, [
            "used_amount" => 3000,
            "remaining_amount" => 2000,
            "overspent_amount" => 0,
            "percentage" => 60,
        ]);
    }

    /** @test */
    public function test_transaction_delete_changes_used_amount()
    {
        $user = User::create(["name" => "Test User", "email" => "test@example.com", "password" => bcrypt("password")]);
        $category = Category::create(["user_id" => $user->id, "name" => "Food", "type" => "expense", "icon" => "fork-and-knife", "color" => "#ff6b6b"]);

        $budget = CategoryBudget::create([
            "user_id" => $user->id,
            "category_id" => $category->id,
            "year" => 2026,
            "month" => 3,
            "limit_amount" => 5000,
        ]);

        $t1 = Transaction::create([
            "user_id" => $user->id,
            "type" => "expense",
            "category_id" => $category->id,
            "amount" => 1000,
            "transaction_date" => "2026-03-15",
        ]);

        $t2 = Transaction::create([
            "user_id" => $user->id,
            "type" => "expense",
            "category_id" => $category->id,
            "amount" => 2000,
            "transaction_date" => "2026-03-20",
        ]);

        $response = $this->actingAs($user, "web")
            ->getJson("/api/budgets?year=2026&month=3");

        $this->assertFirstBudgetUsage($response, ["used_amount" => 3000]);

        $this->actingAs($user, "web")
            ->deleteJson("/api/transactions/{$t1->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing("transactions", ["id" => $t1->id]);

        $response = $this->actingAs($user, "web")
            ->getJson("/api/budgets?year=2026&month=3");

        $this->assertFirstBudgetUsage($response, [
            "used_amount" => 2000,
            "remaining_amount" => 3000,
            "overspent_amount" => 0,
            "percentage" => 40,
        ]);
    }

    /** @test */
    public function test_over_budget_percentage_greater_than_100()
    {
        $user = User::create(["name" => "Test User", "email" => "test@example.com", "password" => bcrypt("password")]);
        $category = Category::create(["user_id" => $user->id, "name" => "Food", "type" => "expense", "icon" => "fork-and-knife", "color" => "#ff6b6b"]);

        $budget = CategoryBudget::create([
            "user_id" => $user->id,
            "category_id" => $category->id,
            "year" => 2026,
            "month" => 3,
            "limit_amount" => 5000,
        ]);

        Transaction::create([
            "user_id" => $user->id,
            "type" => "expense",
            "category_id" => $category->id,
            "amount" => 7000,
            "transaction_date" => "2026-03-15",
        ]);

        $response = $this->actingAs($user, "web")
            ->getJson("/api/budgets?year=2026&month=3");

        $this->assertFirstBudgetUsage($response, [
            "used_amount" => 7000,
            "remaining_amount" => 0,
            "overspent_amount" => 2000,
            "percentage" => 140,
        ]);

        $budgetData = $response->json("budgets.0");
        $this->assertEquals("Melebihi budget", $budgetData["status"]);
    }

    /** @test */
    public function test_remaining_amount_never_below_zero()
    {
        $user = User::create(["name" => "Test User", "email" => "test@example.com", "password" => bcrypt("password")]);
        $category = Category::create(["user_id" => $user->id, "name" => "Food", "type" => "expense", "icon" => "fork-and-knife", "color" => "#ff6b6b"]);

        $budget = CategoryBudget::create([
            "user_id" => $user->id,
            "category_id" => $category->id,
            "year" => 2026,
            "month" => 3,
            "limit_amount" => 5000,
        ]);

        Transaction::create([
            "user_id" => $user->id,
            "type" => "expense",
            "category_id" => $category->id,
            "amount" => 2500,
            "transaction_date" => "2026-03-15",
        ]);

        $response = $this->actingAs($user, "web")
            ->getJson("/api/budgets?year=2026&month=3");

        $this->assertFirstBudgetUsage($response, [
            "used_amount" => 2500,
            "remaining_amount" => 2500,
            "overspent_amount" => 0,
        ]);

        $budgetData = $response->json("budgets.0");
        $this->assertGreaterThanOrEqual(0, $budgetData["remaining_amount"]);
    }

    /** @test */
    public function test_overspent_amount_correct_when_over_budget()
    {
        $user = User::create(["name" => "Test User", "email" => "test@example.com", "password" => bcrypt("password")]);
        $category = Category::create(["user_id" => $user->id, "name" => "Food", "type" => "expense", "icon" => "fork-and-knife", "color" => "#ff6b6b"]);

        $budget = CategoryBudget::create([
            "user_id" => $user->id,
            "category_id" => $category->id,
            "year" => 2026,
            "month" => 3,
            "limit_amount" => 5000,
        ]);

        Transaction::create([
            "user_id" => $user->id,
            "type" => "expense",
            "category_id" => $category->id,
            "amount" => 6500,
            "transaction_date" => "2026-03-15",
        ]);

        $response = $this->actingAs($user, "web")
            ->getJson("/api/budgets?year=2026&month=3");

        $this->assertFirstBudgetUsage($response, [
            "used_amount" => 6500,
            "remaining_amount" => 0,
            "overspent_amount" => 1500,
        ]);

        $budgetData = $response->json("budgets.0");
        $this->assertEquals(1500, $budgetData["overspent_amount"]);
    }

    /** @test */
    public function test_wrong_month_does_not_count_toward_usage()
    {
        $user = User::create(["name" => "Test User", "email" => "test@example.com", "password" => bcrypt("password")]);
        $category = Category::create(["user_id" => $user->id, "name" => "Food", "type" => "expense", "icon" => "fork-and-knife", "color" => "#ff6b6b"]);

        $budget = CategoryBudget::create([
            "user_id" => $user->id,
            "category_id" => $category->id,
            "year" => 2026,
            "month" => 3,
            "limit_amount" => 5000,
        ]);

        Transaction::create([
            "user_id" => $user->id,
            "type" => "expense",
            "category_id" => $category->id,
            "amount" => 3000,
            "transaction_date" => "2026-02-15",
        ]);

        $response = $this->actingAs($user, "web")
            ->getJson("/api/budgets?year=2026&month=3");

        $this->assertFirstBudgetUsage($response, [
            "used_amount" => 0,
            "remaining_amount" => 5000,
            "overspent_amount" => 0,
            "percentage" => 0,
        ]);
    }

    /** @test */
    public function test_wrong_category_does_not_count_toward_usage()
    {
        $user = User::create(["name" => "Test User", "email" => "test@example.com", "password" => bcrypt("password")]);
        $category1 = Category::create(["user_id" => $user->id, "name" => "Food", "type" => "expense", "icon" => "fork-and-knife", "color" => "#ff6b6b"]);
        $category2 = Category::create(["user_id" => $user->id, "name" => "Travel", "type" => "expense", "icon" => "car", "color" => "#4ecdc4"]);

        $budget = CategoryBudget::create([
            "user_id" => $user->id,
            "category_id" => $category1->id,
            "year" => 2026,
            "month" => 3,
            "limit_amount" => 5000,
        ]);

        Transaction::create([
            "user_id" => $user->id,
            "type" => "expense",
            "category_id" => $category2->id,
            "amount" => 3000,
            "transaction_date" => "2026-03-15",
        ]);

        $response = $this->actingAs($user, "web")
            ->getJson("/api/budgets?year=2026&month=3");

        $this->assertFirstBudgetUsage($response, [
            "used_amount" => 0,
            "remaining_amount" => 5000,
            "overspent_amount" => 0,
            "percentage" => 0,
        ]);
    }
}