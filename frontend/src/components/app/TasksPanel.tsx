import { useEffect, useState } from "react"

import { AddTaskForm } from "@/components/app/AddTaskForm"
import { EditTaskForm } from "@/components/app/EditTaskForm"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  deleteTask,
  getTasks,
  updateTask,
  type Task,
} from "@/lib/api"

function formatDueDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

export function TasksPanel() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(() => setError("Gagal memuat tasks"))
      .finally(() => setLoading(false))
  }, [])

  function handleCreated(task: Task) {
    setTasks((current) => [task, ...current])
  }

  function handleUpdated(updated: Task) {
    setTasks((current) =>
      current.map((task) =>
        task.id === updated.id ? updated : task,
      ),
    )

    setEditingId(null)
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Hapus task ini?")) {
      return
    }

    try {
      await deleteTask(id)
      setTasks((current) =>
        current.filter((task) => task.id !== id),
      )
    } catch {
      setError("Gagal menghapus task")
    }
  }

  async function handleToggle(task: Task) {
    try {
      const updated = await updateTask(task.id, {
        status:
          task.status === "pending"
            ? "completed"
            : "pending",
      })

      handleUpdated(updated)
    } catch {
      setError("Gagal mengubah status task")
    }
  }

  return (
    <div className="space-y-5">
      <AddTaskForm onCreated={handleCreated} />

      {error ? (
        <p className="text-sm text-destructive mb-2">{error}</p>
      ) : null}

      {loading ? (
        <p className="text-sm text-muted-foreground">
          Memuat tasks...
        </p>
      ) : null}

      {!loading && tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No tasks yet.
        </p>
      ) : null}

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-xl border p-4"
          >
            {editingId === task.id ? (
              <EditTaskForm
                task={task}
                onUpdated={handleUpdated}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-medium line-clamp-1">
                      {task.title}
                    </h3>

                    {task.description ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    ) : null}

                    {task.due_at ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Jatuh tempo:{" "}
                        {formatDueDate(task.due_at)}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Badge variant="outline">
                      {task.priority}
                    </Badge>

                    <Badge variant="secondary">
                      {task.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggle(task)}
                  >
                    {task.status === "pending"
                      ? "Selesaikan"
                      : "Buka Lagi"}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingId(task.id)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      void handleDelete(task.id)
                    }
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}