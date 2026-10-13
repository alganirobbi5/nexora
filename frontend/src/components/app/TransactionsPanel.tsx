import { useEffect, useState } from 'react'
import { getTransactions } from '@/lib/api'

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

interface TransactionRow {
  id: number
  type: 'income' | 'expense'
  amount: number
  description: string | null
  transaction_date: string
}

export default function TransactionsPanel() {
  const [transactions, setTransactions] = useState<TransactionRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getTransactions()
        setTransactions(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load transactions')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchTransactions()
  }, [])

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin h-6 w-6 mx-auto border-2 border-current border-transparent rounded-full" />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">Loading transactions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 dark:text-red-400">
        <p>{error}</p>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        <p>No transactions yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex items-center gap-3 p-3 rounded-lg border">
          <span className="w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium">
            {tx.type === 'income'
              ? 'I'
              : 'E'}
            </span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {tx.description || 'Untitled transaction'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(tx.transaction_date)}
            </p>
          </div>
          <span className="font-medium text-gray-600 dark:text-gray-300">
            {formatRupiah(tx.amount)}
          </span>
        </div>
      ))}
    </div>
  )
}