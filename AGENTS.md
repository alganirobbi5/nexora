# AGENTS.md - NEXORA

## Developer Commands

### Frontend (from `frontend/`)
```bash
npm install
npm run dev       # vite + HMR
npm run build     # tsc -b && vite build
npm run lint      # oxlint (not eslint)
npm run preview   # vite preview
```

### Backend (from `backend/`)
```bash
composer install
composer run dev  # php artisan dev (Laravel + Vite)
php artisan migrate # run migrations
./vendor/bin/pest   # run Pest tests
# or: composer run test  # clears config then runs php artisan test
```

### Monorepo (from root)
```bash
npm install && cd backend && composer install
# Terminal 1: cd frontend && npm run dev
# Terminal 2: cd backend && composer run dev
```

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_URL=http://localhost:5173
```

### Backend (.env)
```env
APP_NAME=NEXORA
APP_ENV=local
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

**Never commit `.env`, `.env.local`, `.env.*.local`**

## Key Files

- `frontend/vite.config.ts` - Vite + React + Tailwind config
- `frontend/src/index.css` - Tailwind v4 entry point
- `backend/composer.json` - Laravel deps, Pest, Pint scripts
- `backend/routes/web.php` - SPA entry route
- `backend/database/migrations/` - schema definitions