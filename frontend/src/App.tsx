import { StrictMode, useState } from 'react'
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
import AppShell from '@/components/app/AppShell'
import useAuthState from '@/hooks/useAuthState'

function App() {
  const { user, isAuthenticated, isLoading } = useAuthState()
  const [view, setView] = useState<'landing' | 'auth' | 'app'>('landing')

  if (isLoading) {
    return (
      <div className="min-h-vh flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg text-center">
          <div className="animate-spin h-12 w-12 mx-auto border-2 border-current border-transparent rounded-full" />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated && user) {
    return <AppShell />
  }

  if (view === 'auth') {
    return (
      <AuthView onClose={() => setView('landing')} />
    )
  }

  return (
    <>
      <HeroFinancial onStart={() => setView('auth')} />
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