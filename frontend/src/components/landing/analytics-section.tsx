import { ChevronRight, TrendingDown, Shield, Activity } from 'lucide-react'
import { useMediaQuery } from '@/components/ui/hero-financial-utils/use-media-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from 'cn'

const formatIDRCompact = (amount: number) => {
  if (amount >= 1000000) {
    const juta = amount / 1000000
    return `Rp ${juta.toFixed(2).replace('.', ',')} jt`
  }
  if (amount >= 1000) {
    const ribu = amount / 1000
    return `Rp ${ribu.toFixed(0).replace('.', ',')} rb`
  }
  return `Rp ${amount.toLocaleString('id-ID')}`
}

const monthlyData = [
  { month: 'Jan', income: 45, expenses: 38 },
  { month: 'Feb', income: 52, expenses: 42 },
  { month: 'Mar', income: 38, expenses: 35 },
  { month: 'Apr', income: 65, expenses: 48 },
  { month: 'May', income: 58, expenses: 44 },
  { month: 'Jun', income: 72, expenses: 52 },
  { month: 'Jul', income: 68, expenses: 49 },
  { month: 'Aug', income: 80, expenses: 55 },
  { month: 'Sep', income: 75, expenses: 51 },
  { month: 'Oct', income: 85, expenses: 58 },
  { month: 'Nov', income: 82, expenses: 56 },
  { month: 'Dec', income: 90, expenses: 62 },
]

const spendingCategories = [
  { name: 'Housing', value: 42, color: 'var(--color-brand-500)' },
  { name: 'Food', value: 24, color: 'var(--color-success-500)' },
  { name: 'Transport', value: 18, color: 'var(--color-warning-500)' },
  { name: 'Other', value: 16, color: 'var(--color-text-tertiary)' },
]

const insights = [
  {
    icon: TrendingDown,
    color: 'var(--color-success-600)',
    title: 'Spending is down 8.2%',
    description: 'Compared with last month, you spent Rp 874.000 less on discretionary categories.',
  },
  {
    icon: Shield,
    color: 'var(--color-brand-600)',
    title: 'Saving 31% of income',
    description: "You're on track to exceed your annual savings target by 3 months.",
  },
]

const financialHealth = {
  score: 82,
  label: "You're on track",
}

