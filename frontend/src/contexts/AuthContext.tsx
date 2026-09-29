import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  refreshUser as refreshUserRequest,
  register as registerRequest,
} from "@/lib/auth"

import type {
  LoginPayload,
  RegisterPayload,
  User,
} from "@/lib/auth"

type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginPayload) => Promise<User>
  register: (data: RegisterPayload) => Promise<User>
  logout: () => Promise<void>
  refreshUser: () => Promise<User | null>
}

type AuthProviderProps = {
  children: React.ReactNode
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function login(
    data: LoginPayload,
  ): Promise<User> {
    const loggedInUser = await loginRequest(data)

    setUser(loggedInUser)

    return loggedInUser
  }

  async function register(
    data: RegisterPayload,
  ): Promise<User> {
    const registeredUser = await registerRequest(data)

    setUser(registeredUser)

    return registeredUser
  }

  async function logout(): Promise<void> {
    await logoutRequest()

    setUser(null)
  }

  async function refreshUser(): Promise<User | null> {
    const refreshedUser = await refreshUserRequest()

    setUser(refreshedUser)

    return refreshedUser
  }

  useEffect(() => {
    let active = true

    async function checkSession() {
      try {
        const currentUser = await getCurrentUser()

        if (active) {
          setUser(currentUser)
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void checkSession()

    return () => {
      active = false
    }
  }, [])

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider",
    )
  }

  return context
}