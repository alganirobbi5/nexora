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

export interface DashboardTrendMonth {
  year: number
  month: number
  label: string
  income: number
  expenses: number
  net_cash_flow: number
}

export interface DashboardCategoryBreakdownItem {
  category_id: number | null
  category_name: string
  amount: number
  percentage: number
}

export interface DashboardRecentTransaction {
  id: number
  type: "income" | "expense"
  amount: number
  description: string | null
  transaction_date: string
  category_id: number | null
  category: {
    id: number
    name: string
    icon: string | null
    color: string | null
  } | null
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

function readXsrfToken(): string | null {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith("XSRF-TOKEN="))

  if (!cookie) {
    return null
  }

  return decodeURIComponent(
    cookie.substring("XSRF-TOKEN=".length),
  )
}

export async function getXsrfToken(): Promise<string | null> {
  await initializeCsrf()

  return readXsrfToken()
}

export async function authenticatedGet(
  url: string,
): Promise<Response> {
  return fetch(`${BASE_URL}${url}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  })
}

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

export async function authenticatedPut(
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
    method: "PUT",
    credentials: "include",
    headers,
  })
}

export async function authenticatedDelete(
  url: string,
): Promise<Response> {
  const xsrfToken = await getXsrfToken()
  const headers = new Headers()

  headers.set("Accept", "application/json")

  if (xsrfToken) {
    headers.set("X-XSRF-TOKEN", xsrfToken)
  }

  return fetch(`${BASE_URL}${url}`, {
    method: "DELETE",
    credentials: "include",
    headers,
  })
}

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

export async function getJson<T>(
  response: Response,
): Promise<T> {
  await handleResponse(response)

  return response.json() as Promise<T>
}

// ==========================================================
// Dashboard
// ==========================================================

export interface DashboardSummary {
  selected_year: number
  selected_month: number
  monthly_income: number
  monthly_expenses: number
  net_cash_flow: number
  six_month_trend: DashboardTrendMonth[]
  category_breakdown: DashboardCategoryBreakdownItem[]
  recent_transactions: DashboardRecentTransaction[]
  active_goals: number
}

export async function getDashboardSummary(
  year?: number,
  month?: number,
): Promise<DashboardSummary> {
  const params = new URLSearchParams()

  if (year !== undefined) {
    params.set("year", String(year))
  }

  if (month !== undefined) {
    params.set("month", String(month))
  }

  const query = params.toString()
  const response = await authenticatedGet(
    `/api/dashboard${query ? `?${query}` : ""}`,
  )

  return getJson<DashboardSummary>(response)
}

// ==========================================================
// Categories
// ==========================================================

export interface Category {
  id: number
  user_id: number
  name: string
  type: "income" | "expense"
  created_at?: string
  updated_at?: string
}

export interface CreateCategoryPayload {
  name: string
  type: "income" | "expense"
}

export interface UpdateCategoryPayload {
  name?: string
  type?: "income" | "expense"
}

export async function getCategories(): Promise<Category[]> {
  const response = await authenticatedGet("/api/categories")

  return getJson<Category[]>(response)
}

export async function createCategory(
  payload: CreateCategoryPayload,
): Promise<Category> {
  const response = await authenticatedPost("/api/categories", {
    body: JSON.stringify(payload),
  })

  return getJson<Category>(response)
}

export async function updateCategory(
  id: number,
  payload: UpdateCategoryPayload,
): Promise<Category> {
  const response = await authenticatedPut(
    `/api/categories/${id}`,
    {
      body: JSON.stringify(payload),
    },
  )

  return getJson<Category>(response)
}

export async function deleteCategory(
  id: number,
): Promise<void> {
  const response = await authenticatedDelete(
    `/api/categories/${id}`,
  )

  await handleResponse(response)
}

// ==========================================================
// Transactions
// ==========================================================

export interface Transaction {
  id: number
  user_id: number
  category_id: number | null
  type: "income" | "expense"
  amount: number
  description: string | null
  transaction_date: string
  created_at: string
  updated_at: string
}

export interface CreateTransactionPayload {
  type: "income" | "expense"
  amount: number
  description?: string | null
  transaction_date: string
  category_id?: number | null
}

export interface UpdateTransactionPayload {
  type?: "income" | "expense"
  amount?: number
  description?: string | null
  transaction_date?: string
  category_id?: number | null
}

export async function getTransactions(): Promise<Transaction[]> {
  const response = await authenticatedGet(
    "/api/transactions",
  )

  return getJson<Transaction[]>(response)
}

export async function createTransaction(
  payload: CreateTransactionPayload,
): Promise<Transaction> {
  const response = await authenticatedPost(
    "/api/transactions",
    {
      body: JSON.stringify(payload),
    },
  )

  return getJson<Transaction>(response)
}

export async function updateTransaction(
  id: number,
  payload: UpdateTransactionPayload,
): Promise<Transaction> {
  const response = await authenticatedPut(
    `/api/transactions/${id}`,
    {
      body: JSON.stringify(payload),
    },
  )

  return getJson<Transaction>(response)
}

export async function deleteTransaction(
  id: number,
): Promise<void> {
  const response = await authenticatedDelete(
    `/api/transactions/${id}`,
  )

  await handleResponse(response)
}

// ==========================================================
// Financial Goals
// ==========================================================

export interface FinancialGoal {
  id: number
  user_id: number
  title: string
  target_amount: number
  current_amount: number
  opening_amount: number
  contributions_total: number
  collected_amount: number
  remaining_amount: number
  progress_percentage: number
  deadline: string | null
  status: "active" | "completed" | "archived"
  created_at?: string
  updated_at?: string
}

export interface CreateFinancialGoalPayload {
  title: string
  target_amount: number
  opening_amount?: number
  current_amount?: number
  deadline?: string | null
  status?: "active" | "completed" | "archived"
}

export interface UpdateFinancialGoalPayload {
  title?: string
  target_amount?: number
  opening_amount?: number
  current_amount?: number
  deadline?: string | null
  status?: "active" | "completed" | "archived"
}

export async function getFinancialGoals(): Promise<
  FinancialGoal[]
> {
  const response = await authenticatedGet(
    "/api/financial-goals",
  )

  return getJson<FinancialGoal[]>(response)
}

export async function createFinancialGoal(
  payload: CreateFinancialGoalPayload,
): Promise<FinancialGoal> {
  const response = await authenticatedPost(
    "/api/financial-goals",
    {
      body: JSON.stringify(payload),
    },
  )

  return getJson<FinancialGoal>(response)
}

export async function updateFinancialGoal(
  id: number,
  payload: UpdateFinancialGoalPayload,
): Promise<FinancialGoal> {
  const response = await authenticatedPut(
    `/api/financial-goals/${id}`,
    {
      body: JSON.stringify(payload),
    },
  )

  return getJson<FinancialGoal>(response)
}

export async function deleteFinancialGoal(
  id: number,
): Promise<void> {
  const response = await authenticatedDelete(
    `/api/financial-goals/${id}`,
  )

  await handleResponse(response)
}

// ==========================================================
// Financial Goal Contributions
// ==========================================================

export interface GoalContribution {
  id: number
  financial_goal_id: number
  amount: number
  contribution_date: string
  note: string | null
  created_at?: string
  updated_at?: string
}

export interface CreateGoalContributionPayload {
  amount: number
  contribution_date: string
  note?: string | null
}

export type UpdateGoalContributionPayload =
  Partial<CreateGoalContributionPayload>

export async function getGoalContributions(
  goalId: number,
): Promise<GoalContribution[]> {
  const response = await authenticatedGet(
    `/api/financial-goals/${goalId}/contributions`,
  )

  return getJson<GoalContribution[]>(response)
}

export async function createGoalContribution(
  goalId: number,
  payload: CreateGoalContributionPayload,
): Promise<GoalContribution> {
  const response = await authenticatedPost(
    `/api/financial-goals/${goalId}/contributions`,
    {
      body: JSON.stringify(payload),
    },
  )

  return getJson<GoalContribution>(response)
}

export async function updateGoalContribution(
  goalId: number,
  contributionId: number,
  payload: UpdateGoalContributionPayload,
): Promise<GoalContribution> {
  const response = await authenticatedPut(
    `/api/financial-goals/${goalId}/contributions/${contributionId}`,
    {
      body: JSON.stringify(payload),
    },
  )

  return getJson<GoalContribution>(response)
}

export async function deleteGoalContribution(
  goalId: number,
  contributionId: number,
): Promise<void> {
  const response = await authenticatedDelete(
    `/api/financial-goals/${goalId}/contributions/${contributionId}`,
  )

  await handleResponse(response)
}

// ==========================================================
// Tasks
// ==========================================================

export interface Task {
  id: number
  user_id: number
  title: string
  description: string | null
  status: "pending" | "completed"
  priority: "low" | "medium" | "high"
  due_at: string | null
  created_at?: string
  updated_at?: string
}

export interface CreateTaskPayload {
  title: string
  description?: string | null
  status?: "pending" | "completed"
  priority?: "low" | "medium" | "high"
  due_at?: string | null
}

export interface UpdateTaskPayload {
  title?: string
  description?: string | null
  status?: "pending" | "completed"
  priority?: "low" | "medium" | "high"
  due_at?: string | null
}

export async function getTasks(): Promise<Task[]> {
  const response = await authenticatedGet("/api/tasks")

  return getJson<Task[]>(response)
}

export async function createTask(
  payload: CreateTaskPayload,
): Promise<Task> {
  const response = await authenticatedPost("/api/tasks", {
    body: JSON.stringify(payload),
  })

  return getJson<Task>(response)
}

export async function updateTask(
  id: number,
  payload: UpdateTaskPayload,
): Promise<Task> {
  const response = await authenticatedPut(`/api/tasks/${id}`, {
    body: JSON.stringify(payload),
  })

  return getJson<Task>(response)
}

export async function deleteTask(
  id: number,
): Promise<void> {
  const response = await authenticatedDelete(
    `/api/tasks/${id}`,
  )

  await handleResponse(response)
}

// ==========================================================
// Budgets
// ==========================================================

export interface BudgetCategory {
  id: number
  user_id: number
  name: string
  type: "income" | "expense"
  icon?: string | null
  color?: string | null
}

export interface Budget {
  id: number
  category_id: number
  category: BudgetCategory
  year: number
  month: number
  limit_amount: string | number
  used_amount: number
  remaining_amount: number
  overspent_amount: number
  percentage: number
  status: string
  status_color: string
}

export interface BudgetsResponse {
  selected_month: number
  selected_year: number
  budgets: Budget[]
}

export interface CreateBudgetPayload {
  category_id: number
  year: number
  month: number
  limit_amount: number
}

export type UpdateBudgetPayload = Partial<CreateBudgetPayload>

export interface BudgetMutationResult {
  id: number
  category_id: number
  category: BudgetCategory
  year: number
  month: number
  limit_amount: string | number
  message: string
}

export async function getBudgets(
  year: number,
  month: number,
): Promise<BudgetsResponse> {
  const response = await authenticatedGet(
    `/api/budgets?year=${year}&month=${month}`,
  )

  return getJson<BudgetsResponse>(response)
}

export async function createBudget(
  payload: CreateBudgetPayload,
): Promise<BudgetMutationResult> {
  const response = await authenticatedPost("/api/budgets", {
    body: JSON.stringify(payload),
  })

  return getJson<BudgetMutationResult>(response)
}

export async function updateBudget(
  id: number,
  payload: UpdateBudgetPayload,
): Promise<BudgetMutationResult> {
  const response = await authenticatedPut(`/api/budgets/${id}`, {
    body: JSON.stringify(payload),
  })

  return getJson<BudgetMutationResult>(response)
}

export async function deleteBudget(id: number): Promise<void> {
  const response = await authenticatedDelete(
    `/api/budgets/${id}`,
  )

  await handleResponse(response)
}