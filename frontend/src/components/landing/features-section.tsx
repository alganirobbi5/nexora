import { Warp } from '@paper-design/shaders-react'
import { Wallet, ChartNoAxesCombined, Target, ChartPie, ListTodo, HeartPulse } from 'lucide-react'

interface Feature {
  icon: typeof Wallet
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: Wallet,
    title: 'Understand Your Money',
    description: 'Track income, expenses, categories, and balances without digging through spreadsheets.',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'See Your Cash Flow',
    description: 'Understand where your money comes from and where it goes with a clear monthly overview.',
  },
  {
    icon: Target,
    title: 'Reach Your Goals',
    description: 'Set savings targets, track progress, and keep your next milestone visible.',
  },
  {
    icon: ChartPie,
    title: 'Turn Data Into Insight',
    description: 'See spending patterns and financial trends through simple, useful analytics.',
  },
  {
    icon: ListTodo,
    title: 'Stay On Track',
    description: 'Connect financial plans with everyday tasks, deadlines, and priorities.',
  },
  {
    icon: HeartPulse,
    title: 'Know Your Financial Health',
    description: 'Get a quick view of your financial position and the habits that matter most.',
  },
]

const cardShaderConfig = {
  speed: 0.1,
  turbulence: 0.4,
  frequency: 0.45,
  amplitude: 0.15,
  colors: [
    'var(--color-brand-500)',
    'var(--color-brand-400)',
    'var(--color-brand-600)',
  ],
  backgroundColor: 'transparent',
  warp: 0.2,
  rotate: 0,
  scale: 1.05,
}

export function FeaturesSection() {
  return (
    <section
      className="relative w-full py-14 lg:py-20 bg-bg-secondary overflow-hidden"
      aria-labelledby="features-heading"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-brand-500/10 blur-3xl"
          style={{ filter: 'blur(100px)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full bg-brand-600/5 blur-3xl"
          style={{ filter: 'blur(100px)' }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 100 100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.015%22/%3E%3C/svg%3E')] opacity-40" />
        <div
          className="absolute inset-0 bg-gradient-to-b from-brand-900/20 via-transparent to-transparent"
          style={{ opacity: 0.4 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-500 dark:text-brand-400">
            BUILT FOR BETTER MONEY HABITS
          </p>
          <h2
            id="features-heading"
            className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary"
          >
            Everything you need to stay in control.
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
            NEXORA brings your money, goals, and daily priorities into one focused workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ feature }: { feature: Feature }) {
  const { icon: Icon, title, description } = feature

  return (
    <article className="relative group">
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <Warp
          speed={cardShaderConfig.speed}
          colors={cardShaderConfig.colors}
          distortion={cardShaderConfig.turbulence}
          softness={cardShaderConfig.amplitude}
          shapeScale={cardShaderConfig.frequency}
          swirl={cardShaderConfig.warp}
          scale={cardShaderConfig.scale}
          className="absolute inset-0 opacity-10"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-brand-600/3"
          aria-hidden="true"
        />
      </div>

      <div className="relative h-full p-6 lg:p-7 rounded-2xl bg-surface/60 backdrop-blur-sm border border-surface-border/20 transition-all duration-300 hover:border-brand-500/25 hover:shadow-xl hover:shadow-brand-500/10">
        <div className="mb-4 lg:mb-5 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
          <div className="relative w-11 h-11 rounded-xl bg-brand-500/15 dark:bg-brand-500/20 flex items-center justify-center text-brand-500 dark:text-brand-400 group-hover:bg-brand-500/25 dark:group-hover:bg-brand-500/30 group-hover:scale-105 transition-all duration-300">
            <Icon className="w-5 h-5 lg:w-6 lg:h-6" aria-hidden="true" />
          </div>
        </div>
        <h3 className="mb-2 lg:mb-3 text-lg lg:text-xl font-semibold text-text-primary">
          {title}
        </h3>
        <p className="text-text-secondary leading-relaxed text-sm lg:text-base">
          {description}
        </p>
      </div>
    </article>
  )
}