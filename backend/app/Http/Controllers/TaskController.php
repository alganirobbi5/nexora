<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        return Task::query()
            ->where('user_id', $request->user()->id)
            ->orderByRaw("CASE WHEN status = 'pending' THEN 0 ELSE 1 END")
            ->orderByRaw("
                CASE priority
                    WHEN 'high' THEN 0
                    WHEN 'medium' THEN 1
                    WHEN 'low' THEN 2
                    ELSE 3
                END
            ")
            ->orderByRaw("CASE WHEN due_at IS NULL THEN 1 ELSE 0 END")
            ->orderBy('due_at')
            ->orderByDesc('created_at')
            ->get();
    }

    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();

        $task = Task::create([
            ...$data,
            'user_id' => $request->user()->id,
            'status' => $data['status'] ?? 'pending',
            'priority' => $data['priority'] ?? 'medium',
        ]);

        return response()->json($task, 201);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        if ($task->user_id !== $request->user()->id) {
            abort(403);
        }

        $task->update($request->validated());

        return response()->json($task->fresh());
    }

    public function destroy(Request $request, Task $task)
    {
        if ($task->user_id !== $request->user()->id) {
            abort(403);
        }

        $task->delete();

        return response()->noContent();
    }
}
