// API client for the NEXORA Laravel backend.
// Authentication uses Laravel Sanctum session cookies.

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000"

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface LoginPayload {
  email: string
  password: string
  remember?: boolean
}

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
}

export type ValidationErrors = Record<string, string[]>

export class ApiError extends Error {
  status: number
  validationErrors?: ValidationErrors

  constructor(
    status: number,
    message: string,
    validationErrors?: ValidationErrors,
  ) {
    super(message)

    this.name = "ApiError"
    this.status = status
    this.validationErrors = validationErrors
  }
}

/**
 * Throws ApiError when a response is not successful.
 */
async function handleResponse(response: Response): Promise<void> {
  if (response.ok) {
    return
  }

  let errorData: {
    message?: string
    errors?: ValidationErrors
  } = {}

  try {
    errorData = await response.json()
  } catch {
    // Response may not contain JSON.
  }

  throw new ApiError(
    response.status,
    errorData.message || "Request failed",
    errorData.errors,
  )
}

/**
 * Initializes Laravel Sanctum CSRF protection.
 */
export async function initializeCsrf(): Promise<void> {
  const response = await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  })

  await handleResponse(response)
}

/**
 * Reads the XSRF-TOKEN cookie.
 */
function readXsrfToken(): string | null {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith("XSRF-TOKEN="))

  if (!cookie) {
    return null
  }

  const value = cookie.substring("XSRF-TOKEN=".length)

  return decodeURIComponent(value)
}

/**
 * Initializes CSRF protection and returns the current XSRF token.
 */
export async function getXsrfToken(): Promise<string | null> {
  await initializeCsrf()

  return readXsrfToken()
}

/**
 * Makes an authenticated GET request.
 */
export async function authenticatedGet(url: string): Promise<Response> {
  return fetch(`${BASE_URL}${url}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  })
}

/**
 * Makes an authenticated POST request protected by Sanctum CSRF.
 */
export async function authenticatedPost(
  url: string,
  init: RequestInit = {},
): Promise<Response> {
  const xsrfToken = await getXsrfToken()
  const headers = new Headers(init.headers)

  headers.set("Accept", "application/json")
  headers.set("Content-Type", "application/json")

  if (xsrfToken) {
    headers.set("X-XSRF-TOKEN", xsrfToken)
  }

  return fetch(`${BASE_URL}${url}`, {
    ...init,
    method: "POST",
    credentials: "include",
    headers,
  })
}

/**
 * Makes a GET request without session credentials.
 */
export async function unauthenticatedGet(
  url: string,
): Promise<Response> {
  return fetch(`${BASE_URL}${url}`, {
    method: "GET",
    credentials: "omit",
    headers: {
      Accept: "application/json",
    },
  })
}

/**
 * Validates the response and parses its JSON body.
 */
export async function getJson<T>(response: Response): Promise<T> {
  await handleResponse(response)

  return response.json() as Promise<T>
}