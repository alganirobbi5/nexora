<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
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

    public function test_registration_succeeds(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ], $this->spaHeaders());

        $response->assertStatus(200);
        $response->assertJson([
            'user' => [
                'email' => 'test@example.com',
            ],
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
        ]);

        $this->assertAuthenticated('web');
    }

    public function test_duplicate_email_fails(): void
    {
        User::create([
            'name' => 'Existing',
            'email' => 'existing@example.com',
            'password' => 'pass',
        ]);

        $response = $this->postJson('/api/register', [
            'name' => 'Test',
            'email' => 'existing@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ], $this->spaHeaders());

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    public function test_login_succeeds(): void
    {
        User::create([
            'name' => 'Log User',
            'email' => 'log@example.com',
            'password' => 'password123',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'log@example.com',
            'password' => 'password123',
        ], $this->spaHeaders());

        $response->assertStatus(200);
        $response->assertJson([
            'user' => [
                'email' => 'log@example.com',
            ],
        ]);

        $this->assertAuthenticated('web');
    }

    public function test_wrong_password_fails(): void
    {
        User::create([
            'name' => 'Test User',
            'email' => 'wp@example.com',
            'password' => 'password123',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'wp@example.com',
            'password' => 'wrongpassword',
        ], $this->spaHeaders());

        $response->assertStatus(401);

        $this->assertGuest('web');
    }

    public function test_authenticated_user_endpoint_succeeds(): void
    {
        $user = User::create([
            'name' => 'Auth User',
            'email' => 'auth@example.com',
            'password' => 'password123',
        ]);

        $this->actingAs($user, 'web');

        $response = $this->getJson('/api/user', $this->spaHeaders());

        $response->assertOk()
            ->assertJsonPath('id', $user->id)
            ->assertJsonPath('name', $user->name)
            ->assertJsonPath('email', $user->email)
            ->assertJsonMissingPath('password')
            ->assertJsonMissingPath('remember_token');
    }

    public function test_unauthenticated_user_returns_401(): void
    {
        $response = $this->getJson('/api/user', $this->spaHeaders());

        $response->assertStatus(401);
    }

    public function test_logout_invalidates_authentication(): void
    {
        User::create([
            'name' => 'Logout User',
            'email' => 'lout@example.com',
            'password' => 'password123',
        ]);

        $loginResponse = $this->postJson('/api/login', [
            'email' => 'lout@example.com',
            'password' => 'password123',
        ], $this->spaHeaders());

        $loginResponse->assertStatus(200);
        $this->assertAuthenticated('web');

        $logoutResponse = $this->postJson(
            '/api/logout',
            [],
            $this->spaHeaders()
        );

        $logoutResponse->assertStatus(200);
        $logoutResponse->assertJson([
            'message' => 'Logged out successfully.',
        ]);

        $this->assertGuest('web');
    }
}