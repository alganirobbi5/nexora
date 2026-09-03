# AGENTS.md - NEXORA

## Project Overview
**NEXORA** - Portfolio-grade personal finance & productivity SaaS. Modern React/TypeScript frontend + Laravel/PHP/MySQL backend. Demonstrates professional full-stack skills: auth, REST API, database design, responsive UI/UX, testing, deployment.

**Stack**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, 21st.dev, Lucide, Framer Motion | Laravel 11, PHP 8.3, MySQL 8, Sanctum, Pest PHP

**Architecture**: Monorepo (`frontend/`, `backend/`, `docs/`). SPA + REST API. Server-state via React Query, client-state via Zustand. ULID primary keys. Soft deletes.

## Developer Commands

### Frontend (from `frontend/`)
```bash
# Install
npm install

# Dev server (with HMR)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Typecheck
npm run typecheck

# Test (unit + integration)
npm test

# Test single file
npm test -- src/components/ui/button.test.tsx

# Test with coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# Storybook
npm run storybook
```

### Backend (from `backend/`)
```bash
# Install
composer install

# Dev server
php artisan serve

# Run migrations
php artisan migrate

# Fresh migrate + seed
php artisan migrate:fresh --seed

# Lint (Pint)
./vendor/bin/pint

# Static analysis (PHPStan)
./vendor/bin/phpstan analyse

# Test (Pest)
./vendor/bin/pest

# Test with coverage
./vendor/bin/pest --coverage

# Generate API docs (Scribe)
php artisan scribe:generate

# Queue worker (for recurring tasks)
php artisan queue:work

# Scheduler (for recurring transactions)
php artisan schedule:work
```

### Monorepo (from root)
```bash
# Install all deps
npm install && cd backend && composer install

# Start both dev servers
# Terminal 1: cd frontend && npm run dev
# Terminal 2: cd backend && php artisan serve

# Full test suite
cd frontend && npm test && cd ../backend && ./vendor/bin/pest
```

## Project Structure
```
nexora/
├── frontend/                 # React + Vite + TypeScript
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # shadcn/ui base components
│   │   │   ├── layout/       # AppShell, Header, Sidebar, Container
│   │   │   ├── forms/        # FormField, CurrencyInput, DateRangePicker
│   │   │   ├── data-display/ # StatCard, TransactionRow, Charts, Tables
│   │   │   ├── feedback/     # Toast, Modal, Alert, Skeleton, Spinner
│   │   │   └── navigation/   # NavItem, Breadcrumbs, Tabs, UserMenu
│   │   ├── hooks/
│   │   │   ├── queries/      # React Query hooks (useTransactions, etc.)
│   │   │   ├── mutations/    # React Query mutations
│   │   │   ├── ui/           # useTheme, useMediaQuery, useDisclosure
│   │   │   └── form/         # useFormValidation, useArrayField
│   │   ├── stores/           # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   ├── uiStore.ts
│   │   │   ├── themeStore.ts
│   │   │   └── notificationStore.ts
│   │   ├── types/            # TypeScript types
│   │   │   ├── api.ts
│   │   │   ├── entities.ts
│   │   │   ├── forms.ts
│   │   │   └── ui.ts
│   │   ├── utils/            # formatters, validators, helpers, constants
│   │   ├── config/           # api, queryClient, theme
│   │   ├── styles/           # globals.css, animations.css
│   │   ├── pages/            # Route-level components
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── transactions/
│   │   │   ├── analytics/
│   │   │   ├── goals/
│   │   │   ├── tasks/
│   │   │   ├── notifications/
│   │   │   ├── settings/
│   │   │   └── landing/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tests/                # unit/, integration/, e2e/
│   ├── .eslintrc.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                  # Laravel 11 + PHP 8.3
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/      # Resource controllers
│   │   │   ├── Middleware/
│   │   │   ├── Requests/Api/         # Form requests
│   │   │   └── Resources/            # API Resources
│   │   ├── Models/                   # Eloquent models
│   │   ├── Services/                 # Business logic
│   │   ├── Actions/                  # Single-responsibility invokable classes
│   │   ├── Events/Listeners/         # Domain events
│   │   ├── Policies/                 # Authorization
│   │   ├── Rules/                    # Custom validation rules
│   │   ├── Enums/                    # PHP 8.1+ enums
│   │   └── Traits/                   # HasUuid, BelongsToUser
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── factories/
│   ├── routes/
│   │   ├── api.php
│   │   └── auth.php
│   ├── tests/
│   │   ├── Feature/                  # API endpoint tests
│   │   └── Unit/                     # Service/action/model tests
│   ├── config/
│   ├── .env.example
│   ├── composer.json
│   ├── phpstan.neon
│   └── pint.json
│
├── docs/
│   ├── architecture/           # Architecture decision records
│   ├── api/                    # API documentation
│   ├── components/             # Component docs
│   ├── guides/                 # How-to guides
│   └── decisions/              # ADRs
│
├── .gitignore
├── .github/workflows/          # CI/CD
└── README.md
```

