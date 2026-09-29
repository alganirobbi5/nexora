import {
  ApiError,
  authenticatedGet,
  authenticatedPost,
  getJson,
} from "./api"

import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "./api"

let currentUser: User | null = null

/**
 * Registers a new user.
 * Laravel automatically authenticates the new user after registration.
 */
export async function register(
  data: RegisterPayload,
): Promise<User> {
  const response = await authenticatedPost("/api/register", {
    body: JSON.stringify(data),
  })

  const result = await getJson<AuthResponse>(response)

  currentUser = result.user

  return result.user
}

/**
 * Logs in an existing user using the Laravel session.
 */
export async function login(
  data: LoginPayload,
): Promise<User> {
  const response = await authenticatedPost("/api/login", {
    body: JSON.stringify(data),
  })

  const result = await getJson<AuthResponse>(response)

  currentUser = result.user

  return result.user
}

/**
 * Logs out the authenticated user and clears local session state.
 */
export async function logout(): Promise<void> {
  const response = await authenticatedPost("/api/logout")

  await getJson<{ message: string }>(response)

  currentUser = null
}

/**
 * Returns the current authenticated user.
 *
 * A 401 means there is no authenticated session.
 * Other errors are re-thrown so network/server problems are not silently
 * treated as "logged out".
 */
export async function getCurrentUser(): Promise<User | null> {
  if (currentUser) {
    return currentUser
  }

  try {
    const response = await authenticatedGet("/api/user")
    const user = await getJson<User>(response)

    currentUser = user

    return user
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      currentUser = null

      return null
    }

    throw error
  }
}

export type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
}