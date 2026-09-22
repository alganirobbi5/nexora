import { HeroFinancial } from '@/components/ui/hero-financial'
import { FeaturesSection } from '@/components/landing/features-section'
import { ProductShowcase } from '@/components/landing/product-showcase'
import { FinancialGoalsSection } from '@/components/landing/financial-goals'
import { AnalyticsSection } from '@/components/landing/analytics-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'

function App() {
  return (
    <>
      <HeroFinancial />
      <FeaturesSection />
      <ProductShowcase />
      <FinancialGoalsSection />
      <AnalyticsSection />
      <HowItWorksSection />
    </>
  )
}

export default App