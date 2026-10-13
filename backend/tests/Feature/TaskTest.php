<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    private function spaHeaders(): array
    {
        return [
            'Origin' => 'http://localhost:5173',
            'Referer' => 'http://localhost:5173/',
            'Accept' => 'application/json',
        ];
    }

    private function createUser(string $email): User
    {
        return User::create([
            'name' => 'Test User',
            'email' => $email,
            'password' => bcrypt('password'),
        ]);
    }

    public function test_unauthenticated_user_cannot_access_tasks(): void
    {
        $this->getJson('/api/tasks', $this->spaHeaders())
            ->assertStatus(401);
    }

    public function test_authenticated_user_sees_only_own_tasks(): void
    {
        $userA = $this->createUser('task-user-1@example.com');
        $userB = $this->createUser('task-user-2@example.com');

        Task::create([
            'user_id' => $userA->id,
            'title' => 'My Task',
            'status' => 'pending',
            'priority' => 'medium',
        ]);

        Task::create([
            'user_id' => $userB->id,
            'title' => 'Other Task',
            'status' => 'pending',
            'priority' => 'medium',
        ]);

        $this->actingAs($userA, 'web');

        $this->getJson('/api/tasks', $this->spaHeaders())
            ->assertOk()
            ->assertJsonFragment(['title' => 'My Task'])
            ->assertJsonMissing(['title' => 'Other Task']);
    }

    public function test_tasks_are_ordered_correctly(): void
    {
        $user = $this->createUser('task-user-3@example.com');

        Task::create([
            'user_id' => $user->id,
            'title' => 'Low Pending',
            'status' => 'pending',
            'priority' => 'low',
            'due_at' => now()->addDays(2),
        ]);

        Task::create([
            'user_id' => $user->id,
            'title' => 'High Pending',
            'status' => 'pending',
            'priority' => 'high',
            'due_at' => now()->addDays(5),
        ]);

        Task::create([
            'user_id' => $user->id,
            'title' => 'Completed High',
            'status' => 'completed',
            'priority' => 'high',
            'due_at' => now()->addDay(),
        ]);

        $this->actingAs($user, 'web');

        $response = $this->getJson('/api/tasks', $this->spaHeaders());

        $response->assertOk();
        $response->assertJsonPath('0.title', 'High Pending');
        $response->assertJsonPath('1.title', 'Low Pending');
        $response->assertJsonPath('2.title', 'Completed High');
    }

    public function test_authenticated_user_can_create_task(): void
    {
        $user = $this->createUser('task-user-4@example.com');

        $this->actingAs($user, 'web');

        $response = $this->postJson('/api/tasks', [
            'title' => 'Finish portfolio',
            'description' => 'Complete NEXORA tasks feature',
            'status' => 'pending',
            'priority' => 'high',
            'due_at' => '2026-12-31 18:00:00',
        ], $this->spaHeaders());

        $response->assertStatus(201)
            ->assertJsonPath('user_id', $user->id);

        $this->assertDatabaseHas('tasks', [
            'user_id' => $user->id,
            'title' => 'Finish portfolio',
            'status' => 'pending',
            'priority' => 'high',
        ]);
    }

    public function test_create_uses_defaults(): void
    {
        $user = $this->createUser('task-user-5@example.com');

        $this->actingAs($user, 'web');

        $this->postJson('/api/tasks', [
            'title' => 'Default Task',
        ], $this->spaHeaders())
            ->assertStatus(201)
            ->assertJson([
                'status' => 'pending',
                'priority' => 'medium',
            ]);
    }

    public function test_request_user_id_is_ignored_on_create(): void
    {
        $userA = $this->createUser('task-user-6@example.com');
        $userB = $this->createUser('task-user-7@example.com');

        $this->actingAs($userA, 'web');

        $this->postJson('/api/tasks', [
            'title' => 'Protected Task',
            'user_id' => $userB->id,
        ], $this->spaHeaders())
            ->assertStatus(201)
            ->assertJsonPath('user_id', $userA->id);
    }

    public function test_invalid_create_request_returns_422(): void
    {
        $user = $this->createUser('task-user-8@example.com');

        $this->actingAs($user, 'web');

        $this->postJson('/api/tasks', [
            'status' => 'invalid',
            'priority' => 'urgent',
            'due_at' => 'not-a-date',
        ], $this->spaHeaders())
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'title',
                'status',
                'priority',
                'due_at',
            ]);
    }

    public function test_authenticated_user_can_update_own_task(): void
    {
        $user = $this->createUser('task-user-9@example.com');

        $task = Task::create([
            'user_id' => $user->id,
            'title' => 'Old Task',
            'status' => 'pending',
            'priority' => 'low',
        ]);

        $this->actingAs($user, 'web');

        $this->putJson('/api/tasks/' . $task->id, [
            'title' => 'Updated Task',
            'description' => 'Updated description',
            'status' => 'completed',
            'priority' => 'high',
            'due_at' => '2027-01-01 10:00:00',
        ], $this->spaHeaders())
            ->assertOk();

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Updated Task',
            'status' => 'completed',
            'priority' => 'high',
        ]);
    }

    public function test_authenticated_user_cannot_update_another_users_task(): void
    {
        $userA = $this->createUser('task-user-10@example.com');
        $userB = $this->createUser('task-user-11@example.com');

        $task = Task::create([
            'user_id' => $userB->id,
            'title' => 'Other Task',
            'status' => 'pending',
            'priority' => 'medium',
        ]);

        $this->actingAs($userA, 'web');

        $this->putJson('/api/tasks/' . $task->id, [
            'title' => 'Hacked',
        ], $this->spaHeaders())
            ->assertForbidden();
    }

    public function test_user_id_cannot_be_changed_through_update(): void
    {
        $userA = $this->createUser('task-user-12@example.com');
        $userB = $this->createUser('task-user-13@example.com');

        $task = Task::create([
            'user_id' => $userA->id,
            'title' => 'Mine',
            'status' => 'pending',
            'priority' => 'medium',
        ]);

        $this->actingAs($userA, 'web');

        $this->putJson('/api/tasks/' . $task->id, [
            'title' => 'Still Mine',
            'user_id' => $userB->id,
        ], $this->spaHeaders())
            ->assertOk();

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'user_id' => $userA->id,
        ]);
    }

    public function test_authenticated_user_can_delete_own_task(): void
    {
        $user = $this->createUser('task-user-14@example.com');

        $task = Task::create([
            'user_id' => $user->id,
            'title' => 'Delete Me',
            'status' => 'pending',
            'priority' => 'medium',
        ]);

        $this->actingAs($user, 'web');

        $this->deleteJson('/api/tasks/' . $task->id, [], $this->spaHeaders())
            ->assertNoContent();

        $this->assertDatabaseMissing('tasks', [
            'id' => $task->id,
        ]);
    }

    public function test_authenticated_user_cannot_delete_another_users_task(): void
    {
        $userA = $this->createUser('task-user-15@example.com');
        $userB = $this->createUser('task-user-16@example.com');

        $task = Task::create([
            'user_id' => $userB->id,
            'title' => 'Protected Task',
            'status' => 'pending',
            'priority' => 'medium',
        ]);

        $this->actingAs($userA, 'web');

        $this->deleteJson('/api/tasks/' . $task->id, [], $this->spaHeaders())
            ->assertForbidden();

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
        ]);
    }
}

