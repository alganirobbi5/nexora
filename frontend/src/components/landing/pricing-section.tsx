import { Button } from "@/components/ui/button"

interface PricingSectionProps {
  onStart?: () => void
}

interface PricingTier {
  name: string
  price: string
  features: string[]
  mostPopular?: boolean
  disabled?: boolean
}

const pricingTiers: PricingTier[] = [
  {
    name: "FREE",
    price: "Rp 0",
    features: [
      "Transaction tracking",
      "Basic financial dashboard",
      "Financial goals",
      "Task management",
    ],
  },
  {
    name: "PLUS",
    price: "Coming soon",
    features: [
      "Everything in Free",
      "Advanced financial insights",
      "Enhanced goal tracking",
      "Expanded productivity tools",
    ],
    mostPopular: true,
    disabled: true,
  },
  {
    name: "PRO",
    price: "Coming soon",
    features: [
      "Everything in Plus",
      "Advanced analytics",
      "Priority features",
      "Future premium tools",
    ],
    disabled: true,
  },
]

export default function PricingSection({
  onStart,
}: PricingSectionProps) {
  return (
    <section
      id="pricing"
      className="bg-bg-primary px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-brand-500">
            Pricing
          </p>

          <h2
            id="pricing-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl"
          >
            Simple plans for every stage
          </h2>

          <p className="mt-4 text-base leading-7 text-text-secondary">
            Start with the essentials and grow with NEXORA as more
            advanced tools become available.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <article
              key={tier.name}
              className={`relative flex min-w-0 flex-col rounded-2xl border p-6 ${
                tier.mostPopular
                  ? "border-brand-500 bg-brand-500/5"
                  : "border-border bg-bg-secondary"
              }`}
            >
              {tier.mostPopular ? (
                <span className="absolute right-4 top-4 rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-white">
                  Most Popular
                </span>
              ) : null}

              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {tier.name}
                </h3>

                <p className="mt-3 text-2xl font-semibold text-text-primary">
                  {tier.price}
                </p>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-text-secondary"
                  >
                    <span
                      className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500"
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  type="button"
                  onClick={onStart}
                  disabled={tier.disabled}
                  className="w-full"
                >
                  {tier.disabled ? "Coming soon" : "Start for free"}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}