import { useEffect, useState } from "react"

import {
  ApiError,
  createBudget,
  getCategories,
  updateBudget,
  type Budget,
  type Category,
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

type FieldErrors = Partial<
  Record<"category_id" | "year" | "month" | "limit_amount", string>
>

interface BudgetFormProps {
  budget?: Budget
  defaultYear: number
  defaultMonth: number
  onSaved: () => void
  onCancel?: () => void
}

function buildYearOptions(...extraYears: number[]): number[] {
  const currentYear = new Date().getFullYear()
  const years = new Set<number>()

  for (let year = currentYear - 2; year <= currentYear + 3; year += 1) {
    years.add(year)
  }

  extraYears.forEach((year) => years.add(year))

  return Array.from(years).sort((a, b) => a - b)
}

export default function BudgetForm({
  budget,
  defaultYear,
  defaultMonth,
  onSaved,
  onCancel,
}: BudgetFormProps) {
  const [categoryId, setCategoryId] = useState<number | "">(
    budget?.category_id ?? "",
  )
  const [year, setYear] = useState(budget?.year ?? defaultYear)
  const [month, setMonth] = useState(budget?.month ?? defaultMonth)
  const [limitAmount, setLimitAmount] = useState(
    budget ? String(Math.round(Number(budget.limit_amount))) : "",
  )

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadCategories() {
      setIsLoadingCategories(true)
      setCategoryError(null)

      try {
        const data = await getCategories()

        if (!cancelled) {
          setCategories(data.filter((category) => category.type === "expense"))
        }
      } catch (error) {
        if (!cancelled) {
          setCategoryError(
            error instanceof Error
              ? error.message
              : "Gagal memuat kategori",
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoadingCategories(false)
        }
      }
    }

    void loadCategories()

    return () => {
      cancelled = true
    }
  }, [])

  function validate(): FieldErrors {
    const errors: FieldErrors = {}
    const amount = Number(limitAmount)

    if (categoryId === "") {
      errors.category_id = "Pilih kategori pengeluaran."
    }

    if (!Number.isFinite(amount) || amount < 1) {
      errors.limit_amount = "Limit budget harus lebih dari 0."
    }

    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      errors.year = "Tahun tidak valid."
    }

    if (!Number.isInteger(month) || month < 1 || month > 12) {
      errors.month = "Bulan tidak valid."
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
        category_id: Number(categoryId),
        year,
        month,
        limit_amount: Number(limitAmount),
      }

      if (budget) {
        await updateBudget(budget.id, payload)
      } else {
        await createBudget(payload)
      }

      onSaved()
    } catch (error) {
      if (error instanceof ApiError && error.validationErrors) {
        const nextErrors: FieldErrors = {}

        for (const key of [
          "category_id",
          "year",
          "month",
          "limit_amount",
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
            : "Gagal menyimpan budget",
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const yearOptions = buildYearOptions(defaultYear, budget?.year ?? year)

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
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

      <div>
        <label
          htmlFor="budget-category"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Kategori Pengeluaran
        </label>

        {isLoadingCategories ? (
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Memuat kategori...
          </p>
        ) : categoryError ? (
          <p className="text-sm text-red-500 dark:text-red-300">
            {categoryError}
          </p>
        ) : (
          <select
            id="budget-category"
            value={categoryId}
            onChange={(event) =>
              setCategoryId(
                event.target.value === ""
                  ? ""
                  : Number(event.target.value),
              )
            }
            required
            aria-invalid={Boolean(fieldErrors.category_id)}
            aria-describedby={
              fieldErrors.category_id ? "budget-category-error" : undefined
            }
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="">Pilih kategori</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}

        {fieldErrors.category_id ? (
          <p
            id="budget-category-error"
            className="mt-1 text-xs text-red-600 dark:text-red-400"
          >
            {fieldErrors.category_id}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="budget-month"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Bulan
          </label>

          <select
            id="budget-month"
            value={month}
            onChange={(event) => setMonth(Number(event.target.value))}
            required
            aria-invalid={Boolean(fieldErrors.month)}
            aria-describedby={
              fieldErrors.month ? "budget-month-error" : undefined
            }
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
          >
            {MONTH_NAMES.map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>

          {fieldErrors.month ? (
            <p
              id="budget-month-error"
              className="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {fieldErrors.month}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="budget-year"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Tahun
          </label>

          <select
            id="budget-year"
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            required
            aria-invalid={Boolean(fieldErrors.year)}
            aria-describedby={
              fieldErrors.year ? "budget-year-error" : undefined
            }
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
          >
            {yearOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {fieldErrors.year ? (
            <p
              id="budget-year-error"
              className="mt-1 text-xs text-red-600 dark:text-red-400"
            >
              {fieldErrors.year}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label
          htmlFor="budget-limit"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Limit Budget (IDR)
        </label>

        <input
          id="budget-limit"
          type="number"
          inputMode="numeric"
          min={1}
          value={limitAmount}
          onChange={(event) => setLimitAmount(event.target.value)}
          required
          aria-invalid={Boolean(fieldErrors.limit_amount)}
          aria-describedby={
            fieldErrors.limit_amount ? "budget-limit-error" : undefined
          }
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
        />

        {fieldErrors.limit_amount ? (
          <p
            id="budget-limit-error"
            className="mt-1 text-xs text-red-600 dark:text-red-400"
          >
            {fieldErrors.limit_amount}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Batal
          </button>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || isLoadingCategories || Boolean(categoryError)}
          className="rounded bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Menyimpan..."
            : budget
              ? "Perbarui Budget"
              : "Simpan Budget"}
        </button>
      </div>
    </form>
  )
}
