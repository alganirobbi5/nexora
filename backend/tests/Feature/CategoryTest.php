<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
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

    public function test_unauthenticated_user_cannot_access_categories(): void
    {
        $response = $this->getJson('/api/categories', $this->spaHeaders());

        $response->assertStatus(401);
    }

    public function test_authenticated_user_sees_own_and_global_categories(): void
    {
        $user = User::create([
            'name' => 'Category User',
            'email' => 'catuser@example.com',
            'password' => 'password123',
        ]);

        Category::create([
            'user_id' => $user->id,
            'name' => 'My Salary',
            'type' => 'income',
        ]);

        Category::create([
            'user_id' => null,
            'name' => 'Global Food',
            'type' => 'expense',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->getJson('/api/categories', $this->spaHeaders());

        $response->assertOk()
            ->assertJsonFragment(['name' => 'My Salary'])
            ->assertJsonFragment(['name' => 'Global Food']);
    }

    public function test_authenticated_user_does_not_see_another_users_private_categories(): void
    {
        $userA = User::create([
            'name' => 'User A',
            'email' => 'cata@example.com',
            'password' => 'password123',
        ]);

        $userB = User::create([
            'name' => 'User B',
            'email' => 'catb@example.com',
            'password' => 'password123',
        ]);

        Category::create([
            'user_id' => $userA->id,
            'name' => 'A Category',
            'type' => 'income',
        ]);

        Category::create([
            'user_id' => $userB->id,
            'name' => 'B Private Category',
            'type' => 'expense',
        ]);

        $this->actingAs($userA, 'web');

        $response = $this->getJson('/api/categories', $this->spaHeaders());

        $response->assertOk()
            ->assertJsonFragment(['name' => 'A Category'])
            ->assertJsonMissing(['name' => 'B Private Category']);
    }

    public function test_authenticated_user_can_create_category(): void
    {
        $user = User::create([
            'name' => 'Category Creator',
            'email' => 'catcreate@example.com',
            'password' => 'password123',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->postJson('/api/categories', [
            'name' => 'Salary',
            'type' => 'income',
            'icon' => null,
            'color' => null,
        ], $this->spaHeaders());

        $response->assertStatus(201)
            ->assertJson([
                'name' => 'Salary',
                'type' => 'income',
                'user_id' => $user->id,
            ]);

        $this->assertDatabaseHas('categories', [
            'user_id' => $user->id,
            'name' => 'Salary',
            'type' => 'income',
        ]);
    }

    public function test_request_user_id_is_ignored_on_create(): void
    {
        $userA = User::create([
            'name' => 'Category Owner A',
            'email' => 'catownera@example.com',
            'password' => 'password123',
        ]);

        $userB = User::create([
            'name' => 'Category Owner B',
            'email' => 'catownerb@example.com',
            'password' => 'password123',
        ]);

        $this->actingAs($userA, 'web');

        $response = $this->postJson('/api/categories', [
            'name' => 'Protected Category',
            'type' => 'expense',
            'user_id' => $userB->id,
        ], $this->spaHeaders());

        $response->assertStatus(201)
            ->assertJsonPath('user_id', $userA->id);

        $this->assertDatabaseHas('categories', [
            'name' => 'Protected Category',
            'user_id' => $userA->id,
        ]);
    }

    public function test_invalid_category_returns_422(): void
    {
        $user = User::create([
            'name' => 'Category Validation',
            'email' => 'catvalidation@example.com',
            'password' => 'password123',
        ]);

        $this->actingAs($user, 'web');

        $this->postJson('/api/categories', [
            'type' => 'income',
        ], $this->spaHeaders())
            ->assertStatus(422)
            ->assertJsonValidationErrors('name');

        $this->postJson('/api/categories', [
            'name' => 'Invalid Type',
            'type' => 'invalid',
        ], $this->spaHeaders())
            ->assertStatus(422)
            ->assertJsonValidationErrors('type');
    }

    public function test_authenticated_user_can_update_own_category(): void
    {
        $user = User::create([
            'name' => 'Category Updater',
            'email' => 'catupdate@example.com',
            'password' => 'password123',
        ]);

        $category = Category::create([
            'user_id' => $user->id,
            'name' => 'Old Category',
            'type' => 'expense',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->putJson('/api/categories/' . $category->id, [
            'name' => 'Updated Category',
            'type' => 'income',
            'icon' => 'wallet',
            'color' => '#123456',
        ], $this->spaHeaders());

        $response->assertOk()
            ->assertJson([
                'name' => 'Updated Category',
                'type' => 'income',
            ]);

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Updated Category',
            'type' => 'income',
        ]);
    }

    public function test_authenticated_user_cannot_update_another_users_category(): void
    {
        $userA = User::create([
            'name' => 'Category Owner',
            'email' => 'catowner@example.com',
            'password' => 'password123',
        ]);

        $userB = User::create([
            'name' => 'Category Attacker',
            'email' => 'catattacker@example.com',
            'password' => 'password123',
        ]);

        $category = Category::create([
            'user_id' => $userA->id,
            'name' => 'Private Category',
            'type' => 'expense',
        ]);

        $this->actingAs($userB, 'web');

        $response = $this->putJson('/api/categories/' . $category->id, [
            'name' => 'Hacked',
        ], $this->spaHeaders());

        $response->assertForbidden();
    }

    public function test_authenticated_user_cannot_update_global_category(): void
    {
        $user = User::create([
            'name' => 'Global Category User',
            'email' => 'catglobalupdate@example.com',
            'password' => 'password123',
        ]);

        $category = Category::create([
            'user_id' => null,
            'name' => 'Global Category',
            'type' => 'expense',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->putJson('/api/categories/' . $category->id, [
            'name' => 'Changed Global',
        ], $this->spaHeaders());

        $response->assertForbidden();
    }

    public function test_authenticated_user_can_delete_own_category(): void
    {
        $user = User::create([
            'name' => 'Category Deleter',
            'email' => 'catdelete@example.com',
            'password' => 'password123',
        ]);

        $category = Category::create([
            'user_id' => $user->id,
            'name' => 'Delete Me',
            'type' => 'expense',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->deleteJson(
            '/api/categories/' . $category->id,
            [],
            $this->spaHeaders()
        );

        $response->assertNoContent();

        $this->assertDatabaseMissing('categories', [
            'id' => $category->id,
        ]);
    }

    public function test_authenticated_user_cannot_delete_another_users_category(): void
    {
        $userA = User::create([
            'name' => 'Category Owner Delete',
            'email' => 'catownerdelete@example.com',
            'password' => 'password123',
        ]);

        $userB = User::create([
            'name' => 'Category Unauthorized Delete',
            'email' => 'catunauthorizeddelete@example.com',
            'password' => 'password123',
        ]);

        $category = Category::create([
            'user_id' => $userA->id,
            'name' => 'Protected Category',
            'type' => 'income',
        ]);

        $this->actingAs($userB, 'web');

        $response = $this->deleteJson(
            '/api/categories/' . $category->id,
            [],
            $this->spaHeaders()
        );

        $response->assertForbidden();

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
        ]);
    }

    public function test_authenticated_user_cannot_delete_global_category(): void
    {
        $user = User::create([
            'name' => 'Global Delete User',
            'email' => 'catglobaldelete@example.com',
            'password' => 'password123',
        ]);

        $category = Category::create([
            'user_id' => null,
            'name' => 'Protected Global',
            'type' => 'expense',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->deleteJson(
            '/api/categories/' . $category->id,
            [],
            $this->spaHeaders()
        );

        $response->assertForbidden();

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
        ]);
    }
}