export function AnalyticsSection() {
  const isMobile = useMediaQuery('(max-width: 768px)', { defaultMatches: false })

  return (
    <section
      className="relative w-full py-14 lg:py-20 bg-bg-primary overflow-hidden"
      aria-labelledby="analytics-heading"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-3xl"
          style={{ filter: 'blur(120px)' }}
        />
        <div
          className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-brand-600/5 blur-3xl"
          style={{ filter: 'blur(120px)' }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 100 100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.02%22/%3E%3C/svg%3E')] opacity-30" />
        <div
          className="absolute inset-0 bg-gradient-to-b from-brand-50/50 via-transparent to-transparent"
          style={{ opacity: 0.3 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isMobile ? (
          <div className="space-y-10 lg:space-y-16">
            <EditorialContent />
            <AnalyticsVisualization />
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-8 lg:gap-12 items-start">
            <EditorialContent />
            <AnalyticsVisualization />
          </div>
        )}
      </div>
    </section>
  )
}

function EditorialContent() {
  return (
    <div className="max-w-xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
        UNDERSTAND YOUR HABITS
      </p>
      <h2
        id="analytics-heading"
        className="mb-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-[1.1]"
      >
        Know where your money goes.{' '}
        <br />
        <span className="text-brand-600">Make decisions with clarity.</span>
      </h2>
      <p className="mb-6 text-lg sm:text-xl text-text-secondary leading-relaxed">
        Turn everyday transactions into simple insights so you can spot patterns, understand your spending, and make better financial decisions.
      </p>
      <Button className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25 gap-2">
        Explore your analytics <ChevronRight size={18} />
      </Button>
      <EditorialInsight />
    </div>
  )
}

function EditorialInsight() {
  return (
    <div className="mt-6 p-3 rounded-xl bg-surface-border/5 border border-surface-border/10">
      <div className="flex items-center gap-2 text-success-600 dark:text-success-400 mb-1">
        <TrendingDown size={14} />
        <span className="text-sm font-semibold">8.2% less spent this month</span>
      </div>
      <p className="text-text-secondary text-sm leading-relaxed">
        Your expenses are trending down while your savings rate continues to grow.
      </p>
    </div>
  )
}

function AnalyticsVisualization() {
  return (
    <div className="relative">
      <div className="bg-surface/50 backdrop-blur-xl border border-surface-border/20 rounded-3xl shadow-xl shadow-brand-500/5 p-1 ring-1 ring-inset ring-brand-500/10 overflow-hidden">
        <div className="bg-surface border border-surface-border/20 rounded-2xl overflow-hidden">
          <div className="p-4 sm:p-5 lg:p-6 space-y-4">
            <MonthlySummary />
            <Separator className="border-surface-border/15" />
            <CashFlowTrend />
            <Separator className="border-surface-border/15" />
            <SpendingBreakdown />
            <Separator className="border-surface-border/15" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FinancialHealthCard />
              <InsightsPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MonthlySummary() {
  const stats = [
    { label: 'Income', value: formatIDRCompact(8240000), trend: '+12.5%', trendUp: true },
    { label: 'Expenses', value: formatIDRCompact(3120000), trend: '-8.2%', trendUp: false },
    { label: 'Savings Rate', value: '31%', trend: '+6.4%', trendUp: true },
    { label: 'Net Cash Flow', value: formatIDRCompact(5120000), trend: '+Rp 5,12 jt', trendUp: true },
  ]

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} size="sm" className="border-surface-border/10 bg-surface/50">
          <CardContent className="pt-2.5 pb-2.5 px-3 text-center">
            <p className="text-text-tertiary text-xs font-medium uppercase tracking-wider">{stat.label}</p>
            <p className="text-text-primary font-bold text-lg mt-0.5">{stat.value}</p>
            <p className={cn('mt-1 text-xs font-medium', stat.trendUp ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400')}>
              {stat.trend} vs last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function CashFlowTrend() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-text-primary font-semibold text-sm">Cash Flow Trend</h3>
        <div className="flex items-center gap-1 text-text-tertiary text-xs">
          <span className="w-2 h-2 rounded-full bg-brand-500" />
          <span>Income</span>
          <span className="w-2 h-2 rounded-full bg-error-500 ml-2" />
          <span>Expenses</span>
        </div>
      </div>
      <div 
        className="relative h-40" 
        role="img" 
        aria-label="Monthly cash flow chart showing income and expenses over 12 months"
      >
        <svg className="w-full h-full" viewBox="0 0 400 140" preserveAspectRatio="none">
          <defs>
            <linearGradient id="analyticsIncomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="analyticsExpenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-error-500)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--color-error-500)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={monthlyData.map((d, i) => {
              const x = (i / (monthlyData.length - 1)) * 400
              const y = 140 - (d.income / 90) * 110
              return i === 0 ? `M${x},${y}` : `L${x},${y}`
            }).join(' ')}
            fill="none"
            stroke="var(--color-brand-500)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={monthlyData.map((d, i) => {
              const x = (i / (monthlyData.length - 1)) * 400
              const y = 140 - (d.expenses / 90) * 110
              return i === 0 ? `M${x},${y}` : `L${x},${y}`
            }).join(' ')}
            fill="none"
            stroke="var(--color-error-500)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6 4"
          />
          <path
            d={monthlyData.map((d, i) => {
              const x = (i / (monthlyData.length - 1)) * 400
              const y = 140 - (d.income / 90) * 110
              return i === 0 ? "M" + x + "," + y : "L" + x + "," + y
            }).join(" ") + " L400,140 L0,140 Z"}
            fill="url(#analyticsIncomeGradient)"
            stroke="none"
            fillOpacity="0.4"
          />
          <path
            d={monthlyData.map((d, i) => {
              const x = (i / (monthlyData.length - 1)) * 400
              const y = 140 - (d.expenses / 90) * 110
              return i === 0 ? "M" + x + "," + y : "L" + x + "," + y
            }).join(" ") + " L400,140 L0,140 Z"}
            fill="url(#analyticsExpenseGradient)"
            stroke="none"
            fillOpacity="0.25"
          />
          <defs>
            <linearGradient id="analyticsIncomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="analyticsExpenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-error-500)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--color-error-500)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}

function SpendingBreakdown() {
  return (
    <div>
      <h3 className="text-text-primary font-semibold text-sm mb-3">Spending Breakdown</h3>
      <div className="space-y-2.5">
        {spendingCategories.map((cat) => (
          <div key={cat.name} className="space-y-1">
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
  )
}

function FinancialHealthCard() {
  return (
    <Card size="sm" className="border-surface-border/10 bg-brand-50/30 dark:bg-brand-900/10">
      <CardContent className="h-full grid grid-cols-1 h-full place-items-center text-center">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
              <Activity className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </div>
            <span className="text-text-secondary text-sm font-medium">Financial Health</span>
          </div>
          <p className="text-text-primary font-bold text-3xl tracking-tight">{financialHealth.score}%</p>
          <p className="text-success-600 dark:text-success-400 text-sm font-medium">{financialHealth.label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function InsightsPanel() {
  return (
    <Card size="sm" className="border-surface-border/10 bg-surface/50">
      <CardContent className="pt-3 pb-3 px-3">
        <p className="text-text-secondary text-sm font-medium mb-2">Key Insights</p>
        <div className="space-y-2">
          {insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-surface-border/10">
              <div className={cn(
                'flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center',
                `bg-[${insight.color}]/15 text-[${insight.color}]`
              )}>
                <insight.icon size={14} />
              </div>
              <div>
                <p className="text-text-primary font-medium text-sm">{insight.title}</p>
                <p className="text-text-secondary text-xs mt-0.5">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default AnalyticsSection