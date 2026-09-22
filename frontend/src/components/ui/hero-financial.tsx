import React from 'react'
import { ChevronRight, TrendingUp, TrendingDown, Target, CreditCard, Wallet, ArrowRight, Shield, ArrowUpRight } from 'lucide-react'
import { TimelineAnimation } from './hero-financial-utils/timeline-animation'
import { useMediaQuery } from './hero-financial-utils/use-media-query'
import { MotionDrawer } from './hero-financial-utils/motion-drawer'
import { Button } from './button'
import { Card, CardContent } from './card'
import { Separator } from './separator'
import { cn } from 'cn'

const logoSvg = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="text-brand-600"
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
)

const formatIDR = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const DashboardPreview = () => {
  const transactions = [
    { id: 1, merchant: 'Netflix', category: 'Entertainment', amount: -159900, date: 'Today', icon: '🎬' },
    { id: 2, merchant: 'Tokopedia', category: 'Shopping', amount: -874300, date: 'Yesterday', icon: '📦' },
    { id: 3, merchant: 'Salary Deposit', category: 'Income', amount: 35000000, date: 'Mar 15', icon: '💰' },
    { id: 4, merchant: 'Grab', category: 'Transport', amount: -245000, date: 'Mar 14', icon: '🚗' },
    { id: 5, merchant: 'Spotify', category: 'Entertainment', amount: -109900, date: 'Mar 13', icon: '🎵' },
  ]

  const cashFlowData = [45, 52, 38, 65, 58, 72, 68, 80, 75, 85, 82, 90]
  const maxValue = Math.max(...cashFlowData)

  const isMobile = useMediaQuery('(max-width: 768px)', { defaultMatches: false })
  const isTablet = useMediaQuery('(max-width: 1024px)', { defaultMatches: false })

  const chartHeight = isMobile ? 140 : isTablet ? 160 : 180

  return (
    <div className="bg-surface border border-surface-border/20 rounded-2xl overflow-hidden shadow-2xl">
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

      <div className="p-4 space-y-4" style={{ paddingTop: isTablet ? '0.75rem' : '1rem', paddingBottom: isTablet ? '0.75rem' : '1rem' }}>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4" style={{ gap: isTablet ? '0.5rem' : '0.625rem' }}>
          <Card size="sm" className="border-surface-border/15 bg-surface/50 hover:bg-surface/70 transition-colors">
            <CardContent className="pt-3 pb-3 px-3" style={{ padding: isTablet ? '0.625rem' : '0.75rem' }}>
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

          <Card size="sm" className="border-surface-border/15 bg-surface/50 hover:bg-surface/70 transition-colors">
            <CardContent className="pt-3 pb-3 px-3" style={{ padding: isTablet ? '0.625rem' : '0.75rem' }}>
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

          <Card size="sm" className="border-surface-border/15 bg-surface/50 hover:bg-surface/70 transition-colors">
            <CardContent className="pt-3 pb-3 px-3" style={{ padding: isTablet ? '0.625rem' : '0.75rem' }}>
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

          <Card size="sm" className="border-surface-border/15 bg-surface/50 hover:bg-surface/70 transition-colors">
            <CardContent className="pt-3 pb-3 px-3" style={{ padding: isTablet ? '0.625rem' : '0.75rem' }}>
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

        <Card size="sm" className="border-surface-border/15 bg-brand-50/30 dark:bg-brand-900/10 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-colors">
          <CardContent className="pt-3 pb-3 px-3" style={{ padding: isTablet ? '0.625rem' : '0.75rem' }}>
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
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 className="text-text-primary font-semibold text-sm">Cash Flow Overview</h3>
            <div className="flex items-center gap-1 text-text-tertiary text-xs flex-wrap">
              <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
              <span>Income</span>
              <span className="w-2 h-2 rounded-full bg-error-500 ml-2 flex-shrink-0" />
              <span>Expenses</span>
            </div>
          </div>
          <div 
            className="relative" 
            role="img" 
            aria-label="Cash flow chart showing income and expenses over 12 months"
            style={{ height: `${chartHeight}px` }}
          >
            <svg className="w-full h-full" viewBox="0 0 400 128" preserveAspectRatio="none">
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-error-500)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--color-error-500)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`M0,${128 - (cashFlowData[0] / maxValue) * 100} ${cashFlowData.map((v, i) => `${(i / (cashFlowData.length - 1)) * 400},${128 - (v / maxValue) * 100}`).join(' ')} L400,128 L0,128 Z`}
                fill="url(#incomeGradient)"
                stroke="var(--color-brand-500)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fillOpacity="0.5"
              />
              <path
                d={`M0,${128 - (cashFlowData.map(v => maxValue - v)[0] / maxValue) * 100} ${cashFlowData.map((v, i) => `${(i / (cashFlowData.length - 1)) * 400},${128 - ((maxValue - v) / maxValue) * 100}`).join(' ')} L400,128 L0,128 Z`}
                fill="url(#expenseGradient)"
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
          <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
            <h3 className="text-text-primary font-semibold text-sm">Recent Transactions</h3>
            <span className="text-text-tertiary text-xs whitespace-nowrap">5 of 24 this month</span>
          </div>
          <div className="space-y-1.5">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface-border/10 hover:bg-surface-border/15 transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-surface-border/15 flex items-center justify-center text-base flex-shrink-0">
                    {tx.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-text-primary font-medium text-sm truncate">{tx.merchant}</p>
                    <p className="text-text-tertiary text-xs capitalize truncate">{tx.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-sm flex-shrink-0">
                  <span className="text-text-tertiary whitespace-nowrap">{tx.date}</span>
                  <span
                    className={cn(
                      'font-semibold whitespace-nowrap',
                      tx.amount > 0 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
                    )}
                  >
                    {tx.amount > 0 ? '+' : ''}{formatIDR(Math.abs(tx.amount))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-1 flex items-center justify-center gap-2.5 text-xs text-text-tertiary flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-500 flex-shrink-0" />
            <span>Housing</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-success-500 flex-shrink-0" />
            <span>Food</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-warning-500 flex-shrink-0" />
            <span>Transport</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-error-500 flex-shrink-0" />
            <span>Other</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export const HeroFinancial = () => {
  const timelineRef = React.useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 768px)', { defaultMatches: false })

  return (
    <section
      ref={timelineRef}
      className="relative min-h-screen bg-bg-primary text-text-primary overflow-hidden flex flex-col"
      aria-labelledby="hero-heading"
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

      {isMobile && (
        <div className="relative z-10 flex gap-3 justify-between items-center px-4 w-full pt-3">
          <MotionDrawer
            direction="left"
            width={280}
            contentClassName="bg-surface border-r border-surface-border"
            btnClassName="bg-surface text-text-primary border border-surface-border"
          >
            <nav className="space-y-2" aria-label="Mobile navigation">
              <div className="flex items-center gap-2 px-3 py-3 text-text-primary">
                {logoSvg}
                <span className="font-semibold text-lg">NEXORA</span>
              </div>
              <a
                href="#features"
                className="block px-3 py-2 rounded-lg hover:bg-surface-hover transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 rounded-lg hover:bg-surface-hover transition-colors"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="block px-3 py-2 rounded-lg hover:bg-surface-hover transition-colors"
              >
                About
              </a>
            </nav>
          </MotionDrawer>
          <Button className="bg-text-primary text-text-inverse hover:bg-text-primary/90 hidden sm:flex">
            Start for free <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      )}

      {!isMobile && (
        <header className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-3">
          <TimelineAnimation
            timelineRef={timelineRef}
            animationNum={1}
            className="bg-surface/80 backdrop-blur-xl rounded-xl border border-surface-border/20 shadow-sm flex items-center justify-between px-5 py-3"
          >
            <div className="flex items-center gap-3">
              {logoSvg}
              <span className="text-xl font-bold tracking-tight text-text-primary">
                NEXORA
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-secondary" aria-label="Main navigation">
              <a
                href="#features"
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors relative py-1.5"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors relative py-1.5"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors relative py-1.5"
              >
                About
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                Sign in
              </Button>
              <Button className="bg-text-primary text-text-inverse hover:bg-text-primary/90">
                Start for free <ChevronRight size={16} className="ml-1" />
              </Button>
            </div          >
          </TimelineAnimation>
        </header>
      )}

      <div className="relative z-10 flex-1 flex flex-col items-center px-4 py-6 lg:py-10">
        <TimelineAnimation
          timelineRef={timelineRef}
          animationNum={2}
          className="mb-2.5 inline-flex items-center gap-2 rounded-full bg-surface border border-surface-border/20 px-3 py-1 text-sm font-medium text-text-secondary shadow-sm"
        >
          <span className="bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider">
            New
          </span>
          <span>Introducing NEXORA 2.0 — Smarter money management</span>
        </TimelineAnimation>

        <TimelineAnimation
          as="h1"
          id="hero-heading"
          timelineRef={timelineRef}
          animationNum={3}
          className="mb-2.5 text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary max-w-5xl leading-[1.1]"
        >
          Take control of your money.{' '}
          <span className="text-brand-600">Build better habits.</span>
        </TimelineAnimation>

        <TimelineAnimation
          as="p"
          timelineRef={timelineRef}
          animationNum={4}
          className="mb-4 text-center text-lg sm:text-xl md:text-2xl text-text-secondary font-medium max-w-2xl mx-auto leading-relaxed px-4"
        >
          Manage your money, goals, and daily tasks from one focused workspace.
        </TimelineAnimation>

        <TimelineAnimation
          timelineRef={timelineRef}
          animationNum={5}
          className="mb-5 lg:mb-7 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-xs"
        >
          <Button
            size="lg"
            className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25 gap-2"
          >
            Start for free <ArrowRight size={18} />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-surface-border/20 hover:bg-surface-hover"
          >
            Explore demo
          </Button>
        </TimelineAnimation>

        <p className="text-center text-text-tertiary text-sm mb-4 lg:mb-6">
          No credit card required · 14-day free trial · Cancel anytime
        </p>

        <TimelineAnimation
          timelineRef={timelineRef}
          animationNum={6}
          className="w-full max-w-[900px]"
        >
          <div className="relative bg-surface/50 backdrop-blur-xl border border-surface-border/20 rounded-3xl shadow-2xl shadow-brand-500/5 p-1 ring-1 ring-inset ring-brand-500/10">
            <DashboardPreview />
          </div>
        </TimelineAnimation>
      </div>
    </section>
  )
}

export default HeroFinancial