## Coding Rules

### General
- **TypeScript strict mode**: No `any`, explicit return types for public APIs
- **PHP strict types**: `declare(strict_types=1)` on all files
- **No console.log** in production code (use `logger` utility)
- **No debug code** in commits (dd, dump, ray, console.log)
- **Early returns** over nested conditionals
- **Single responsibility**: Functions < 30 lines, classes < 200 lines

### Frontend Specific
- **Components**: Functional components with TypeScript interfaces
- **Props**: Destructure with defaults, use `ComponentPropsWithoutRef` for forwarding
- **Hooks**: Prefix with `use`, return typed values
- **Stores**: Zustand with Immer middleware for mutations
- **Queries**: React Query with typed query keys (`['transactions', filters]`)
- **Forms**: React Hook Form + Zod schemas (shared with backend via API docs)
- **Styles**: Tailwind utility classes, CSS variables for theming
- **Icons**: Lucide React, size via `className="w-5 h-5"` (20px default)

### Backend Specific
- **Controllers**: Thin, delegate to Actions/Services
- **Actions**: Invokable classes (`__invoke`), single responsibility
- **Services**: Stateless, injected via container
- **Requests**: Form Requests for all validation
- **Resources**: API Resources for all responses (no raw model returns)
- **Policies**: Register in `AuthServiceProvider`, use `$this->authorize()`
- **Enums**: Backed enums for database values
- **Database**: Migrations for all schema changes, no raw SQL in controllers

## Naming Conventions

| Category | Convention | Example |
|----------|------------|---------|
| Files (React) | PascalCase | `TransactionCard.tsx`, `useTransactions.ts` |
| Files (Laravel) | PascalCase | `TransactionController.php`, `StoreTransactionRequest.php` |
| Components | PascalCase | `TransactionCard`, `StatCard` |
| Hooks | camelCase + `use` | `useTransactions`, `useTheme` |
| Stores | PascalCase + `Store` | `authStore`, `themeStore` |
| Types/Interfaces | PascalCase | `Transaction`, `ApiResponse` |
| Enums (TS) | PascalCase | `TransactionType` |
| Enums (PHP) | PascalCase | `TransactionType` |
| Variables/Functions | camelCase | `getTransactions`, `formatCurrency` |
| Constants | UPPER_SNAKE_CASE | `DEFAULT_PAGE_SIZE`, `API_BASE_URL` |
| CSS Classes | kebab-case | `.stat-card`, `.transaction-row` |
| Database Tables | snake_case plural | `transactions`, `recurring_rules` |
| Database Columns | snake_case | `transaction_date`, `user_id` |
| API Endpoints | kebab-case plural | `/api/v1/transactions` |
| Query Keys | array with objects | `['transactions', { page: 1 }]` |
| Git Branches | `type/scope-description` | `feat/transactions-bulk-import` |
| Commits | `type(scope): description` | `feat(transactions): add bulk import` |

## Folder Conventions

### Frontend
- **Colocation**: Keep related files together (component + test + styles)
- **Barrel exports**: `index.ts` for public API of each folder
- **Path aliases**: `@/` = `src/`, `@components/` = `src/components/`, `@hooks/` = `src/hooks/`
- **Pages**: One folder per route, `index.tsx` = page component
- **Components**: Categorized by purpose (ui, layout, forms, data-display, feedback, navigation)

### Backend
- **Controllers**: Group by resource in `Api/` subfolder
- **Requests**: Mirror controller structure in `Requests/Api/`
- **Resources**: One per model, in `Http/Resources/`
- **Actions**: Group by domain in `Actions/{Domain}/`
- **Policies**: One per model, in `Policies/`
- **Tests**: Mirror app structure (`Feature/Transactions/`, `Unit/Services/`)

## Testing Rules

