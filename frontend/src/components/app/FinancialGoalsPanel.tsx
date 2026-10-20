import { useEffect, useState } from "react"

import AddFinancialGoalForm from "@/components/app/AddFinancialGoalForm"
import EditFinancialGoalForm from "@/components/app/EditFinancialGoalForm"
import GoalContributions from "@/components/app/GoalContributions"
import { Badge } from "@/components/ui/badge"
import {
  deleteFinancialGoal,
  getFinancialGoals,
  type FinancialGoal,
} from "@/lib/api"

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDeadline(date: string | null): string {
  if (!date) {
    return ""
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

function getProgressDisplay(goal: FinancialGoal): number {
  if (!Number.isFinite(goal.progress_percentage)) {
    return 0
  }

  return Math.max(goal.progress_percentage, 0)
}

export default function FinancialGoalsPanel() {
  const [goals, setGoals] = useState<FinancialGoal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadGoals() {
      setError(null)

      try {
        const data = await getFinancialGoals()

        if (!cancelled) {
          setGoals(data)
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load financial goals",
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadGoals()

    return () => {
      cancelled = true
    }
  }, [refreshKey])

  function handleCreated(goal: FinancialGoal) {
    setGoals((current) => [goal, ...current])
  }

  function handleUpdated(updated: FinancialGoal) {
    setGoals((current) =>
      current.map((goal) =>
        goal.id === updated.id ? updated : goal,
      ),
    )

    setEditingId(null)
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this financial goal?")) {
      return
    }

    setDeletingId(id)
    setError(null)

    try {
      await deleteFinancialGoal(id)

      setGoals((current) =>
        current.filter((goal) => goal.id !== id),
      )

      if (expandedId === id) {
        setExpandedId(null)
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete financial goal",
      )
    } finally {
      setDeletingId(null)
    }
  }

  function handleContributionsChanged() {
    setRefreshKey((key) => key + 1)
  }

  return (
    <div className="space-y-5">
      <AddFinancialGoalForm onCreated={handleCreated} />

      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400 mb-2">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <div className="p-4 text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-current border-transparent" />

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
            Loading financial goals...
          </p>
        </div>
      ) : goals.length === 0 ? (
        error ? null : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No financial goals yet
          </p>
        )
      ) : (
        <div className="space-y-4 max-w-full">
          {goals.map((goal) => {
            if (editingId === goal.id) {
              return (
                <EditFinancialGoalForm
                  key={goal.id}
                  goal={goal}
                  onUpdated={handleUpdated}
                  onCancel={() => setEditingId(null)}
                />
              )
            }

            const progressPercentage = getProgressDisplay(goal)
            const barWidth = Math.min(progressPercentage, 100)
            const roundedPercentage = Math.round(progressPercentage)
            const isExpanded = expandedId === goal.id

            return (
              <div
                key={goal.id}
                className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                      {goal.title}
                    </h3>

                    {goal.deadline ? (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Deadline:{" "}
                        {formatDeadline(goal.deadline)}
                      </p>
                    ) : null}
                  </div>

                  <Badge variant="outline">
                    {goal.status}
                  </Badge>
                </div>

                <div className="mt-3 flex items-end gap-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Terkumpul
                    </p>

                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(goal.collected_amount)}
                      {" / "}
                      {formatCurrency(goal.target_amount)}
                    </p>
                  </div>

                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {roundedPercentage}%
                  </span>
                </div>

                <div
                  role="progressbar"
                  aria-label={`Progres ${goal.title}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(barWidth)}
                  aria-valuetext={`${roundedPercentage}% terkumpul`}
                  className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700"
                >
                  <div
                    className="h-full rounded-full bg-gray-900 transition-[width] ease-[width] duration-750 dark:bg-gray-100"
                    style={{
                      width: `${barWidth}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>Saldo awal: {formatCurrency(goal.opening_amount)}</span>
                  <span>Setoran: {formatCurrency(goal.contributions_total)}</span>
                  <span>
                    {goal.remaining_amount > 0
                      ? `Sisa: ${formatCurrency(goal.remaining_amount)}`
                      : "Target tercapai"}
                  </span>
                </div>

                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : goal.id)
                    }
                    aria-expanded={isExpanded}
                    aria-controls={
                      isExpanded
                        ? `goal-contributions-${goal.id}`
                        : undefined
                    }
                    className="self-start rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    {isExpanded
                      ? "Sembunyikan Setoran"
                      : "Riwayat Setoran"}
                  </button>

                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingId(goal.id)}
                      className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleDelete(goal.id)}
                      disabled={deletingId === goal.id}
                      className="rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      {deletingId === goal.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>

                {isExpanded ? (
                  <div
                    id={`goal-contributions-${goal.id}`}
                    className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-700"
                  >
                    <GoalContributions
                      goalId={goal.id}
                      onChanged={handleContributionsChanged}
                    />
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
