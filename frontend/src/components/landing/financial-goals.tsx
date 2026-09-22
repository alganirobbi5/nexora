import React from 'react'
import { Target, ChevronRight, Check, Circle, Calendar, DollarSign, TrendingUp } from 'lucide-react'
import { useMediaQuery } from '@/components/ui/hero-financial-utils/use-media-query'
import { Button } from '@/components/ui/button'
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

const goalData = {
  title: 'Emergency Fund',
  current: 5120000,
  target: 7500000,
  targetDate: 'December 2026',
  monthlyContribution: 650000,
  progress: 68,
  milestones: [
    { label: 'Goal created', completed: true },
    { label: '25% reached', completed: true },
    { label: '50% reached', completed: true },
    { label: '75% next milestone', completed: false },
  ],
}

export function FinancialGoalsSection() {
  const isMobile = useMediaQuery('(max-width: 768px)', { defaultMatches: false })

  return (
    <section
      className="relative w-full py-16 lg:py-24 bg-bg-primary overflow-hidden"
      aria-labelledby="goals-heading"
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
            <GoalVisualization targetProgress={goalData.progress} />
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-start">
            <EditorialContent />
            <GoalVisualization targetProgress={goalData.progress} />
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
        YOUR GOALS, MADE VISIBLE
      </p>
      <h2
        id="goals-heading"
        className="mb-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-[1.1]"
      >
        Save with a plan.{' '}
        <br />
        <span className="text-brand-600">See your progress come to life.</span>
      </h2>
      <p className="mb-8 text-lg sm:text-xl text-text-secondary leading-relaxed">
        Turn long-term plans into clear milestones, track every step, and always know how close you are to your next goal.
      </p>
      <Button className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25 gap-2">
        Start a goal <ChevronRight size={18} />
      </Button>
      <p className="mt-4 text-center text-text-tertiary text-sm">
        Rp 2.380.000 left to reach your goal
      </p>
    </div>
  )
}

function GoalVisualization({ targetProgress = 68 }: { targetProgress?: number }) {
  const { title, current, target, targetDate, monthlyContribution, milestones } = goalData
  const remaining = target - current
  const [animate, setAnimate] = React.useState(false)

  React.useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReducedMotion) {
      requestAnimationFrame(() => setAnimate(true))
    }
  }, [])

  return (
    <div className="relative">
      <div className="bg-surface/50 backdrop-blur-xl border border-surface-border/20 rounded-3xl shadow-2xl shadow-brand-500/5 p-1 ring-1 ring-inset ring-brand-500/10 overflow-hidden">
        <div className="bg-surface border border-surface-border/20 rounded-2xl overflow-hidden">
          <div className="p-5 sm:p-6 lg:p-7 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                  <Target className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="text-text-tertiary text-xs font-medium uppercase tracking-wider">Active Goal</p>
                  <p className="text-text-primary font-semibold text-xl lg:text-2xl">{title}</p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-text-tertiary text-xs font-medium uppercase tracking-wider">Target Date</p>
                <p className="text-text-secondary text-sm">{targetDate}</p>
              </div>
            </div>

            <Separator className="border-surface-border/15" />

            <div className="space-y-4">
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-text-tertiary text-sm font-medium">Current Progress</p>
                  <p className="text-3xl lg:text-4xl font-bold text-text-primary tracking-tight">
                    {formatIDR(current)} <span className="text-text-tertiary font-normal text-lg">/ {formatIDR(target)}</span>
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className={cn('font-bold text-2xl lg:text-3xl', targetProgress >= 50 ? 'text-success-600 dark:text-success-400' : 'text-warning-600 dark:text-warning-400')}>
                    {targetProgress}%
                  </p>
                  <p className="text-text-tertiary text-xs mt-0.5">Complete</p>
                </div>
              </div>

              <div className="h-3 bg-surface-border/20 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full bg-brand-500 rounded-full transition-all duration-1000 ease-out',
                    animate ? 'w-full' : 'w-0'
                  )}
                  style={{ width: `${targetProgress}%` }}
                  role="progressbar"
                  aria-valuenow={targetProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${title} progress`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MetricCard
                  icon={<DollarSign className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                  label="Monthly"
                  value={formatIDR(monthlyContribution)}
                />
                <MetricCard
                  icon={<Calendar className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                  label="Remaining"
                  value={formatIDR(remaining)}
                />
                <MetricCard
                  icon={<TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                  label="Progress"
                  value={`${targetProgress}%`}
                />
                <MetricCard
                  icon={<Target className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                  label="Target"
                  value={formatIDR(target)}
                />
              </div>

              <Separator className="border-surface-border/15" />

              <div>
                <p className="text-text-secondary text-sm font-medium mb-3">Milestones</p>
                <div className="space-y-2.5">
                  {milestones.map((milestone, index) => (
                    <MilestoneItem key={milestone.label} milestone={milestone} index={index} targetProgress={targetProgress} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card size="sm" className="border-surface-border/10 bg-surface/50">
      <CardContent className="pt-3 pb-3 px-3 text-center">
        <div className="flex items-center justify-center gap-1.5 mb-1.5">
          {icon}
        </div>
        <p className="text-text-tertiary text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className="text-text-primary font-bold text-lg mt-0.5">{value}</p>
      </CardContent>
    </Card>
  )
}

function MilestoneItem({ milestone, index, targetProgress = 68 }: { milestone: { label: string; completed: boolean }; index: number; targetProgress?: number }) {
  const isCompleted = milestone.completed
  const milestoneProgress = (index + 1) * 25
  const shouldShowCompleted = isCompleted || targetProgress >= milestoneProgress

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-border/10">
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300',
        shouldShowCompleted
          ? 'bg-success-500 border-success-500 text-white'
          : 'border-surface-border/30 text-text-tertiary'
      )}>
        {shouldShowCompleted ? (
          <Check size={14} />
        ) : (
          <Circle className="w-3 h-3" />
        )}
      </div>
      <p className={cn('text-sm font-medium', shouldShowCompleted ? 'text-text-primary' : 'text-text-secondary')}>
        {milestone.label}
      </p>
    </div>
  )
}

export default FinancialGoalsSection