### Frontend (Vitest + React Testing Library)
- **Unit**: Test components, hooks, utils in isolation
- **Integration**: Test component interactions with MSW API mocking
- **E2E**: Playwright for critical flows (auth, CRUD, dashboard)
- **Coverage**: > 80% for business logic (stores, hooks, utils)
- **Naming**: `*.test.tsx` for components, `*.test.ts` for hooks/utils
- **Mocking**: MSW for API, `vi.mock()` for modules
- **Async**: Use `waitFor`, `findBy` queries

### Backend (Pest PHP)
- **Unit**: Test Services, Actions, Models, Policies, Rules
- **Feature**: Test API endpoints (full HTTP cycle)
- **Database**: `RefreshDatabase` trait, SQLite in memory for CI
- **Factories**: Define for all models, use in tests
- **Coverage**: > 85% overall
- **Naming**: `*Test.php` suffix
- **Helpers**: Custom Pest expectations for API responses

### General
- **Test behavior, not implementation**
- **One assertion per test** (when practical)
- **Descriptive test names**: `it('returns 422 when amount is negative')`
- **Arrange-Act-Assert** structure
- **No flaky tests** - fix or delete

## Git Rules

### Branching
- `main` - Production, protected
- `develop` - Integration, protected
- `feature/*`, `fix/*`, `hotfix/*`, `release/*`, `chore/*`, `docs/*`, `refactor/*`, `perf/*`, `test/*`

### Commits
- **Conventional Commits** format mandatory
- **Atomic commits**: One logical change per commit
- **Sign commits**: `git commit -S` (GPG/SSH)
- **No secrets**: Pre-commit hook scans with gitleaks

### Pull Requests
- **Title**: Conventional commit format
- **Description**: Template with summary, testing, checklist
- **Reviews**: 1 approval minimum
- **Checks**: All CI must pass (lint, typecheck, test, build)
- **Merge**: Squash and merge (feature/fix), rebase and merge (hotfix/release)

### Workflow
```bash
# Feature
git checkout develop && git pull
git checkout -b feature/scope-description
# ... work ...
git add . && git commit -S -m "feat(scope): description"
git push origin feature/scope-description
# Create PR to develop

# Hotfix
git checkout main && git pull
git checkout -b hotfix/scope-description
# ... work ...
git add . && git commit -S -m "fix(scope): description"
git push origin hotfix/scope-description
# Create PR to main, then main → develop
```

## UI/UX Rules

### Design Principles
- **Clarity over cleverness** - Obvious beats clever
- **Consistency builds trust** - Same patterns, same behaviors
- **Accessible by default** - WCAG 2.1 AA, not afterthought
- **Motion with purpose** - Animation communicates state
- **Data density with breathing room** - Rich but not cluttered

### Visual Standards
- **Color**: Semantic CSS variables (see `docs/architecture/design-system.md`)
- **Typography**: Inter (UI), JetBrains Mono (code), Cal Sans (display)
- **Spacing**: 4px base unit, Tailwind scale
- **Radius**: 4px (sm), 8px (default), 12px (md), 16px (lg)
- **Shadows**: Layered (xs → xl), focus ring = brand-600
- **Dark mode**: CSS variables + `data-theme` attribute

### Component Rules
- **Base**: shadcn/ui components in `src/components/ui/`
- **Composite**: Build domain components from base (e.g., `TransactionCard` = Card + Badge + Text)
- **Variants**: Use CVA (Class Variance Authority) for component variants
- **Accessibility**: ARIA labels, focus management, keyboard navigation, color contrast
- **Responsive**: Mobile-first, breakpoints at 640/768/1024/1280/1536
- **Reduced motion**: Respect `prefers-reduced-motion`

### 21st.dev Integration
1. **Curate, don't copy blindly** - Only use components matching design system
2. **Wrap in adapters** - Create `src/components/ui/[name].tsx` wrapping 21st.dev component
3. **Theme alignment** - Use our CSS variables (colors, spacing, radius)
4. **TypeScript first** - Proper types for all adapted components
5. **Accessibility check** - Verify ARIA, keyboard nav before use
6. **Bundle awareness** - Tree-shake, avoid heavy components for simple needs
7. **Document** - Each adapted component documented in `docs/components/`

### Forbidden Patterns
- ❌ Excessive gradients
- ❌ Excessive glassmorphism
- ❌ Visual clutter
- ❌ Generic admin dashboard aesthetics
- ❌ Hardcoded colors (use semantic tokens)
- ❌ Inline styles (except dynamic values)
- ❌ `!important` in CSS

## Security Rules

