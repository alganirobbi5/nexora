import { useState } from 'react'
import type { FinancialGoal } from '@/lib/api'
import { updateFinancialGoal } from '@/lib/api'

interface FormErrors {
  title?: string
  target_amount?: string
  opening_amount?: string
  deadline?: string
  status?: string
  general?: string
}
interface FormState {
  title: string
  target_amount: number
  opening_amount: number
  deadline: string
  status: 'active' | 'completed' | 'archived'
  isSubmitting: boolean
  errors: FormErrors
}

interface EditFinancialGoalFormProps {
  goal: FinancialGoal
  onUpdated: (goal: FinancialGoal) => void
  onCancel: () => void
}

export default function EditFinancialGoalForm({
  goal,
  onUpdated,
  onCancel,
}: EditFinancialGoalFormProps) {
  // Initialize state from goal, ensuring deadline is in YYYY-MM-DD format for date input
  const [state, setState] = useState<FormState>({
    title: goal.title,
    target_amount: goal.target_amount,
    opening_amount: goal.opening_amount,
    deadline: goal.deadline ? goal.deadline : '',
    status: goal.status,
    isSubmitting: false,
    errors: {},
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setState((prev) => ({
      ...prev,
      [name]: name === 'target_amount' || name === 'opening_amount' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setState((prev) => ({ ...prev, isSubmitting: true, errors: {} }))

    try {
      const updated = await updateFinancialGoal(goal.id, {
        title: state.title,
        target_amount: state.target_amount,
        opening_amount: state.opening_amount,
        deadline: state.deadline || null,
        status: state.status,
      })

      onUpdated(updated)
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        errors: {
          general: err.message || 'Failed to update financial goal',
        },
      }))
    }
  }

  const handleCancel = () => {
    setState({
      title: goal.title,
      target_amount: goal.target_amount,
      opening_amount: goal.opening_amount,
      deadline: goal.deadline ? goal.deadline : '',
      status: goal.status,
      isSubmitting: false,
      errors: {},
    })
    onCancel()
  }

  if (state.isSubmitting) {
    return (
      <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-border rounded-lg text-blue-200 text-center mb-4">
        <p className="font-medium">Saving...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={state.title}
          onChange={handleChange}
          className="w-full py-2 px-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          required
          aria-invalid={!!state.errors.title}
        />
        {state.errors.title && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">{state.errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Target Amount
        </label>
        <input
          type="number"
          name="target_amount"
          value={state.target_amount.toString()}
          onChange={handleChange}
          className="w-full py-2 px-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          min="1"
          required
          aria-invalid={!!state.errors.target_amount}
        />
        {state.errors.target_amount && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">{state.errors.target_amount}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Saldo Awal (opsional)
        </label>
        <input
          type="number"
          name="opening_amount"
          value={state.opening_amount.toString()}
          onChange={handleChange}
          className="w-full py-2 px-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          min="0"
          aria-invalid={!!state.errors.opening_amount}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Tabungan yang sudah terkumpul sebelum riwayat setoran dicatat.
        </p>
        {state.errors.opening_amount && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">{state.errors.opening_amount}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Deadline
        </label>
        <input
          type="date"
          name="deadline"
          value={state.deadline}
          onChange={handleChange}
          className="w-full py-2 px-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          required
          aria-invalid={!!state.errors.deadline}
        />
        {state.errors.deadline && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">Valid date required</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Status
        </label>
        <select
          name="status"
          value={state.status}
          onChange={(e) => setState((prev) => ({ ...prev, status: e.target.value as FormState['status'] }))}
          className="w-full py-2 px-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          required
          aria-invalid={!!state.errors.status}
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
        {state.errors.status && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">Valid status required</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={state.isSubmitting}
          className="py-2 px-4 rounded border border-transparent text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={state.isSubmitting}
          className="py-2 px-4 rounded border border-transparent bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </form>
  )
}