import React from 'react'
import { ChevronRight, TrendingUp, TrendingDown, Target, CreditCard, Wallet, ArrowRight, Shield, ArrowUpRight, PieChart, Sparkle } from 'lucide-react'
import { useMediaQuery } from '@/components/ui/hero-financial-utils/use-media-query'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from 'cn'

const formatIDR = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

interface ShowcaseView {
  id: string
  number: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const showcaseViews: ShowcaseView[] = [
  {
    id: 'money',
    number: '01',
    title: 'Understand your money',
    description: 'See your total balance, income, expenses, and cash flow at a glance. No more guessing where your money went.',
    icon: Wallet,
  },
  {
    id: 'goals',
    number: '02',
    title: 'Plan your next goal',
    description: 'Set savings targets, track progress, and keep your next milestone visible. Financial health built in.',
    icon: Target,
  },
  {
    id: 'insights',
    number: '03',
    title: 'Learn from your habits',
    description: 'Understand spending patterns through clear visualizations. Turn data into actionable insights.',
    icon: PieChart,
  },
]

const cashFlowData = [45, 52, 38, 65, 58, 72, 68, 80, 75, 85, 82, 90]
const maxValue = Math.max(...cashFlowData)

const transactions = [
  { id: 1, merchant: 'Netflix', category: 'Entertainment', amount: -159900, date: 'Today', icon: '🎬' },
  { id: 2, merchant: 'Tokopedia', category: 'Shopping', amount: -874300, date: 'Yesterday', icon: '📦' },
  { id: 3, merchant: 'Salary Deposit', category: 'Income', amount: 35000000, date: 'Mar 15', icon: '💰' },
  { id: 4, merchant: 'Grab', category: 'Transport', amount: -245000, date: 'Mar 14', icon: '🚗' },
  { id: 5, merchant: 'Spotify', category: 'Entertainment', amount: -109900, date: 'Mar 13', icon: '🎵' },
]

const spendingCategories = [
  { name: 'Housing', value: 42, color: 'var(--color-brand-500)' },
  { name: 'Food', value: 24, color: 'var(--color-success-500)' },
  { name: 'Transport', value: 18, color: 'var(--color-warning-500)' },
  { name: 'Other', value: 16, color: 'var(--color-text-tertiary)' },
]

const milestones = [
  { label: '25% completed', completed: true },
  { label: '50% completed', completed: true },
  { label: '75% upcoming', completed: false },
]

const insights = [
  {
    icon: TrendingDown,
    color: 'var(--color-success-600)',
    text: 'Your spending decreased 8.2% compared with last month.',
  },
  {
    icon: Shield,
    color: 'var(--color-brand-600)',
    text: "You're saving 31% of your monthly income.",
  },
]

const MoneyPreview = () => {
  return (
    <div className="relative bg-surface/50 backdrop-blur-xl border border-surface-border/20 rounded-3xl shadow-2xl shadow-brand-500/5 p-1 ring-1 ring-inset ring-brand-500/10 overflow-hidden">
      <div className="bg-surface border border-surface-border/20 rounded-2xl overflow-hidden">
        <div className="bg-surface-border/5 px-5 py-4 border-b border-surface-border/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div className="min-w-0">
              <p className="text-text-secondary text-sm">Total Balance</p>
              <p className="text-text-primary font-semibold text-lg truncate">{formatIDR(24580000)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary flex-shrink-0">
            <span className="px-2 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-medium whitespace-nowrap">
              Checking ·••• 4281
            </span>
            <CreditCard className="w-4 h-4 flex-shrink-0" />
          </div>
        </div>

        <div className="p-4 sm:p-5 lg:p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card size="sm" className="border-surface-border/15 bg-surface/50">
              <CardContent className="pt-3 pb-3 px-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-text-tertiary text-xs font-medium uppercase tracking-wider">Income</p>
                    <p className="text-text-primary font-semibold text-lg mt-0.5 truncate">{formatIDR(8240000)}</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-success-50 dark:bg-success-900/30 flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-4.5 h-4.5 text-success-600 dark:text-success-400" />
                  </div>
                </div>
                <p className="text-success-600 dark:text-success-400 text-xs font-medium mt-1.5 flex items-center gap-1">
                  <TrendingUp size={9} /> +12.5% vs last month
                </p>
              </CardContent>
            </Card>

            <Card size="sm" className="border-surface-border/15 bg-surface/50">
              <CardContent className="pt-3 pb-3 px-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-text-tertiary text-xs font-medium uppercase tracking-wider">Expenses</p>
                    <p className="text-text-primary font-semibold text-lg mt-0.5 truncate">{formatIDR(3120000)}</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-error-50 dark:bg-error-900/30 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-4.5 h-4.5 text-error-600 dark:text-error-400" />
                  </div>
                </div>
                <p className="text-error-600 dark:text-error-400 text-xs font-medium mt-1.5 flex items-center gap-1">
                  <TrendingDown size={9} /> -8.2% vs last month
                </p>
              </CardContent>
            </Card>

            <Card size="sm" className="border-surface-border/15 bg-surface/50">
              <CardContent className="pt-3 pb-3 px-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-text-tertiary text-xs font-medium uppercase tracking-wider">Savings</p>
                    <p className="text-text-primary font-semibold text-lg mt-0.5 truncate">{formatIDR(5120000)}</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                    <Target className="w-4.5 h-4.5 text-brand-600 dark:text-brand-400" />
                  </div>
                </div>
                <p className="text-brand-600 dark:text-brand-400 text-xs font-medium mt-1.5 flex items-center gap-1">
                  <TrendingUp size={9} /> 68% of {formatIDR(7500000)} target
                </p>
              </CardContent>
            </Card>

            <Card size="sm" className="border-surface-border/15 bg-surface/50">
              <CardContent className="pt-3 pb-3 px-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-text-tertiary text-xs font-medium uppercase tracking-wider">Cash Flow</p>
                    <p className="text-text-primary font-semibold text-lg mt-0.5 truncate">+{formatIDR(5120000)}</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-warning-50 dark:bg-warning-900/30 flex items-center justify-center flex-shrink-0">
                    <Wallet className="w-4.5 h-4.5 text-warning-600 dark:text-warning-400" />
                  </div>
                </div>
                <p className="text-success-600 dark:text-success-400 text-xs font-medium mt-1.5 flex items-center gap-1">
                  <TrendingUp size={9} /> Net +{formatIDR(2840000)} vs avg
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator className="border-surface-border/15" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                  <Sparkle className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="text-text-tertiary text-xs font-medium uppercase tracking-wider">Cash Flow Trend</p>
                  <p className="text-text-primary font-medium text-sm">Positive this month</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-success-600 dark:text-success-400">
                <TrendingUp size={10} />
                <span>+18.3% vs 3 months ago</span>
              </div>
            </div>

            <div 
              className="relative h-24" 
              role="img" 
              aria-label="Mini cash flow trend chart"
            >
              <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="miniIncomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M0,${100 - (cashFlowData[0] / maxValue) * 80} ${cashFlowData.map((v, i) => `${(i / (cashFlowData.length - 1)) * 300},${100 - (v / maxValue) * 80}`).join(' ')} L300,100 L0,100 Z`}
                  fill="url(#miniIncomeGradient)"
                  stroke="var(--color-brand-500)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fillOpacity="0.6"
                />
              </svg>
            </div>

            <div className="pt-2">
              <h3 className="text-text-primary font-semibold text-sm mb-2.5 flex-wrap gap-2">Recent Transactions</h3>
              <div className="space-y-2">
                {transactions.slice(0, 3).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-surface-border/10 hover:bg-surface-border/15 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-surface-border/15 flex items-center justify-center text-sm flex-shrink-0">
                        {tx.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-text-primary font-medium text-sm truncate">{tx.merchant}</p>
                        <p className="text-text-tertiary text-xs capitalize truncate">{tx.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm flex-shrink-0">
                      <span className="text-text-tertiary whitespace-nowrap">{tx.date}</span>
                      <span className="font-semibold whitespace-nowrap" style={{ color: tx.amount > 0 ? 'var(--color-success-600)' : 'var(--color-error-600)' }}>
                        {tx.amount > 0 ? '+' : ''}{formatIDR(Math.abs(tx.amount))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const GoalsPreview = () => {
  return (
    <div className="relative bg-surface/50 backdrop-blur-xl border border-surface-border/20 rounded-3xl shadow-2xl shadow-brand-500/5 p-1 ring-1 ring-inset ring-brand-500/10 overflow-hidden">
      <div className="bg-surface border border-surface-border/20 rounded-2xl overflow-hidden">
        <div className="p-4 sm:p-5 lg:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                <Target className="w-6 h-6 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <p className="text-text-tertiary text-xs font-medium uppercase tracking-wider">Active Goal</p>
                <p className="text-text-primary font-semibold text-xl">Emergency Fund</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-text-tertiary text-xs font-medium uppercase tracking-wider">Target Date</p>
              <p className="text-text-secondary text-sm">December 2026</p>
            </div>
          </div>

          <Separator className="border-surface-border/15" />

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-text-secondary text-sm">Progress</p>
                <p className="text-text-primary font-bold text-xl">68%</p>
              </div>
              <div className="h-3 bg-surface-border/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: '68%' }}
                  role="progressbar"
                  aria-valuenow={68}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Emergency Fund progress"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Card size="sm" className="border-surface-border/15 bg-surface/50">
                <CardContent className="pt-3 pb-3 px-3 text-center">
                  <p className="text-text-tertiary text-xs font-medium uppercase tracking-wider">Current</p>
                  <p className="text-text-primary font-bold text-lg mt-1">{formatIDR(5120000)}</p>
                </CardContent>
              </Card>

              <Card size="sm" className="border-surface-border/15 bg-surface/50">
                <CardContent className="pt-3 pb-3 px-3 text-center">
                  <p className="text-text-tertiary text-xs font-medium uppercase tracking-wider">Target</p>
                  <p className="text-text-primary font-bold text-lg mt-1">{formatIDR(7500000)}</p>
                </CardContent>
              </Card>

              <Card size="sm" className="border-surface-border/15 bg-surface/50">
                <CardContent className="pt-3 pb-3 px-3 text-center">
                  <p className="text-text-tertiary text-xs font-medium uppercase tracking-wider">Monthly</p>
                  <p className="text-text-primary font-bold text-lg mt-1">{formatIDR(650000)}</p>
                </CardContent>
              </Card>

              <Card size="sm" className="border-surface-border/15 bg-surface/50">
                <CardContent className="pt-3 pb-3 px-3 text-center">
                  <p className="text-text-tertiary text-xs font-medium uppercase tracking-wider">Remaining</p>
                  <p className="text-text-primary font-bold text-lg mt-1">{formatIDR(2380000)}</p>
                </CardContent>
              </Card>
            </div>

            <Separator className="border-surface-border/15" />

            <div>
              <p className="text-text-secondary text-sm font-medium mb-3">Milestones</p>
              <div className="space-y-2">
                {milestones.map((m, i) => (
                  <div
                    key={m.label}
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface-border/10"
                  >
                    <div className={cn(
                      'flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors',
                      m.completed
                        ? 'bg-success-500 border-success-500 text-white'
                        : 'border-surface-border/30 text-text-tertiary'
                    )}>
                      {m.completed ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <span className="text-xs font-bold">{Math.round((i + 1) * 25)}%</span>
                      )}
                    </div>
                    <p className={cn('text-sm font-medium', m.completed ? 'text-text-primary' : 'text-text-secondary')}>
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="border-surface-border/15" />

            <Card size="sm" className="border-surface-border/15 bg-brand-50/30 dark:bg-brand-900/10">
              <CardContent className="pt-3 pb-3 px-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-text-secondary text-sm font-medium">Financial Health</p>
                      <p className="text-text-primary font-bold text-2xl tracking-tight">82%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-success-600 dark:text-success-400 flex-shrink-0">
                    <ArrowUpRight size={11} />
                    <span>You're on track</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

const InsightsPreview = () => {
  return (
    <div className="relative bg-surface/50 backdrop-blur-xl border border-surface-border/20 rounded-3xl shadow-2xl shadow-brand-500/5 p-1 ring-1 ring-inset ring-brand-500/10 overflow-hidden">
      <div className="bg-surface border border-surface-border/20 rounded-2xl overflow-hidden">
        <div className="p-4 sm:p-5 lg:p-6 space-y-5">
          <Card size="sm" className="border-surface-border/15 bg-brand-50/30 dark:bg-brand-900/10">
            <CardContent className="pt-3 pb-3 px-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-text-secondary text-sm font-medium">Financial Health</p>
                    <p className="text-text-primary font-bold text-2xl tracking-tight">82%</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-success-600 dark:text-success-400 flex-shrink-0">
                  <ArrowUpRight size={11} />
                  <span>You're on track</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="border-surface-border/15" />

          <div>
            <p className="text-text-secondary text-sm font-medium mb-3">Spending Breakdown</p>
            <div className="space-y-3">
              {spendingCategories.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary text-sm font-medium">{cat.name}</span>
                    <span className="text-text-primary font-semibold text-sm">{cat.value}%</span>
                  </div>
                  <div className="h-2 bg-surface-border/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="border-surface-border/15" />

          <div>
            <p className="text-text-secondary text-sm font-medium mb-3">Monthly Trend</p>
            <div 
              className="relative h-32" 
              role="img" 
              aria-label="Monthly income vs expenses trend chart"
            >
              <svg className="w-full h-full" viewBox="0 0 400 128" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="insightIncomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="insightExpenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-error-500)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="var(--color-error-500)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M0,${128 - (cashFlowData[0] / maxValue) * 100} ${cashFlowData.map((v, i) => `${(i / (cashFlowData.length - 1)) * 400},${128 - (v / maxValue) * 100}`).join(' ')} L400,128 L0,128 Z`}
                  fill="url(#insightIncomeGradient)"
                  stroke="var(--color-brand-500)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fillOpacity="0.5"
                />
                <path
                  d={`M0,${128 - (cashFlowData.map(v => maxValue - v)[0] / maxValue) * 100} ${cashFlowData.map((v, i) => `${(i / (cashFlowData.length - 1)) * 400},${128 - ((maxValue - v) / maxValue) * 100}`).join(' ')} L400,128 L0,128 Z`}
                  fill="url(#insightExpenseGradient)"
                  stroke="var(--color-error-500)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fillOpacity="0.35"
                />
              </svg>
            </div>
          </div>

          <Separator className="border-surface-border/15" />

          <div>
            <p className="text-text-secondary text-sm font-medium mb-3">Key Insights</p>
            <div className="space-y-3">
              {insights.map((insight, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-surface-border/10"
                >
                  <div className={cn(
                    'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                    `bg-[${insight.color}]/15 text-[${insight.color}]`
                  )}>
                    <insight.icon size={16} />
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed mt-0.5">{insight.text}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator className="border-surface-border/15" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card size="sm" className="border-surface-border/15 bg-surface/50">
              <CardContent className="pt-3 pb-3 px-3 text-center">
                <p className="text-text-tertiary text-xs font-medium uppercase tracking-wider">Income vs Expenses</p>
                <p className="text-text-primary font-bold text-2xl mt-1">+{formatIDR(5120000)}</p>
                <p className="text-success-600 dark:text-success-400 text-xs font-medium mt-1 flex items-center justify-center gap-1">
                  <TrendingUp size={9} /> Net positive
                </p>
              </CardContent>
            </Card>

            <Card size="sm" className="border-surface-border/15 bg-surface/50">
              <CardContent className="pt-3 pb-3 px-3 text-center">
                <p className="text-text-tertiary text-xs font-medium uppercase tracking-wider">Savings Rate</p>
                <p className="text-text-primary font-bold text-2xl mt-1">31%</p>
                <p className="text-brand-600 dark:text-brand-400 text-xs font-medium mt-1 flex items-center justify-center gap-1">
                  <Target size={9} /> Healthy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductShowcase() {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const isMobile = useMediaQuery('(max-width: 768px)', { defaultMatches: false })

  const activeView = showcaseViews[activeIndex]

  const renderPreview = () => {
    switch (activeView.id) {
      case 'money':
        return <MoneyPreview />
      case 'goals':
        return <GoalsPreview />
      case 'insights':
        return <InsightsPreview />
      default:
        return <MoneyPreview />
    }
  }

  return (
    <section
      className="relative w-full py-14 lg:py-20 bg-bg-primary overflow-hidden"
      aria-labelledby="showcase-heading"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-3xl"
          style={{ filter: 'blur(120px)' }}
        />
        <div
          className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-brand-500/5 blur-3xl"
          style={{ filter: 'blur(120px)' }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 100 100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.02%22/%3E%3C/svg%3E')] opacity-30" />
        <div
          className="absolute inset-0 bg-gradient-to-b from-brand-50/50 via-transparent to-transparent"
          style={{ opacity: 0.3 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            SEE NEXORA IN ACTION
          </p>
          <h2
            id="showcase-heading"
            className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary"
          >
            Your finances, finally in one clear view.
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
            From everyday spending to long-term goals, NEXORA turns financial activity into a workspace you can actually understand.
          </p>
        </div>

        {isMobile ? (
          <div className="space-y-8 lg:space-y-12">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" role="tablist" aria-label="Product views">
              {showcaseViews.map((view, index) => (
                <button
                  key={view.id}
                  onClick={() => setActiveIndex(index)}
                  role="tab"
                  aria-selected={activeIndex === index}
                  aria-controls={`${view.id}-panel`}
                  id={`${view.id}-tab`}
                  className={cn(
                    'flex-shrink-0 px-4 py-3 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary whitespace-nowrap',
                    activeIndex === index
                      ? 'bg-surface border-brand-500/30 shadow-lg shadow-brand-500/10 text-text-primary'
                      : 'bg-surface/50 border-surface-border/20 hover:border-brand-500/20 hover:bg-surface/70 text-text-secondary'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-semibold tabular-nums opacity-50">{view.number}</span>
                    <span className="font-medium text-sm">{view.title}</span>
                  </span>
                </button>
              ))}
            </div>

            <div role="tabpanel" id={`${activeView.id}-panel`} aria-labelledby={`${activeView.id}-tab`}>
              {renderPreview()}
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-12 items-start">
            <div className="lg:sticky lg:top-24 space-y-3" role="tablist" aria-label="Product views">
              {showcaseViews.map((view, index) => (
                <button
                  key={view.id}
                  onClick={() => setActiveIndex(index)}
                  role="tab"
                  aria-selected={activeIndex === index}
                  aria-controls={`${view.id}-panel`}
                  id={`${view.id}-tab`}
                  className={cn(
                    'w-full text-left p-4 lg:p-5 rounded-2xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
                    activeIndex === index
                      ? 'bg-surface border-brand-500/30 shadow-lg shadow-brand-500/10'
                      : 'bg-surface/50 border-surface-border/20 hover:border-brand-500/20 hover:bg-surface/70'
                  )}
                  aria-current={activeIndex === index ? 'true' : 'false'}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
                      activeIndex === index
                        ? 'bg-brand-500/15 text-brand-500 dark:bg-brand-500/20 dark:text-brand-400'
                        : 'bg-surface-border/20 text-text-secondary'
                    )}>
                      <span className="text-xs font-semibold tabular-nums">{view.number}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        'font-semibold text-sm lg:text-base',
                        activeIndex === index ? 'text-text-primary' : 'text-text-secondary'
                      )}>
                        {view.title}
                      </h3>
                      <p className={cn(
                        'mt-1 text-xs lg:text-sm leading-relaxed',
                        activeIndex === index ? 'text-text-secondary' : 'text-text-tertiary'
                      )}>
                        {view.description}
                      </p>
                    </div>
                    <div className={cn(
                      'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200',
                      activeIndex === index
                        ? 'bg-brand-500 text-white'
                        : 'bg-transparent text-text-tertiary'
                    )}>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div role="tabpanel" id={`${activeView.id}-panel`} aria-labelledby={`${activeView.id}-tab`}>
              {renderPreview()}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductShowcase