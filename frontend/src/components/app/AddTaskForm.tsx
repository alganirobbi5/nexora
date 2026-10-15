import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  createTask,
  type Task,
} from "@/lib/api"

interface AddTaskFormProps {
  onCreated: (task: Task) => void
}

export function AddTaskForm({ onCreated }: AddTaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] =
    useState<"low" | "medium" | "high">("medium")
  const [dueAt, setDueAt] = useState("")
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
      const task = await createTask({
        title: title.trim(),
        description: description.trim() || null,
        priority,
        due_at: dueAt || null,
      })

      onCreated(task)

      setTitle("")
      setDescription("")
      setPriority("medium")
      setDueAt("")
    } catch {
      setError("Gagal menambahkan task")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
<Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Judul task"
        className="rounded-md border bg-background px-3 py-2 text-sm"
      />

      <Input
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Deskripsi"
        className="rounded-md border bg-background px-3 py-2 text-sm"
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

      <Input
        type="datetime-local"
        value={dueAt}
        onChange={(event) => setDueAt(event.target.value)}
        className="rounded-md border bg-background px-3 py-2 text-sm"
      />

      {error ? (
        <p className="text-sm text-destructive mb-2">{error}</p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Menyimpan..." : "Tambah Task"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setTitle("")
            setDescription("")
            setPriority("medium")
            setDueAt("")
          }}
          disabled={saving}
        >
          Batal
        </Button>
      </div>
    </form>
  )
}
