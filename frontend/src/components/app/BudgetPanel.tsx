import { useEffect, useState } from "react"
import { Plus, RefreshCw, Wallet } from "lucide-react"

import BudgetForm from "@/components/app/BudgetForm"
import { Badge } from "@/components/ui/badge"
import {
  deleteBudget,
  getBudgets,
  type Budget,
  type BudgetsResponse,
} from "@/lib/api"

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
]

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function getStatusClasses(statusColor: string): string {
  if (statusColor === "red") {
    return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
  }

  if (statusColor === "orange") {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
  }

  return "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
}

function getBarClasses(statusColor: string): string {
  if (statusColor === "red") {
    return "bg-red-500"
  }

  if (statusColor === "orange") {
    return "bg-amber-500"
  }

  return "bg-green-500"
}

function buildYearOptions(selectedYear: number): number[] {
  const currentYear = new Date().getFullYear()
  const years = new Set<number>()

  for (let year = currentYear - 2; year <= currentYear + 2; year += 1) {
    years.add(year)
  }

  years.add(selectedYear)

  return Array.from(years).sort((a, b) => a - b)
}

export default function BudgetPanel() {
  const now = new Date()

  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const [data, setData] = useState<BudgetsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadBudgets() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await getBudgets(year, month)

        if (!cancelled) {
          setData(result)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat budget",
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadBudgets()

    return () => {
      cancelled = true
    }
  }, [year, month, refreshKey])

  function handlePeriodChange(nextYear: number, nextMonth: number) {
    setYear(nextYear)
    setMonth(nextMonth)
    setIsCreating(false)
    setEditingId(null)
  }

  function handleSaved() {
    setIsCreating(false)
    setEditingId(null)
    setRefreshKey((key) => key + 1)
  }

  async function handleDelete(budget: Budget) {
    if (
      !window.confirm(
        `Hapus budget kategori "${budget.category.name}"?`,
      )
    ) {
      return
    }

    setDeletingId(budget.id)
    setError(null)

    try {
      await deleteBudget(budget.id)

      if (editingId === budget.id) {
        setEditingId(null)
      }

      setRefreshKey((key) => key + 1)
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Gagal menghapus budget",
      )
    } finally {
      setDeletingId(null)
    }
  }

  const budgets = data?.budgets ?? []
  const yearOptions = buildYearOptions(year)

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Budget
          </h2>

          <p className="text-gray-500 dark:text-gray-400">
            Atur batas pengeluaran bulanan per kategori.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="budget-period-month" className="sr-only">
            Bulan
          </label>

          <select
            id="budget-period-month"
            value={month}
            onChange={(event) =>
              handlePeriodChange(year, Number(event.target.value))
            }
            className="rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
          >
            {MONTH_NAMES.map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>

          <label htmlFor="budget-period-year" className="sr-only">
            Tahun
          </label>

          <select
            id="budget-period-year"
            value={year}
            onChange={(event) =>
              handlePeriodChange(Number(event.target.value), month)
            }
            className="rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
          >
            {yearOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 rounded bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Tambah Budget
          </button>
        </div>
      </div>

      {isCreating ? (
        <BudgetForm
          key={`create-${year}-${month}`}
          defaultYear={year}
          defaultMonth={month}
          onSaved={handleSaved}
          onCancel={() => setIsCreating(false)}
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
        <div className="p-4 text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-current border-transparent" />

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
            Memuat budget...
          </p>
        </div>
      ) : budgets.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
          <Wallet
            className="mx-auto h-8 w-8 text-gray-400"
            aria-hidden="true"
          />

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Belum ada budget untuk bulan ini.
          </p>

          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="mt-3 inline-flex items-center gap-2 rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Tambah Budget
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {budgets.map((budget) => {
            if (editingId === budget.id) {
              return (
                <BudgetForm
                  key={budget.id}
                  budget={budget}
                  defaultYear={year}
                  defaultMonth={month}
                  onSaved={handleSaved}
                  onCancel={() => setEditingId(null)}
                />
              )
            }

            const limit = Number(budget.limit_amount)
            const used = Number(budget.used_amount)
            const remaining = Number(budget.remaining_amount)
            const overspent = Number(budget.overspent_amount)
            const percentage = Number(budget.percentage)
            const barWidth = Math.min(Math.max(percentage, 0), 100)

            return (
              <div
                key={budget.id}
                className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="min-w-0 break-words font-medium text-gray-900 dark:text-gray-100">
                        {budget.category.name}
                      </h3>

                      <Badge
                        variant="outline"
                        className={getStatusClasses(budget.status_color)}
                      >
                        {budget.status}
                      </Badge>
                    </div>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Limit {formatRupiah(limit)}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatRupiah(used)}
                      {" / "}
                      {formatRupiah(limit)}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {percentage}% terpakai
                    </p>
                  </div>
                </div>

                <div
                  role="progressbar"
                  aria-label={`Pemakaian budget ${budget.category.name}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={barWidth}
                  aria-valuetext={`${percentage}% terpakai`}
                  className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700"
                >
                  <div
                    className={`h-full rounded-full transition-[width] ${getBarClasses(budget.status_color)}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>

                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p
                    className={`text-xs font-medium ${
                      overspent > 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {overspent > 0
                      ? `Melebihi budget ${formatRupiah(overspent)}`
                      : `Sisa ${formatRupiah(remaining)}`}
                  </p>

                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingId(budget.id)}
                      className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleDelete(budget)}
                      disabled={deletingId === budget.id}
                      className="rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      {deletingId === budget.id
                        ? "Menghapus..."
                        : "Hapus"}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
