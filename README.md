# NEXORA

Personal finance & productivity SaaS for managing money, goals, and tasks.

## Overview

NEXORA is a full-stack personal finance application featuring authenticated dashboard analytics, transaction tracking, financial goal management, and task productivity. Users can register/login via Laravel Sanctum, add income/expense transactions with categories, set savings targets with progress tracking, and manage daily tasks with priorities and due dates. The responsive landing page includes features, pricing, and about sections.

Core capabilities:
- **Authentication**: Laravel Sanctum with session cookies and CSRF protection
- **Dashboard**: Financial summary with income/expenses breakdown
- **Transactions**: CRUD operations with category selection and type filtering
- **Financial Goals**: Target tracking with current/vs target amounts and deadlines
- **Tasks**: Create, complete, prioritize, and track due dates

## Features

- Laravel Sanctum authentication
- Dashboard financial summary
- Transaction CRUD (income/expense)
- Income/expense categories
- Financial goals CRUD + progress tracking
- Task CRUD + priority/status/due dates
- Responsive landing page
- Pricing/demo landing sections
- Demo seed data for quick setup

## Tech Stack

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS
- Base UI components

**Backend:**
- Laravel
- Sanctum (session auth, CSRF)
- MySQL
- Pest (63 tests, 170 assertions)

## Architecture

React/Vite SPA → REST API → Laravel → MySQL

## Screens

- **Landing**: Features, Pricing, About with anchor navigation
- **Dashboard**: Financial summary, quick stats
- **Transactions**: List, create, edit, delete with category filtering
- **Financial Goals**: Create targets, track progress, deadlines
- **Tasks**: Create, complete, prioritize, due dates

## Local Development

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

## Demo Data

```bash
cd backend
php artisan db:seed --class=DemoSeeder
```

**Demo account:**
- Email: `demo@nexora.local`
- Password: `password123`
- *Development / Demo only — do not use for production.*

**Seeded data:**
- 1 demo user
- 7 categories (2 income, 5 expense)
- 11 transactions (Indonesian Rupiah, recent dates)
- 3 financial goals (Emergency Fund, New Laptop, Investment Fund)
- 5 tasks (pending/completed, low/medium/high priority)

## Testing

```bash
# Frontend
cd frontend
npx tsc --noEmit
npm run build
npm run lint

# Backend
cd backend
php artisan test
```

63 tests / 170 assertions.

## Deployment

```bash
# Frontend
cd frontend
npm ci
npm run build
# Deploy dist/ as static assets

# Backend
cd backend
composer install --no-dev --optimize-autoloader
php artisan key:generate --force
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Environment variables from `backend/.env.example` are required:
- `VITE_API_URL` — API base URL
- `SESSION_SECURE_COOKIE=true` — production HTTPS
- `CORS_ALLOWED_ORIGINS` — allowed frontend domains
- `SANCTUM_STATEFUL_DOMAINS` — Sanctum stateful domains
- `APP_DEBUG=false`

Health check: `GET /api/health` → `{ status: "ok", application: "NEXORA API" }`

## Security Notes

- Sanctum session-based authentication
- CSRF protection via X-XSRF-TOKEN
- Ownership authorization on all user resources
- Form request validation on all API inputs
- Secure production cookies (`SESSION_SECURE_COOKIE=true`)
- No secrets committed to source

## Project Status

Portfolio-ready MVP

- Core features complete
- Automated tests passing (63/63)
- Deployment-ready configuration prepared