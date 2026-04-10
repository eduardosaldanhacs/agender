# Agender

Aplicacao full-stack para gerenciamento pessoal de calendario e financas.

## Estrutura

- `backend/`: API RESTful em Laravel 11 (PHP 8+, MySQL, Sanctum)
- `frontend/`: SPA em React 18 + Vite + Tailwind

## Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

API: `http://127.0.0.1:8000/api`

Para jobs (recorrencia e lembretes):

```bash
php artisan queue:work
php artisan schedule:work
```

## Frontend (React)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App: `http://127.0.0.1:5173`
