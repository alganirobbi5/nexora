import React from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useAuthState from '@/hooks/useAuthState'


type RegisterPageProps = {
  onSignIn?: () => void
  onBack?: () => void
}

export default function RegisterPage({ onSignIn, onBack }: RegisterPageProps) {
  const { register } = useAuthState()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[]>
  >({})
  const [registeredUser, setRegisteredUser] = useState<{
    name: string
    email: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setGeneralError(null)
    setFieldErrors({})

    try {
      const user = await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      setRegisteredUser(user)
    } catch (err: any) {
      setIsSubmitting(false)
      if (err?.error) {
        if (err.error.errors) {
          setFieldErrors(err.error.errors)
        } else {
          setGeneralError(err.error.message || 'Registration failed')
        }
      } else if (err?.message) {
        setGeneralError(err.message)
      } else {
        setGeneralError('Failed to create account. Please try again.')
      }
    }
  }

  if (registeredUser) {
    return (
      <div className="min-h-vh flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg max-w-md w-full">
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Account created successfully
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Welcome, {registeredUser.name || ''}
          </p>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {registeredUser.email}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-vh flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg max-w-md w-full">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Create your account
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Sign up to get started
            </p>
          </div>

          {generalError && (
            <div className="mb-3 p-3 rounded bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm">
              {generalError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <Input
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email address
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password confirmation
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {fieldErrors.password && (
            <div className="mb-3 p-3 rounded bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm">
              {fieldErrors.password[0]}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center">
                <svg
                  className="mr-2 h-4 w-4 animate-spin opacity-70"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Creating account...
              </span>
            ) : (
              'Create account'
            )}
          </Button>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
              onClick={onSignIn}
            >
              Already have an account? Sign in
            </a>
          </p>
          <button
            onClick={onBack}
            className="mt-2 text-xs text-slate-400 dark:text-slate-600 underline"
          >
            Close
          </button>
        </form>
      </div>
    </div>
  )
}