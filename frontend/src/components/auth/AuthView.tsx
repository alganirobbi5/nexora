import React from 'react'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'

type AuthViewProps = {
  onClose: () => void
}

export default function AuthView({ onClose }: AuthViewProps) {
  const [view, setView] = React.useState<'login' | 'register'>('login')

  const switchView = (next: 'login' | 'register') => {
    setView(next)
  }

  const handleClose = () => {
    setView('login')
    onClose()
  }

  if (view === 'login') {
    return (
      <LoginPage
        onCreateAccount={() => switchView('register')}
      />
    )
  }

  return (
    <RegisterPage
      onSignIn={() => switchView('login')}
      onBack={handleClose}
    />
  )
}