import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useAuthState from "@/hooks/useAuthState"
import { ApiError } from "@/lib/api"

export default function LoginPage() {
  const { login } = useAuthState()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[]>
  >({})
  const [signedInUser, setSignedInUser] = useState<{
    name: string
    email: string
  } | null>(null)

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setIsSubmitting(true)
    setGeneralError(null)
    setFieldErrors({})

    try {
      const user = await login({
        email,
        password,
        remember,
      })

      setSignedInUser({
        name: user.name,
        email: user.email,
      })
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.validationErrors) {
          setFieldErrors(error.validationErrors)
        }

        setGeneralError(error.message)
      } else {
        setGeneralError(
          "Unable to sign in. Please try again.",
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (signedInUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-8 text-center shadow-2xl">
          <div className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
            NEXORA
          </div>

          <h1 className="text-2xl font-semibold text-white">
            Signed in successfully
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            Welcome back, {signedInUser.name}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {signedInUser.email}
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
            NEXORA
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Sign in to continue managing your money and goals.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-8">
          <form
            className="space-y-5"
            onSubmit={handleSubmit}
          >
            {generalError && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {generalError}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-200"
              >
                Email
              </label>

              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                disabled={isSubmitting}
                required
              />

              {fieldErrors.email?.[0] && (
                <p className="text-sm text-red-400">
                  {fieldErrors.email[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-200"
              >
                Password
              </label>

              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                disabled={isSubmitting}
                required
              />

              {fieldErrors.password?.[0] && (
                <p className="text-sm text-red-400">
                  {fieldErrors.password[0]}
                </p>
              )}
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) =>
                  setRemember(event.target.checked)
                }
                disabled={isSubmitting}
                className="h-4 w-4 rounded border-slate-600"
              />

              Remember me
            </label>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Signing in..."
                : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}