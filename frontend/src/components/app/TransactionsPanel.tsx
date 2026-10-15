import { useEffect, useState } from 'react'

import AddTransactionForm from '@/components/app/AddTransactionForm'
import EditTransactionForm from '@/components/app/EditTransactionForm'
import { deleteTransaction, getTransactions, } from '@/lib/api'
import type { Transaction } from '@/lib/api'

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function TransactionsPanel() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    async function loadTransactions() {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getTransactions()
        setTransactions(data)
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load transactions',
        )
      } finally {
        setIsLoading(false)
      }
    }

    void loadTransactions()
  }, [])

  function handleCreate(transaction: Transaction) {
    setTransactions((current) => [
      transaction,
      ...current,
    ])
  }

  function handleUpdate(updated: Transaction) {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.id === updated.id
          ? updated
          : transaction,
      ),
    )

    setEditingId(null)
  }

  async function handleDelete(id: number) {
    if (
      !window.confirm(
        'Are you sure you want to delete this transaction?',
      )
    ) {
      return
    }

    setDeletingId(id)
    setError(null)

    try {
      await deleteTransaction(id)

      setTransactions((current) =>
        current.filter(
          (transaction) => transaction.id !== id,
        ),
      )

      if (editingId === id) {
        setEditingId(null)
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to delete transaction',
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <AddTransactionForm onCreated={handleCreate} />

      {error ? (
        <p className="text-sm text-destructive mb-2">{error}</p>
      ) : null}

      {isLoading ? (
        <div className="p-4 text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-current border-transparent" />

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
            Loading transactions...
          </p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No transactions yet
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((transaction) => {
            if (editingId === transaction.id) {
              return (
                <div
                  key={transaction.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <EditTransactionForm
                    transaction={transaction}
                    onSaved={handleUpdate}
                    onCancelled={() => setEditingId(null)}
                  />
                </div>
              )
            }

            const isIncome =
              transaction.type === 'income'

            return (
              <div
                key={transaction.id}
                className="flex flex-col gap-3 rounded-lg border border-gray-200 p-3 sm:flex-row sm:items-center dark:border-gray-700"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-sm font-medium ${
                      isIncome
                        ? 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300'
                    }`}
                  >
                    {isIncome ? 'I' : 'E'}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900 dark:text-gray-100">
                      {transaction.description ||
                        'Untitled transaction'}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(
                        transaction.transaction_date,
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span
                    className={`whitespace-nowrap font-medium ${
                      isIncome
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatRupiah(transaction.amount)}
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingId(transaction.id)
                      }
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        void handleDelete(
                          transaction.id,
                        )
                      }
                      disabled={
                        deletingId === transaction.id
                      }
                      className="text-sm text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                    >
                      {deletingId === transaction.id
                        ? 'Deleting...'
                        : 'Delete'}
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