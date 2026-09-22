# AGENTS.md - NEXORA

## Project Overview
**NEXORA** - Personal finance & productivity SaaS (early development). React/TypeScript frontend + Laravel/PHP/MySQL backend.

**Stack**: React 19, TypeScript, Vite, Tailwind CSS v4 | Laravel 12, PHP 8.3, MySQL, Pest PHP

**Architecture**: Monorepo (`frontend/`, `backend/`). SPA + REST API.

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

# Lint (oxlint)
npm run lint
```

### Backend (from `backend/`)
```bash
# Install
composer install

# Dev server (includes Vite for assets)
composer run dev

# Run migrations
php artisan migrate

# Fresh migrate + seed
php artisan migrate:fresh --seed

# Lint (Pint)
./vendor/bin/pint

# Test (Pest)
./vendor/bin/pest
# or
composer run test
```

### Monorepo (from root)
```bash
# Install all deps
npm install && cd backend && composer install

# Start both dev servers
# Terminal 1: cd frontend && npm run dev
# Terminal 2: cd backend && composer run dev
```

## Project Structure (Actual)
```
nexora/
├── frontend/                 # React + Vite + TypeScript
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── main.tsx          # Entry point
│   │   ├── App.tsx           # Root component
│   │   ├── App.css           # Component styles
│   │   └── index.css         # Global styles + Tailwind
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .oxlintrc.json
│
├── backend/                  # Laravel 12 + PHP 8.3
│   ├── app/
│   │   ├── Http/Controllers/Controller.php
│   │   ├── Models/User.php
│   │   └── Providers/AppServiceProvider.php
│   ├── database/
│   │   ├── migrations/       # users, cache, jobs tables
│   │   ├── factories/UserFactory.php
│   │   └── seeders/DatabaseSeeder.php
│   ├── routes/
│   │   ├── web.php
│   │   └── console.php
│   ├── tests/
│   │   ├── Feature/ExampleTest.php
│   │   ├── Unit/ExampleTest.php
│   │   └── TestCase.php
│   ├── config/
│   ├── composer.json
│   └── package.json          # Vite for asset bundling
│
└── AGENTS.md
```

## Current State Notes
- Frontend: Minimal React 19 + TypeScript + Tailwind v4 setup. No shadcn/ui, React Query, Zustand, or routing yet.
- Backend: Fresh Laravel 12 install with default User model, auth scaffolding not yet configured.
- No API routes, no Sanctum, no custom domain logic implemented.
- Testing: Pest PHP configured, Vitest not yet set up in frontend.

## Key Files to Know
- `frontend/vite.config.ts` - Vite config with React + Tailwind
- `frontend/src/index.css` - Tailwind v4 import (`@import "tailwindcss"`)
- `backend/composer.json` - Laravel dependencies, Pest, Pint scripts
- `backend/routes/web.php` - Web routes (SPA entry point)

## Next Steps for Development
1. Set up Laravel Sanctum for SPA auth
2. Configure API routes (`routes/api.php`)
3. Add React Router, React Query, Zustand to frontend
4. Set up Vitest + React Testing Library
5. Add shadcn/ui components
6. Create database migrations for finance domain (transactions, accounts, categories, etc.)

## Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_URL=http://localhost:5173
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
```

**Never commit** `.env`, `.env.local`, `.env.*.local`