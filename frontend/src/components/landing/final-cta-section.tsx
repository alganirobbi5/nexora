import { Button } from '@/components/ui/button'

export function FinalCTASection() {
  return (
    <section
      className="relative py-12 lg:py-16 bg-bg-primary text-text-primary"
      aria-label="Final call to action"
    >
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p
          className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-500 dark:text-brand-400"
        >
          READY TO TAKE CONTROL?
        </p>
        <h2 className="mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
          Your money deserves a clearer place to live.
        </h2>
        <p className="mb-6 text-lg sm:text-xl text-text-secondary leading-relaxed">
          Bring your finances, goals, and everyday priorities together with NEXORA.
        </p>
        <Button
          className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-brand-600 hover:bg-brand-700 text-white font-medium text-lg rounded-xl transition-colors shadow-lg shadow-brand-500/25"
          aria-label="Start for free"
        >
          Start for free
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Button>
        <p className="mt-4 text-sm text-text-tertiary">
          No credit card required
        </p>
      </div>
    </section>
  )
}