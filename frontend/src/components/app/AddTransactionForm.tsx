import { useState, useEffect } from 'react'
import type { Category, Transaction } from '@/lib/api'
import { createTransaction, getCategories } from '@/lib/api'

interface FormErrors {
  type?: string
  amount?: string
  description?: string
  transaction_date?: string
  general?: string
}

interface FormState {
  type: 'income' | 'expense'
  amount: number
  description: string | null
  transaction_date: string
  category_id: number | null
  isSubmitting: boolean
  errors: FormErrors
  success: boolean
}

interface AddTransactionFormProps {
  onCreated?: (transaction: Transaction) => void
}

export default function AddTransactionForm({
  onCreated,
}: AddTransactionFormProps) {
  const [state, setState] = useState<FormState>({
    type: 'income',
    amount: 0,
    description: null,
    transaction_date: new Date().toISOString().split('T')[0],
    category_id: null,
    isSubmitting: false,
    errors: {},
    success: false,
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
      } catch (err: any) {
        setCategoryError(err.message || 'Failed to load categories')
      } finally {
        setIsLoadingCategories(false)
      }
    }

    void loadCategories()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setState((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }))
  }

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setState((prev) => {
      // If current category belongs to old type, reset to null
      const categoryMatchesType =
        categories.length === 0 ||
        categories.some(
          (cat) => cat.id === prev.category_id && cat.type === newType,
        )
      if (!categoryMatchesType && prev.category_id !== null) {
        return {
          ...prev,
          category_id: null,
          type: newType,
        }
      }
      return { ...prev, type: newType }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setState((prev) => ({ ...prev, isSubmitting: true, errors: {}, success: false }))

    try {
      const transaction = await createTransaction({
        type: state.type,
        amount: state.amount,
        description: state.description,
        transaction_date: state.transaction_date,
        category_id: state.category_id,
      })

      setState({
        type: 'income',
        amount: 0,
        description: null,
        transaction_date: new Date().toISOString().split('T')[0],
        category_id: null,
        isSubmitting: false,
        errors: {},
        success: true,
      })

      onCreated?.(transaction)
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        errors: {
          general: err.message || 'Failed to create transaction',
        },
      }))
    }
  }

  if (state.success) {
    return (
      <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg text-green-200 text-center mb-4">
        <p className="font-medium">Transaction created successfully</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Type
        </label>
        <div className="flex space-x-2">
          <label
            className={`flex-1 py-2 px-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${state.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            onClick={() => handleTypeChange("income")}
            aria-pressed={state.type === 'income'}
          >
            Income
          </label>
          <label
            className={`flex-1 py-2 px-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${state.type === 'expense' ? 'bg-red-100 text-red-800' : ''}`}
            onClick={() => handleTypeChange("expense")}
            aria-pressed={state.type === 'expense'}
          >
            Expense
          </label>
        </div>
        {state.type === 'income' && state.errors.type && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">Select income or expense</p>
        )}
        {state.type === 'expense' && state.errors.type && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">Select income or expense</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Amount
        </label>
        <input
          type="number"
          name="amount"
          value={state.amount.toString()}
          onChange={handleChange}
          className="w-full py-2 px-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          min="1"
          required
          aria-invalid={!!state.errors.amount}
        />
        {state.errors.amount && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">{state.errors.amount}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={state.description || ''}
          onChange={handleChange}
          className="w-full py-2 px-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 resize-none"
          rows={2}
          aria-invalid={!!state.errors.description}
        />
        {state.errors.description && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">{state.errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Transaction Date
        </label>
        <input
          type="date"
          name="transaction_date"
          value={state.transaction_date}
          onChange={handleChange}
          className="w-full py-2 px-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          required
          aria-invalid={!!state.errors.transaction_date}
        />
        {state.errors.transaction_date && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">Valid date required</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Category
        </label>
        {isLoadingCategories ? (
          <p className="text-sm text-gray-500 dark:text-gray-300">Loading categories...</p>
        ) : categoryError ? (
          <p className="text-sm text-red-500 dark:text-red-300">{categoryError}</p>
        ) : (
          <select
            value={state.category_id ?? ''}
            onChange={(e) => setState((prev) => ({ ...prev, category_id: e.target.value === '' ? null : Number(e.target.value) }))}
            className="w-full py-2 px-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            disabled={isLoadingCategories}
          >
            <option value="">No category</option>
            {categories
              .filter((cat) => cat.type === state.type)
              .map((cat) => (
                <option
                  key={cat.id}
                  value={cat.id}
                  selected={cat.id === state.category_id}
                >
                  {cat.name}
                </option>
              ))}
          </select>
        )}
      </div>

      <button
        type="submit"
        disabled={state.isSubmitting}
        className={`w-full py-2 px-4 rounded border border-transparent bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {state.isSubmitting ? 'Saving...' : 'Create Transaction'}
      </button>
    </form>
  )
}