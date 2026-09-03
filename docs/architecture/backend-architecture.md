# Backend Architecture - NEXORA

## Stack
- **Framework**: Laravel 11+
- **Language**: PHP 8.3+
- **Database**: MySQL 8.0+
- **API**: RESTful JSON API
- **Authentication**: Laravel Sanctum (SPA + Token)
- **Validation**: Form Requests + PHP Attributes
- **Authorization**: Policies + Gates
- **Testing**: Pest PHP
- **Code Style**: Laravel Pint (PSR-12)
- **Static Analysis**: PHPStan Level 5+
- **Documentation**: Scribe (auto-generated from code)

## Project Structure
```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/           # API Controllers (resource-based)
│   │   │       ├── AuthController.php
│   │   │       ├── TransactionController.php
│   │   │       ├── AnalyticsController.php
│   │   │       ├── GoalController.php
│   │   │       ├── TaskController.php
│   │   │       ├── NotificationController.php
│   │   │       └── UserController.php
│   │   ├── Middleware/        # Custom middleware
│   │   │   ├── EnsureUserIsVerified.php
│   │   │   ├── SanitizeInput.php
│   │   │   └── ApiVersion.php
│   │   ├── Requests/
│   │   │   └── Api/           # Form Requests per resource/action
│   │   │       ├── StoreTransactionRequest.php
│   │   │       ├── UpdateTransactionRequest.php
│   │   │       ├── StoreGoalRequest.php
│   │   │       └── ...
│   │   └── Resources/         # API Resources (transformers)
│   │       ├── TransactionResource.php
│   │       ├── GoalResource.php
│   │       ├── TaskResource.php
│   │       ├── NotificationResource.php
│   │       └── UserResource.php
│   ├── Models/                # Eloquent Models
│   │   ├── User.php
│   │   ├── Transaction.php
│   │   ├── Category.php
│   │   ├── Account.php
│   │   ├── Goal.php
│   │   ├── Task.php
│   │   ├── Notification.php
│   │   └── Attachment.php
│   ├── Services/              # Business logic services
│   │   ├── TransactionService.php
│   │   ├── AnalyticsService.php
│   │   ├── GoalService.php
│   │   ├── TaskService.php
│   │   ├── NotificationService.php
│   │   └── FileStorageService.php
│   ├── Actions/               # Single-responsibility actions (invokable classes)
│   │   ├── Transactions/
│   │   │   ├── CreateTransaction.php
│   │   │   ├── UpdateTransaction.php
│   │   │   ├── DeleteTransaction.php
│   │   │   └── BulkImportTransactions.php
│   │   ├── Goals/
│   │   │   ├── CreateGoal.php
│   │   │   ├── UpdateGoalProgress.php
│   │   │   └── CompleteGoal.php
│   │   └── ...
│   ├── Events/                # Domain events
│   │   ├── TransactionCreated.php
│   │   ├── GoalCompleted.php
│   │   ├── TaskOverdue.php
│   │   └── ...
│   ├── Listeners/             # Event listeners
│   │   ├── SendTransactionNotification.php
│   │   ├── UpdateGoalProgress.php
│   │   └── ...
│   ├── Policies/              # Authorization policies
│   │   ├── TransactionPolicy.php
│   │   ├── GoalPolicy.php
│   │   ├── TaskPolicy.php
│   │   └── NotificationPolicy.php
│   ├── Rules/                 # Custom validation rules
│   │   ├── UniqueTransactionPerDate.php
│   │   ├── ValidCurrencyCode.php
│   │   └── ...
│   ├── Enums/                 # PHP 8.1+ Enums
│   │   ├── TransactionType.php
│   │   ├── TransactionStatus.php
│   │   ├── GoalStatus.php
│   │   ├── TaskPriority.php
│   │   └── NotificationType.php
│   ├── Traits/                # Reusable traits
│   │   ├── HasUuid.php
│   │   ├── BelongsToUser.php
│   │   └── ...
│   └── Exceptions/            # Custom exceptions
│       ├── InsufficientFundsException.php
│       ├── GoalNotAchievableException.php
│       └── ...
├── bootstrap/
├── config/
│   ├── api.php                # API configuration
│   ├── sanctum.php
│   ├── cors.php
│   └── ...
├── database/
│   ├── migrations/            # Database migrations
│   ├── seeders/               # Database seeders
│   │   ├── DatabaseSeeder.php
│   │   ├── CategorySeeder.php
│   │   └── UserSeeder.php
│   └── factories/             # Model factories
│       ├── UserFactory.php
│       ├── TransactionFactory.php
│       └── ...
├── routes/
│   ├── api.php                # API routes
│   ├── web.php                # Web routes (minimal)
│   └── auth.php               # Auth routes
├── tests/
│   ├── Feature/               # Feature tests (API endpoints)
│   │   ├── Auth/
│   │   ├── Transactions/
│   │   ├── Analytics/
│   │   ├── Goals/
│   │   ├── Tasks/
│   │   └── Notifications/
│   └── Unit/                  # Unit tests (services, actions, models)
│       ├── Services/
│       ├── Actions/
│       └── Models/
├── storage/
├── .env.example
├── composer.json
├── phpstan.neon
├── pint.json
├── pest.php
└── README.md
```

