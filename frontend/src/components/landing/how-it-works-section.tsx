import { Target, Receipt, ChartNoAxesCombined } from 'lucide-react'
import { useMediaQuery } from '@/components/ui/hero-financial-utils/use-media-query'

interface Step {
  id: string
  number: string
  title: string
  description: string
  Icon: React.ComponentType<{ className?: string }>
}

const steps: Step[] = [
  {
    id: 'track',
    number: '01',
    title: 'Track',
    description:
      'Keep your everyday income and expenses organized in one place.',
    Icon: Receipt,
  },
  {
    id: 'plan',
    number: '02',
    title: 'Plan',
    description:
      'Turn financial goals into clear milestones and measurable progress.',
    Icon: Target,
  },
  {
    id: 'understand',
    number: '03',
    title: 'Understand',
    description:
      'See spending patterns and financial trends so your next decision is easier.',
    Icon: ChartNoAxesCombined,
  },
]

export function HowItWorksSection() {
  const isMobile = useMediaQuery('(max-width: 768px)', { defaultMatches: false })
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)', {
    defaultMatches: false,
  })

  return (
    <section
      className="relative w-full py-12 lg:py-16 bg-bg-primary overflow-hidden"
      aria-labelledby="how-it-works-heading"
    >
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true"
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-brand-500/10 blur-3xl"
          style={{ filter: 'blur(80px)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-brand-600/5 blur-3xl"
          style={{ filter: 'blur(80px)' }}
        />
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 100 100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.5%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.02%22/%3E%3C/svg%3E')] opacity-20"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p
            className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-500 dark:text-brand-400"
          >
            HOW NEXORA WORKS
          </p>
          <h2 id="how-it-works-heading" className="mb-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text-primary">
            From activity to clarity.
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-xl mx-auto">
            Stay organized, plan ahead, and understand your financial habits from one focused workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {steps.map((step) => (
            <StepCard key={step.id} step={step} isMobile={isMobile} isTablet={isTablet} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StepCard({
  step,
  isMobile,
  isTablet,
}: {
  step: Step
  isMobile: boolean
  isTablet: boolean
}) {
  const { number, title, description, Icon } = step

  if (isMobile) {
    return (
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface-border/20 flex items-center justify-center flex-none">
            <Icon className="w-5 h-5 text-brand-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-text-primary font-medium text-lg">{title}</h3>
            <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
          </div>
        </div>
        {step.id !== 'understand' && (
          <div className="h-px bg-surface-border/10"></div>
        )}
      </div>
    )
  }

  if (isTablet) {
    return (
      <div className="group hover:shadow-sm hover:border-brand-500/20 transition-all duration-200 flex flex-col items-center px-4 py-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-surface-border/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-brand-500" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            {number}
          </span>
        </div>
        <h3 className="text-text-primary font-medium text-center text-lg">{title}</h3>
        <p className="text-text-secondary text-center text-sm leading-relaxed mt-1">
          {description}
        </p>
      </div>
    )
  }

  return (
    <div className="group hover:shadow-sm hover:border-brand-500/20 transition-all duration-200">
      <div className="flex flex-col items-center justify-center gap-2 px-4 py-6">
        <div className="w-14 h-14 rounded-2xl bg-surface-border/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-brand-500" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            {number}
          </p>
          <h3 className="text-text-primary font-medium text-lg">{title}</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )
}