### Frontend
- **No secrets in code** - Use `.env` (never committed)
- **Sanitize user input** - DOMPurify for any HTML rendering
- **CSP headers** - Configure via meta tags + server headers
- **HTTPS only** in production
- **Secure cookies** - `Secure`, `SameSite=Lax` (Sanctum handles)

### Backend
- **Validation**: Form Requests on all input
- **Authorization**: Policies on all controller actions
- **Rate limiting**: `api` (60/min), `auth` (5/min login)
- **CSRF**: Sanctum handles for SPA
- **SQL Injection**: Eloquent only, parameter binding
- **XSS**: API returns JSON, frontend sanitizes
- **CORS**: Configured for frontend domain only
- **Headers**: CSP, HSTS, X-Frame-Options via middleware
- **File uploads**: Validate type, size, scan for malware
- **Passwords**: bcrypt (Laravel default)
- **Secrets**: Environment variables, GitHub Secrets for CI

### General
- **Audit dependencies**: `npm audit`, `composer audit` regularly
- **Rotate keys** periodically
- **Least privilege** database users
- **Log security events** (failed login, password change, 2FA)

## Environment Variables

### Frontend (`.env`, `.env.local`)
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_URL=http://localhost:5173
VITE_SENTRY_DSN=
```

### Backend (`.env`)
```env
APP_NAME=NEXORA
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_FRONTEND_URL=http://localhost:5173

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nexora
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost

MAIL_MAILER=log
MAIL_FROM_ADDRESS="hello@nexora.app"
```

**Never commit** `.env`, `.env.local`, `.env.*.local`, `*.pem`, `*.key`, `secrets.json`

## Documentation References
- **Architecture**: `docs/architecture/` (frontend, backend, database, design-system, git-workflow, implementation-roadmap)
- **API**: `docs/api/` (auto-generated from Scribe)
- **Components**: `docs/components/` + Storybook
- **Guides**: `docs/guides/` (setup, deployment, testing, accessibility)
- **Decisions**: `docs/decisions/` (ADRs)

## Instructions for Future OpenCode Agents

### When Starting Work
1. Read this AGENTS.md fully
2. Check relevant architecture doc in `docs/architecture/`
3. Check existing code patterns in `frontend/src/` or `backend/app/`
4. Run tests to verify current state

### When Adding Features
1. Create feature branch from `develop`
2. Follow naming conventions strictly
3. Write tests alongside implementation
4. Update documentation if architecture changes
5. Run full test suite before PR

### When Fixing Bugs
1. Write failing test first
2. Fix minimal code to pass
3. Verify no regressions
4. Consider edge cases

### Code Review Checklist
- [ ] Follows naming conventions
- [ ] TypeScript/PHP strict types
- [ ] Tests added/updated
- [ ] No console.log/debug code
- [ ] No secrets committed
- [ ] Accessibility considered
- [ ] Responsive design verified
- [ ] Performance acceptable
- [ ] Documentation updated

### Common Pitfalls to Avoid
- ❌ Skipping tests to save time
- ❌ Hardcoding values that should be config
- ❌ Mixing server/client state incorrectly
- ❌ Forgetting authorization checks
- ❌ Using `any` type in TypeScript
- ❌ Raw SQL in Laravel controllers
- ❌ Committing directly to main/develop
- ❌ Large PRs (> 400 lines changed)
- ❌ Incomplete error handling

## Quick Reference

### Key Files to Know
- `frontend/src/config/api.ts` - Axios instance, endpoints
- `frontend/src/stores/authStore.ts` - Auth state
- `frontend/src/hooks/queries/` - All React Query hooks
- `backend/app/Http/Controllers/Api/` - All API endpoints
- `backend/app/Actions/` - Business logic actions
- `backend/app/Services/` - Reusable services
- `backend/routes/api.php` - API route definitions
- `backend/database/migrations/` - Schema
- `docs/architecture/design-system.md` - Design tokens

### Common Commands
```bash
# Frontend typecheck
cd frontend && npx tsc --noEmit

# Backend static analysis
cd backend && ./vendor/bin/phpstan analyse

# Full lint
cd frontend && npm run lint && cd ../backend && ./vendor/bin/pint --test

# Generate migration
cd backend && php artisan make:migration create_xxx_table

# Generate model + migration + factory + seeder
cd backend && php artisan make:model Xxx -mfs

# Generate controller + requests + resource
cd backend && php artisan make:controller Api/XxxController --api --model=Xxx
```