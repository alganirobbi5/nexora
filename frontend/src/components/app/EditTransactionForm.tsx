import { useEffect, useState } from "react"

import type { Category, Transaction } from "@/lib/api"
import { getCategories, updateTransaction } from "@/lib/api"

interface FormErrors {
  type?: string
  amount?: string
  description?: string
  transaction_date?: string
  general?: string
}

interface FormState {
  type: "income" | "expense"
  amount: number
  description: string | null
  transaction_date: string
  category_id: number | null
  isSubmitting: boolean
  errors: FormErrors
}

interface EditTransactionFormProps {
  transaction: Transaction
  onSaved?: (updated: Transaction) => void
  onCancelled?: () => void
}

export default function EditTransactionForm({
  transaction,
  onSaved,
  onCancelled,
}: EditTransactionFormProps) {
  const [state, setState] = useState<FormState>({
    type: transaction.type,
    amount: transaction.amount,
    description: transaction.description,
    transaction_date: transaction.transaction_date,
    category_id: transaction.category_id ?? null,
    isSubmitting: false,
    errors: {},
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [categoryError, setCategoryError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCategories() {
      setIsLoadingCategories(true)
      setCategoryError(null)

      try {
        const data = await getCategories()
        setCategories(data)

        setState((prev) => {
          if (prev.category_id === null) {
            return prev
          }

          const categoryStillValid = data.some(
            (category) =>
              category.id === prev.category_id &&
              category.type === prev.type,
          )

          return categoryStillValid
            ? prev
            : { ...prev, category_id: null }
        })
      } catch (error) {
        setCategoryError(
          error instanceof Error
            ? error.message
            : "Failed to load categories",
        )
      } finally {
        setIsLoadingCategories(false)
      }
    }

    void loadCategories()
  }, [])

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target

    setState((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }))
  }

  function handleTypeChange(newType: "income" | "expense") {
    setState((prev) => {
      const categoryMatchesType =
        prev.category_id === null ||
        categories.some(
          (category) =>
            category.id === prev.category_id &&
            category.type === newType,
        )

      return {
        ...prev,
        type: newType,
        category_id: categoryMatchesType
          ? prev.category_id
          : null,
        errors: {
          ...prev.errors,
          type: undefined,
        },
      }
    })
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault()

    if (state.amount <= 0) {
      setState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          amount: "Amount must be greater than 0",
        },
      }))
      return
    }

    setState((prev) => ({
      ...prev,
      isSubmitting: true,
      errors: {},
    }))

    try {
      const updated = await updateTransaction(transaction.id, {
        type: state.type,
        amount: state.amount,
        description: state.description,
        transaction_date: state.transaction_date,
        category_id: state.category_id,
      })

      onSaved?.(updated)
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        errors: {
          general:
            error instanceof Error
              ? error.message
              : "Failed to update transaction",
        },
      }))
    }
  }

  function handleCancel() {
    setState({
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      transaction_date: transaction.transaction_date,
      category_id: transaction.category_id ?? null,
      isSubmitting: false,
      errors: {},
    })

    onCancelled?.()
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {state.errors.general ? (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
          {state.errors.general}
        </p>
      ) : null}

      <div>
        <p className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
          Type
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            aria-pressed={state.type === "income"}
            className={`flex-1 rounded border px-3 py-2 text-sm font-medium transition-colors ${
              state.type === "income"
                ? "border-green-300 bg-green-100 text-green-800"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            }`}
          >
            Income
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            aria-pressed={state.type === "expense"}
            className={`flex-1 rounded border px-3 py-2 text-sm font-medium transition-colors ${
              state.type === "expense"
                ? "border-red-300 bg-red-100 text-red-800"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            }`}
          >
            Expense
          </button>
        </div>

        {state.errors.type ? (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {state.errors.type}
          </p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
          Amount
        </label>

        <input
          type="number"
          name="amount"
          value={state.amount}
          onChange={handleChange}
          min={1}
          required
          aria-invalid={Boolean(state.errors.amount)}
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
        />

        {state.errors.amount ? (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {state.errors.amount}
          </p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
          Description
        </label>

        <textarea
          name="description"
          value={state.description ?? ""}
          onChange={handleChange}
          rows={2}
          aria-invalid={Boolean(state.errors.description)}
          className="w-full resize-none rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
        />

        {state.errors.description ? (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {state.errors.description}
          </p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
          Transaction Date
        </label>

        <input
          type="date"
          name="transaction_date"
          value={state.transaction_date}
          onChange={handleChange}
          required
          aria-invalid={Boolean(state.errors.transaction_date)}
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
        />

        {state.errors.transaction_date ? (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {state.errors.transaction_date}
          </p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
          Category
        </label>

        {isLoadingCategories ? (
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Loading categories...
          </p>
        ) : categoryError ? (
          <p className="text-sm text-red-500 dark:text-red-300">
            {categoryError}
          </p>
        ) : (
          <select
            value={state.category_id ?? ""}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                category_id:
                  event.target.value === ""
                    ? null
                    : Number(event.target.value),
              }))
            }
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="">No category</option>

            {categories
              .filter(
                (category) => category.type === state.type,
              )
              .map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
          </select>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={state.isSubmitting}
          className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={state.isSubmitting}
          className="rounded bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state.isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  )
}