## API Architecture

### REST Conventions
- Resource-based URLs: `/api/v1/transactions`, `/api/v1/goals`
- HTTP verbs: GET (list/show), POST (create), PUT/PATCH (update), DELETE (destroy)
- Nested resources: `/api/v1/goals/{goal}/progress`, `/api/v1/transactions/{transaction}/attachments`
- Versioning: URL prefix `/api/v1/`

### Response Format
```json
// Success (single)
{
  "data": { ... },
  "meta": { }
}

// Success (collection)
{
  "data": [ ... ],
  "meta": {
    "pagination": { "current_page": 1, "per_page": 20, "total": 100, "last_page": 5 },
    "filters": { }
  }
}

// Error
{
  "message": "Validation failed",
  "errors": {
    "field": ["Error message"]
  },
  "status": 422
}
```

### API Modules

#### Auth Module
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/login` - Login (returns token)
- `POST /api/v1/auth/logout` - Logout (revoke token)
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `GET /api/v1/auth/user` - Get authenticated user
- `POST /api/v1/auth/verify-email` - Send verification email
- `GET /api/v1/auth/verify-email/{id}/{hash}` - Verify email

#### Transactions Module
- `GET /api/v1/transactions` - List (with filters, pagination, sorting)
- `POST /api/v1/transactions` - Create
- `GET /api/v1/transactions/{id}` - Show
- `PUT/PATCH /api/v1/transactions/{id}` - Update
- `DELETE /api/v1/transactions/{id}` - Delete
- `POST /api/v1/transactions/bulk` - Bulk create
- `GET /api/v1/transactions/summary` - Summary stats (income, expense, balance)
- `GET /api/v1/transactions/export` - Export (CSV, PDF)

#### Categories Module
- `GET /api/v1/categories` - List (income/expense)
- `POST /api/v1/categories` - Create custom category
- `PUT/PATCH /api/v1/categories/{id}` - Update custom category
- `DELETE /api/v1/categories/{id}` - Delete custom category

#### Accounts Module
- `GET /api/v1/accounts` - List user accounts
- `POST /api/v1/accounts` - Create account
- `GET /api/v1/accounts/{id}` - Show
- `PUT/PATCH /api/v1/accounts/{id}` - Update
- `DELETE /api/v1/accounts/{id}` - Delete
- `GET /api/v1/accounts/{id}/balance` - Current balance

#### Analytics Module
- `GET /api/v1/analytics/overview` - Dashboard overview
- `GET /api/v1/analytics/spending-by-category` - Spending breakdown
- `GET /api/v1/analytics/income-vs-expense` - Monthly comparison
- `GET /api/v1/analytics/cash-flow` - Cash flow over time
- `GET /api/v1/analytics/net-worth` - Net worth trend
- `GET /api/v1/analytics/forecast` - Simple forecasting

#### Goals Module
- `GET /api/v1/goals` - List
- `POST /api/v1/goals` - Create
- `GET /api/v1/goals/{id}` - Show
- `PUT/PATCH /api/v1/goals/{id}` - Update
- `DELETE /api/v1/goals/{id}` - Delete
- `POST /api/v1/goals/{id}/contribute` - Add contribution
- `GET /api/v1/goals/{id}/progress` - Progress details

#### Tasks Module
- `GET /api/v1/tasks` - List (with filters: status, priority, due date)
- `POST /api/v1/tasks` - Create
- `GET /api/v1/tasks/{id}` - Show
- `PUT/PATCH /api/v1/tasks/{id}` - Update
- `DELETE /api/v1/tasks/{id}` - Delete
- `PATCH /api/v1/tasks/{id}/complete` - Toggle completion
- `POST /api/v1/tasks/bulk-update` - Bulk update

#### Notifications Module
- `GET /api/v1/notifications` - List (paginated, filter by read/unread)
- `PATCH /api/v1/notifications/{id}/read` - Mark as read
- `PATCH /api/v1/notifications/read-all` - Mark all as read
- `DELETE /api/v1/notifications/{id}` - Delete
- `GET /api/v1/notifications/unread-count` - Unread count

#### User/Settings Module
- `GET /api/v1/user/profile` - Get profile
- `PUT/PATCH /api/v1/user/profile` - Update profile
- `PUT/PATCH /api/v1/user/password` - Change password
- `PUT/PATCH /api/v1/user/preferences` - Update preferences (theme, currency, locale, notifications)
- `DELETE /api/v1/user/account` - Delete account
- `GET /api/v1/user/export` - Export all data (GDPR)

## Database Architecture

### Core Entities

#### users
- id (ULID/UUID)
- name
- email (unique)
- email_verified_at
- password (hashed)
- avatar_url
- locale (default: en)
- currency (default: USD, ISO 4217)
- theme (light|dark|system)
- timezone
- two_factor_enabled
- two_factor_secret
- deleted_at (soft delete)
- timestamps

#### accounts
- id (ULID/UUID)
- user_id (FK → users)
- name
- type (checking, savings, credit, investment, cash, crypto, other)
- currency (ISO 4217)
- balance (decimal 15,2)
- initial_balance (decimal 15,2)
- institution
- account_number_masked
- is_default
- is_active
- sort_order
- deleted_at
- timestamps

#### categories
- id (ULID/UUID)
- user_id (FK → users, nullable for system categories)
- name
- type (income, expense)
- icon (Lucide icon name)
- color (hex)
- parent_id (FK → categories, nullable for subcategories)
- is_system (boolean)
- is_active
- sort_order
- deleted_at
- timestamps

#### transactions
- id (ULID/UUID)
- user_id (FK → users)
- account_id (FK → accounts)
- category_id (FK → categories, nullable)
- type (income, expense, transfer)
- amount (decimal 15,2)
- currency (ISO 4217)
- exchange_rate (decimal 10,6, default 1)
- description
- notes
- transaction_date (date)
- status (pending, cleared, reconciled)
- is_recurring
- recurring_rule_id (FK → recurring_rules, nullable)
- transfer_account_id (FK → accounts, nullable for transfers)
- metadata (JSON)
- deleted_at
- timestamps

#### recurring_rules
- id (ULID/UUID)
- user_id (FK → users)
- frequency (daily, weekly, monthly, yearly)
- interval (int)
- day_of_week (0-6, for weekly)
- day_of_month (1-31, for monthly)
- end_date (nullable)
- next_occurrence_date
- is_active
- template_data (JSON - transaction template)
- timestamps

#### goals
- id (ULID/UUID)
- user_id (FK → users)
- account_id (FK → accounts, nullable)
- name
- description
- target_amount (decimal 15,2)
- current_amount (decimal 15,2, default 0)
- currency (ISO 4217)
- start_date
- target_date
- status (active, completed, paused, cancelled)
- priority (low, medium, high)
- auto_contribute (boolean)
- contribution_amount (decimal 15,2, nullable)
- contribution_frequency (monthly, quarterly, yearly, nullable)
- metadata (JSON)
- deleted_at
- timestamps

#### tasks
- id (ULID/UUID)
- user_id (FK → users)
- goal_id (FK → goals, nullable)
- title
- description
- status (pending, in_progress, completed, cancelled)
- priority (low, medium, high, urgent)
- due_date (nullable)
- completed_at (nullable)
- recurring_rule_id (FK → recurring_rules, nullable)
- sort_order
- deleted_at
- timestamps

#### notifications
- id (ULID/UUID)
- user_id (FK → users)
- type (transaction_created, goal_progress, goal_completed, task_due, task_overdue, budget_alert, system, security)
- title
- message
- data (JSON - action URL, related entity IDs)
- read_at (nullable)
- archived_at (nullable)
- timestamps

#### attachments
- id (ULID/UUID)
- user_id (FK → users)
- attachable_type (Transaction, Goal, Task)
- attachable_id (ULID/UUID)
- file_name
- file_path
- mime_type
- file_size
- timestamps

### Indexes
- transactions: (user_id, transaction_date), (user_id, account_id), (user_id, category_id), (user_id, status)
- goals: (user_id, status), (user_id, target_date)
- tasks: (user_id, status), (user_id, due_date), (user_id, goal_id)
- notifications: (user_id, read_at), (user_id, created_at)
- categories: (user_id, type), (parent_id)

## Authentication Flow (Laravel Sanctum)

### SPA Authentication (Frontend on same domain/subdomain)
1. Frontend calls `GET /sanctum/csrf-cookie` to set CSRF cookie
2. Frontend calls `POST /api/v1/auth/login` with email/password
3. Laravel validates, creates token, sets `laravel_session` cookie
4. Subsequent requests include session cookie automatically
5. Logout: `POST /api/v1/auth/logout` revokes token, clears cookie

### Token Authentication (Mobile/Third-party)
1. User generates API token via settings page
2. Token stored as `personal_access_tokens`
3. Requests include `Authorization: Bearer {token}` header
4. Token scopes: `transactions:read`, `transactions:write`, `goals:read`, etc.

### Password Reset Flow
1. `POST /api/v1/auth/forgot-password` with email
2. Laravel sends reset link to email (signed URL)
3. User clicks link → frontend `GET /reset-password/{token}/{email}`
4. Frontend calls `POST /api/v1/auth/reset-password` with token, email, password, password_confirmation

### Email Verification
1. Register → user gets `email_verified_at = null`
2. `POST /api/v1/auth/verify-email` sends verification email
3. User clicks link → `GET /api/v1/auth/verify-email/{id}/{hash}`
4. Laravel marks `email_verified_at`, redirects to frontend

## Authorization (Policies)
- Each model has a Policy: `TransactionPolicy`, `GoalPolicy`, etc.
- Policies define: `viewAny`, `view`, `create`, `update`, `delete`, `restore`, `forceDelete`
- Controllers use `$this->authorize('action', $model)` or `$request->authorize()`
- Gates for cross-cutting: `manage-settings`, `view-analytics`, `export-data`

## Validation Strategy
- Form Requests per action: `StoreTransactionRequest`, `UpdateTransactionRequest`
- Custom Rules for complex validation: `ValidCurrencyCode`, `UniqueTransactionPerDate`
- Validation messages in `lang/en/validation.php`
- API returns 422 with structured errors

## Error Handling
- Custom Exception Handler (`app/Exceptions/Handler.php`)
- API exceptions return JSON with consistent format
- Logging: critical errors to `daily` channel, debug to `stack`
- Sentry integration for production error tracking

## Security Requirements
- HTTPS only in production
- CSRF protection via Sanctum (same-site cookies)
- Rate limiting: `api` middleware (60/min), `auth` middleware (5/min for login)
- Password hashing: bcrypt (default)
- SQL injection prevention: Eloquent ORM, parameter binding
- XSS prevention: API returns JSON, frontend sanitizes
- CORS configured for frontend domain only
- Security headers via middleware: CSP, HSTS, X-Frame-Options
- Input sanitization middleware
- File upload validation (type, size, malware scan)

## Testing Strategy
- Unit: Pest PHP (services, actions, models, policies, rules)
- Feature: Pest PHP (API endpoints, auth flows, authorization)
- Database: RefreshDatabase trait, SQLite in memory for CI
- Factories for all models
- Coverage target: > 85%
- Static analysis: PHPStan Level 5+
- Code style: Laravel Pint (PSR-12)

## Environment Variables
```env
APP_NAME=NEXORA
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_FRONTEND_URL=http://localhost:5173

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nexora
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost

MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@nexora.app"
MAIL_FROM_NAME="${APP_NAME}"

# Optional: Sentry, Redis, Meilisearch, etc.
```

## Performance Requirements
- Query optimization: eager loading, select columns, indexes
- Caching: Redis for analytics, user preferences
- Pagination: cursor-based for large datasets
- Database: read replicas for analytics queries
- Response compression: gzip/brotli
- API response time: < 200ms p95