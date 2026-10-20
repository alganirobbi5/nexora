import { useEffect, useState } from "react"
import { Plus, RefreshCw } from "lucide-react"

import {
  ApiError,
  createGoalContribution,
  deleteGoalContribution,
  getGoalContributions,
  updateGoalContribution,
  type GoalContribution,
} from "@/lib/api"

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10)
}

type FieldErrors = Partial<
  Record<"amount" | "contribution_date" | "note", string>
>

interface ContributionFormProps {
  goalId: number
  contribution?: GoalContribution
  onSubmitted: () => void
  onCancel: () => void
}

function ContributionForm({
  goalId,
  contribution,
  onSubmitted,
  onCancel,
}: ContributionFormProps) {
  const [amount, setAmount] = useState(
    contribution ? String(contribution.amount) : "",
  )
  const [contributionDate, setContributionDate] = useState(
    contribution
      ? contribution.contribution_date.slice(0, 10)
      : todayISODate(),
  )
  const [note, setNote] = useState(contribution?.note ?? "")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

  function validate(): FieldErrors {
    const errors: FieldErrors = {}
    const numericAmount = Number(amount)

    if (
      amount === "" ||
      !Number.isInteger(numericAmount) ||
      numericAmount < 1
    ) {
      errors.amount = "Jumlah setoran harus lebih dari 0."
    }

    if (!contributionDate) {
      errors.contribution_date = "Tanggal setoran wajib diisi."
    } else if (Number.isNaN(new Date(contributionDate).getTime())) {
      errors.contribution_date = "Tanggal setoran tidak valid."
    }

    if (note.trim().length > 255) {
      errors.note = "Catatan maksimal 255 karakter."
    }

    return errors
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const errors = validate()

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsSubmitting(true)
    setFieldErrors({})
    setGeneralError(null)

    try {
      const payload = {
        amount: Number(amount),
        contribution_date: contributionDate,
        note: note.trim() ? note.trim() : null,
      }

      if (contribution) {
        await updateGoalContribution(goalId, contribution.id, payload)
      } else {
        await createGoalContribution(goalId, payload)
      }

      onSubmitted()
    } catch (error) {
      if (error instanceof ApiError && error.validationErrors) {
        const nextErrors: FieldErrors = {}

        for (const key of [
          "amount",
          "contribution_date",
          "note",
        ] as const) {
          const messages = error.validationErrors[key]

          if (messages && messages.length > 0) {
            nextErrors[key] = messages[0]
          }
        }

        if (Object.keys(nextErrors).length > 0) {
          setFieldErrors(nextErrors)
        } else {
          setGeneralError(error.message)
        }
      } else {
        setGeneralError(
          error instanceof Error
            ? error.message
            : "Gagal menyimpan setoran",
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/40"
      noValidate
    >
      {generalError ? (
        <p
          role="alert"
          className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400"
        >
          {generalError}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`contribution-amount-${goalId}`}
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Jumlah Setoran (IDR)
          </label>

          <input
            id={`contribution-amount-${goalId}`}
            type="number"
            inputMode="numeric"
            min={1}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
            aria-invalid={Boolean(fieldErrors.amount)}
            aria-describedby={
              fieldErrors.amount
                ? `contribution-amount-error-${goalId}`
                : undefined
            }
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
          />

          {fieldErrors.amount ? (
            <p
              id={`contribution-amount-error-${goalId}`}
              className="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {fieldErrors.amount}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor={`contribution-date-${goalId}`}
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Tanggal Setoran
          </label>

          <input
            id={`contribution-date-${goalId}`}
            type="date"
            value={contributionDate}
            onChange={(event) => setContributionDate(event.target.value)}
            required
            aria-invalid={Boolean(fieldErrors.contribution_date)}
            aria-describedby={
              fieldErrors.contribution_date
                ? `contribution-date-error-${goalId}`
                : undefined
            }
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
          />

          {fieldErrors.contribution_date ? (
            <p
              id={`contribution-date-error-${goalId}`}
              className="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {fieldErrors.contribution_date}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label
          htmlFor={`contribution-note-${goalId}`}
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Catatan (opsional)
        </label>

        <input
          id={`contribution-note-${goalId}`}
          type="text"
          value={note}
          maxLength={255}
          onChange={(event) => setNote(event.target.value)}
          aria-invalid={Boolean(fieldErrors.note)}
          aria-describedby={
            fieldErrors.note
              ? `contribution-note-error-${goalId}`
              : undefined
          }
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
        />

        {fieldErrors.note ? (
          <p
            id={`contribution-note-error-${goalId}`}
            className="mt-1 text-xs text-red-600 dark:text-red-400"
          >
            {fieldErrors.note}
          </p>
        ) : null}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Setoran ini hanya mencatat alokasi tabungan dan tidak membuat
        transaksi pemasukan/pengeluaran.
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Menyimpan..."
            : contribution
              ? "Perbarui Setoran"
              : "Simpan Setoran"}
        </button>
      </div>
    </form>
  )
}

interface GoalContributionsProps {
  goalId: number
  onChanged: () => void
}

export default function GoalContributions({
  goalId,
  onChanged,
}: GoalContributionsProps) {
  const [contributions, setContributions] = useState<GoalContribution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadContributions() {
      setError(null)

      try {
        const data = await getGoalContributions(goalId)

        if (!cancelled) {
          setContributions(data)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat setoran",
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadContributions()

    return () => {
      cancelled = true
    }
  }, [goalId, refreshKey])

  function refreshAll() {
    setIsAdding(false)
    setEditingId(null)
    setRefreshKey((key) => key + 1)
    onChanged()
  }

  async function handleDelete(contribution: GoalContribution) {
    if (
      !window.confirm(
        `Hapus setoran ${formatCurrency(contribution.amount)}?`,
      )
    ) {
      return
    }

    setDeletingId(contribution.id)
    setError(null)

    try {
      await deleteGoalContribution(goalId, contribution.id)

      refreshAll()
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Gagal menghapus setoran",
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Riwayat Setoran
        </h4>

        {!isAdding ? (
          <button
            type="button"
            onClick={() => {
              setEditingId(null)
              setIsAdding(true)
            }}
            className="inline-flex items-center gap-1.5 rounded border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Tambah Setoran
          </button>
        ) : null}
      </div>

      {isAdding ? (
        <ContributionForm
          goalId={goalId}
          onSubmitted={refreshAll}
          onCancel={() => setIsAdding(false)}
        />
      ) : null}

      {error ? (
        <div className="flex flex-col gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400 sm:flex-row sm:items-center sm:justify-between">
          <p role="alert">{error}</p>

          <button
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            className="inline-flex items-center gap-2 rounded border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/60"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Coba lagi
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Memuat setoran...
        </p>
      ) : error ? null : contributions.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Belum ada setoran.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {contributions.map((contribution) => (
            <li key={contribution.id} className="py-2.5">
              {editingId === contribution.id ? (
                <ContributionForm
                  goalId={goalId}
                  contribution={contribution}
                  onSubmitted={refreshAll}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(contribution.amount)}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(contribution.contribution_date)}
                    </p>

                    {contribution.note ? (
                      <p className="mt-1 break-words text-xs text-gray-600 dark:text-gray-300">
                        {contribution.note}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2 sm:shrink-0 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAdding(false)
                        setEditingId(contribution.id)
                      }}
                      className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleDelete(contribution)}
                      disabled={deletingId === contribution.id}
                      className="rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      {deletingId === contribution.id
                        ? "Menghapus..."
                        : "Hapus"}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
