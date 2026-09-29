import {
  ApiError,
  authenticatedGet,
  authenticatedPost,
  getJson,
} from "./api";

import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "./api";

let currentUser: User | null = null;

/**
 * Registers a new user.
 * Laravel automatically authenticates the new user after registration.
 */
export async function register(
  data: RegisterPayload,
): Promise<User> {
  const response = await authenticatedPost("/api/register", {
    body: JSON.stringify(data),
  });

  const result = await getJson<AuthResponse>(response);

  currentUser = result.user;

  return result.user;
}

/**
 * Logs in an existing user.
 */
export async function login(data: LoginPayload): Promise<User> {
  const response = await authenticatedPost("/api/login", {
    body: JSON.stringify(data),
  });

  const result = await getJson<AuthResponse>(response);

  // Regenerate session
  const response2 = await authenticatedPost("/api/login", {
    body: JSON.stringify(data),
  });

  currentUser = result.user;

  return result.user;
}

/**
 * Logs out the current user.
 */
export async function logout(): Promise<void> {
  await authenticatedPost("/api/logout");
  currentUser = null;
}

/**
 * Gets the current authenticated user.
 */
export async function getCurrentUser(): Promise<User | null> {
  if (currentUser) {
    return currentUser;
  }

  try {
    const response = await authenticatedGet("/api/user");

    const user = await getJson<User>(response);

    currentUser = user;

    return user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      currentUser = null;

      return null;
    }

    throw error;
  }
}

/**
 * Refreshes the current user.
 */
export async function refreshUser(): Promise<User | null> {
  return getCurrentUser();
}

export type { AuthResponse, LoginPayload, RegisterPayload, User };