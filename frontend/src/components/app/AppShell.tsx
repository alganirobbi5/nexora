import useAuthState from '@/hooks/useAuthState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AppShell() {
  const { user, isLoading, logout } = useAuthState()

  if (isLoading) {
    return (
      <div className="min-h-vh flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg text-center">
          <div className="animate-spin h-12 w-12 mx-auto border-2 border-current border-transparent rounded-full" />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-vh bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-brand-600 dark:text-brand-400"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M16 2L4 8v16l12 6 12-6V8L16 2zm0 2.5l9.5 4.75v11L16 27.5l-9.5-4.75V11L16 4.5z"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M16 10v12M10 16h12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wider">NEXORA</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Personal Finance</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Welcome, {user.name || ''}
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Logout"
              onClick={logout}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      <main className="py-6 max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Welcome back, {user.name || ''}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Your NEXORA workspace is ready.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">Coming soon</p>
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle>Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">Coming soon</p>
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">Coming soon</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}