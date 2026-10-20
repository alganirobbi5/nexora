import { useEffect, useState } from "react"
import {
  ArrowLeftRight,
  LayoutDashboard,
  Target,
  Wallet,
} from "lucide-react"

import BudgetPanel from "@/components/app/BudgetPanel"
import FinancialGoalsPanel from "@/components/app/FinancialGoalsPanel"
import { TasksPanel } from "@/components/app/TasksPanel"
import TransactionsPanel from "@/components/app/TransactionsPanel"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import useAuthState from "@/hooks/useAuthState"
import {
  getDashboardSummary,
  type DashboardSummary,
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

function formatTransactionDate(value: string): string {
  const parsed = new Date(`${value}T00:00:00`)

  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed)
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

export default function AppShell() {
  const { user, isLoading, logout } = useAuthState()

  const [activeSection, setActiveSection] = useState<
    "dashboard" | "transactions" | "budget" | "goals"
  >("dashboard")

  const [selectedYear, setSelectedYear] = useState(() =>
    new Date().getFullYear(),
  )
  const [selectedMonth, setSelectedMonth] = useState(
    () => new Date().getMonth() + 1,
  )
  const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0)

  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null)
  const [isDashboardLoading, setIsDashboardLoading] = useState(true)
  const [dashboardError, setDashboardError] = useState<string | null>(null)

  useEffect(() => {
    if (activeSection !== "dashboard") {
      return
    }

    let cancelled = false

    async function fetchDashboard() {
      setIsDashboardLoading(true)
      setDashboardError(null)

      try {
        const summary = await getDashboardSummary(
          selectedYear,
          selectedMonth,
        )

        if (!cancelled) {
          setDashboard(summary)
        }
      } catch (error) {
        if (!cancelled) {
          setDashboardError(
            error instanceof Error
              ? error.message
              : "Failed to load dashboard",
          )
        }
      } finally {
        if (!cancelled) {
          setIsDashboardLoading(false)
        }
      }
    }

    void fetchDashboard()

    return () => {
      cancelled = true
    }
  }, [activeSection, selectedYear, selectedMonth, dashboardRefreshKey])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg text-center">
          <div className="animate-spin h-12 w-12 mx-auto border-2 border-current border-transparent rounded-full" />

          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const yearOptions = buildYearOptions(selectedYear)
  const trendMax = Math.max(
    1,
    ...(dashboard?.six_month_trend.flatMap((month) => [
      month.income,
      month.expenses,
    ]) ?? []),
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-brand-600 dark:text-brand-400"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M16 2L4 8v16l12 6 12-6V8L16 2zm0 2.5l9.5 4.75v11L16 27.5l-9.5-4.75V11L16 4.5z"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />

                <path
                  d="M16 10v12M10 16h12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                NEXORA
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Personal Finance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Welcome, {user.name || ""}
            </span>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Logout"
              onClick={logout}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      <nav
        aria-label="Navigasi aplikasi"
        className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSection("dashboard")}
            aria-current={
              activeSection === "dashboard" ? "page" : undefined
            }
            className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium ${
              activeSection === "dashboard"
                ? "border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            Dashboard
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("transactions")}
            aria-current={
              activeSection === "transactions" ? "page" : undefined
            }
            className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium ${
              activeSection === "transactions"
                ? "border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
            Transactions
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("budget")}
            aria-current={
              activeSection === "budget" ? "page" : undefined
            }
            className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium ${
              activeSection === "budget"
                ? "border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <Wallet className="h-4 w-4" aria-hidden="true" />
            Budget
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("goals")}
            aria-current={
              activeSection === "goals" ? "page" : undefined
            }
            className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium ${
              activeSection === "goals"
                ? "border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <Target className="h-4 w-4" aria-hidden="true" />
            Goals
          </button>
        </div>
      </nav>

      <main className="py-6 max-w-7xl mx-auto px-4">
        {activeSection === "transactions" ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Transactions
            </h2>

            <TransactionsPanel />
          </>
        ) : activeSection === "budget" ? (
          <BudgetPanel />
        ) : activeSection === "goals" ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Financial Goals
            </h2>

            <FinancialGoalsPanel />
          </>
        ) : (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Dashboard
                </h2>

                <p className="text-gray-500 dark:text-gray-400">
                  Ringkasan keuangan bulan{" "}
                  {MONTH_NAMES[selectedMonth - 1]} {selectedYear}.
                </p>
              </div>

              <div className="flex items-end gap-3">
                <div>
                  <label
                    htmlFor="dashboard-month"
                    className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300"
                  >
                    Bulan
                  </label>

                  <select
                    id="dashboard-month"
                    value={selectedMonth}
                    onChange={(event) =>
                      setSelectedMonth(Number(event.target.value))
                    }
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  >
                    {MONTH_NAMES.map((name, index) => (
                      <option key={name} value={index + 1}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="dashboard-year"
                    className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300"
                  >
                    Tahun
                  </label>

                  <select
                    id="dashboard-year"
                    value={selectedYear}
                    onChange={(event) =>
                      setSelectedYear(Number(event.target.value))
                    }
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  >
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {isDashboardLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-current border-transparent" />

                  <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                    Loading dashboard...
                  </p>
                </div>
              </div>
            ) : dashboardError ? (
              <div className="rounded-lg bg-red-50 p-8 text-center shadow-lg dark:bg-red-900">
                <p className="text-red-600 dark:text-red-400">
                  {dashboardError}
                </p>

                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() =>
                    setDashboardRefreshKey((key) => key + 1)
                  }
                >
                  Coba lagi
                </Button>
              </div>
            ) : dashboard ? (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <Card size="sm">
                    <CardHeader>
                      <CardTitle>Pemasukan</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p className="text-center text-gray-600 dark:text-gray-300 font-medium">
                        {formatRupiah(dashboard.monthly_income)}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Bulan ini
                      </p>
                    </CardContent>
                  </Card>

                  <Card size="sm">
                    <CardHeader>
                      <CardTitle>Pengeluaran</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p className="text-center text-gray-600 dark:text-gray-300 font-medium">
                        {formatRupiah(dashboard.monthly_expenses)}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Bulan ini
                      </p>
                    </CardContent>
                  </Card>

                  <Card size="sm">
                    <CardHeader>
                      <CardTitle>Arus Kas Bersih</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p className="text-center text-gray-600 dark:text-gray-300 font-medium">
                        {formatRupiah(dashboard.net_cash_flow)}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Pemasukan - pengeluaran
                      </p>
                    </CardContent>
                  </Card>

                  <Card size="sm">
                    <CardHeader>
                      <CardTitle>Target Aktif</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p className="text-center text-gray-600 dark:text-gray-300 font-medium">
                        {dashboard.active_goals}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Target yang berjalan
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Six-month trend */}
                <section className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Tren 6 Bulan Terakhir
                  </h3>

                  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-300">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-sm bg-emerald-500"
                          aria-hidden="true"
                        />
                        Pemasukan
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-sm bg-rose-500"
                          aria-hidden="true"
                        />
                        Pengeluaran
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                      {dashboard.six_month_trend.map((month) => {
                        const incomeHeight = Math.max(
                          2,
                          Math.round((month.income / trendMax) * 100),
                        )
                        const expenseHeight = Math.max(
                          2,
                          Math.round((month.expenses / trendMax) * 100),
                        )

                        return (
                          <div
                            key={`${month.year}-${month.month}`}
                            className="rounded-md border border-gray-100 p-3 dark:border-gray-700"
                          >
                            <p className="text-center text-xs font-medium text-gray-700 dark:text-gray-200">
                              {month.label}
                            </p>

                            <div
                              className="mt-3 flex h-24 items-end justify-center gap-1.5"
                              aria-hidden="true"
                            >
                              <div
                                className="w-4 rounded-t-sm bg-emerald-500"
                                style={{ height: `${incomeHeight}%` }}
                              />

                              <div
                                className="w-4 rounded-t-sm bg-rose-500"
                                style={{ height: `${expenseHeight}%` }}
                              />
                            </div>

                            <dl className="mt-3 space-y-1 text-xs">
                              <div>
                                <dt className="text-gray-500 dark:text-gray-400">
                                  Masuk
                                </dt>

                                <dd className="font-medium text-gray-700 dark:text-gray-200">
                                  {formatRupiah(month.income)}
                                </dd>
                              </div>

                              <div>
                                <dt className="text-gray-500 dark:text-gray-400">
                                  Keluar
                                </dt>

                                <dd className="font-medium text-gray-700 dark:text-gray-200">
                                  {formatRupiah(month.expenses)}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </section>

                {/* Category breakdown */}
                <section className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Pengeluaran per Kategori
                  </h3>

                  <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    {dashboard.category_breakdown.length === 0 ? (
                      <p className="py-8 text-center text-gray-500 dark:text-gray-400">
                        Belum ada pengeluaran bulan ini.
                      </p>
                    ) : (
                      <ul className="space-y-4">
                        {dashboard.category_breakdown.map((item) => {
                          const barWidth = Math.min(
                            100,
                            Math.max(0, item.percentage),
                          )

                          return (
                            <li
                              key={item.category_id ?? "uncategorized"}
                            >
                              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm">
                                <span className="min-w-0 break-words font-medium text-gray-700 dark:text-gray-200">
                                  {item.category_name}
                                </span>

                                <span className="text-gray-600 dark:text-gray-300">
                                  {formatRupiah(item.amount)} (
                                  {item.percentage}%)
                                </span>
                              </div>

                              <div
                                className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700"
                                role="progressbar"
                                aria-label={`Porsi pengeluaran ${item.category_name}`}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={barWidth}
                              >
                                <div
                                  className="h-full rounded-full bg-brand-500"
                                  style={{ width: `${barWidth}%` }}
                                />
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                </section>

                <div className="grid grid-cols-1 gap-8">
                  {/* Recent transactions */}
                  <section>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Transaksi Terbaru
                    </h3>

                    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                      {dashboard.recent_transactions.length === 0 ? (
                        <p className="py-8 text-center text-gray-500 dark:text-gray-400">
                          Belum ada transaksi.
                        </p>
                      ) : (
                        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                          {dashboard.recent_transactions.map(
                            (transaction) => {
                              const isIncome =
                                transaction.type === "income"

                              return (
                                <li
                                  key={transaction.id}
                                  className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                  <div className="min-w-0">
                                    <p className="break-words font-medium text-gray-900 dark:text-gray-100">
                                      {transaction.description ||
                                        transaction.category?.name ||
                                        "Tanpa deskripsi"}
                                    </p>

                                    <p className="mt-1 break-words text-xs text-gray-500 dark:text-gray-400">
                                      {formatTransactionDate(
                                        transaction.transaction_date,
                                      )}{" "}
                                      ·{" "}
                                      {transaction.category?.name ??
                                        "Tanpa kategori"}
                                    </p>
                                  </div>

                                  <p
                                    className={`text-sm font-semibold sm:shrink-0 ${
                                      isIncome
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-rose-600 dark:text-rose-400"
                                    }`}
                                  >
                                    {isIncome ? "+" : "-"}{" "}
                                    {formatRupiah(transaction.amount)}
                                  </p>
                                </li>
                              )
                            },
                          )}
                        </ul>
                      )}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Tasks
                    </h3>

                    <TasksPanel />
                  </section>
                </div>
              </>
            ) : (
              <p className="py-8 text-center text-gray-500 dark:text-gray-400">
                Belum ada data dashboard.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  )
}
