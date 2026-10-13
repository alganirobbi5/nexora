import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  updateTask,
  type Task,
} from "@/lib/api"

interface EditTaskFormProps {
  task: Task
  onUpdated: (task: Task) => void
  onCancel: () => void
}

export function EditTaskForm({
  task,
  onUpdated,
  onCancel,
}: EditTaskFormProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? "")
  const [priority, setPriority] = useState(task.priority)
  const [status, setStatus] = useState(task.status)
  const [dueAt, setDueAt] = useState(
    task.due_at ? task.due_at.slice(0, 16) : "",
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!title.trim()) {
      setError("Judul task wajib diisi")
      return
    }

    setSaving(true)
    setError(null)

    try {
      const updated = await updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || null,
        priority,
        status,
        due_at: dueAt || null,
      })

      onUpdated(updated)
    } catch {
      setError("Gagal memperbarui task")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <Input
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <select
        value={priority}
        onChange={(event) =>
          setPriority(
            event.target.value as "low" | "medium" | "high",
          )
        }
        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select
        value={status}
        onChange={(event) =>
          setStatus(
            event.target.value as "pending" | "completed",
          )
        }
        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
      >
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>

      <Input
        type="datetime-local"
        value={dueAt}
        onChange={(event) => setDueAt(event.target.value)}
      />

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Batal
        </Button>
      </div>
    </form>
  )
}
