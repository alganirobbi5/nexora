import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HeroFinancial from '@/components/ui/hero-financial'
import { FeaturesSection } from '@/components/landing/features-section'
import { ProductShowcase } from '@/components/landing/product-showcase'
import { FinancialGoalsSection } from '@/components/landing/financial-goals'
import { AnalyticsSection } from '@/components/landing/analytics-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { FinalCTASection } from '@/components/landing/final-cta-section'
import { Footer } from '@/components/landing/footer'
import AuthView from '@/components/auth/AuthView'

function App() {
  const [view, setView] = React.useState<'landing' | 'auth'>('landing')

  if (view === 'auth') {
    return (
      <AuthView onClose={() => setView('landing')} />
    )
  }

  return (
    <>
      <HeroFinancial />
      <FeaturesSection />
      <ProductShowcase />
      <FinancialGoalsSection />
      <AnalyticsSection />
      <HowItWorksSection />
      <FinalCTASection onStart={() => setView('auth')} />
      <Footer />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

export default App