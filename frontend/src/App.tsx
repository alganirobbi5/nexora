import { HeroFinancial } from '@/components/ui/hero-financial'
import { FeaturesSection } from '@/components/landing/features-section'
import { ProductShowcase } from '@/components/landing/product-showcase'
import { FinancialGoalsSection } from '@/components/landing/financial-goals'

function App() {
  return (
    <>
      <HeroFinancial />
      <FeaturesSection />
      <ProductShowcase />
      <FinancialGoalsSection />
    </>
  )
}

export default App