# NEXORA

Personal finance & productivity SaaS.

## Deployment

### Architecture

- **Frontend**: React + Vite static production build (dist/)
- **Backend**: Laravel API with Sanctum authentication + MySQL/PostgreSQL
- **Database**: Managed MySQL or PostgreSQL

### Frontend Build

```bash
cd frontend
npm ci
npm run build
# Deploy dist/ as static assets to any host (Netlify, Vercel, etc.)
```

The frontend uses `VITE_API_URL` to configure the API base URL. Set this in your environment:

```
VITE_API_URL=https://api.yourdomain.com
```

### Backend Production Setup

```bash
cd backend
composer install --no-dev --optimize-autoloader
php artisan key:generate --force
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link
```

### Environment Variables

Create a `.env` file based on `backend/.env.example`. Required production variables:

```
APP_NAME=NEXORA
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nexora
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true
SESSION_DOMAIN=yourdomain.com

CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com,http://localhost:5173

VITE_API_URL=https://api.yourdomain.com
```

### Health Check

```
GET /api/health
 returns: { status: "ok", application: "NEXORA API" }
```

### HTTPS & Sanctum Note

- Set `SESSION_SECURE_COOKIE=true` in production
- Add production domains to `SANCTUM_STATEFUL_DOMAINS`
- Set `APP_DEBUG=false`
- Use HTTPS for the API base URL

## Demo Data

### How to Seed

```bash
cd backend
php artisan db:seed --class=DemoSeeder
```

### Demo Account

- **Email**: `demo@nexora.local`
- **Password**: `password123`
- **Warning**: Development / Demo only — do not use for production.

### Seeded Data

- 1 demo user
- 7 categories (2 income, 5 expense)
- 11 transactions (Indonesian Rupiah, recent dates)
- 3 financial goals (Emergency Fund, New Laptop, Investment Fund)
- 5 tasks (pending/completed, low/medium/high priority)