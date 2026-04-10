# Agender Backend (Laravel 11)

API RESTful para gerenciamento pessoal de calendario e financas.

## Stack

- PHP 8.2+
- Laravel 11
- MySQL
- Laravel Sanctum (autenticacao por token)

## Recursos implementados

- Autenticacao: cadastro, login, logout e perfil (`/api/auth/*`)
- Eventos: CRUD completo (`/api/events`)
- Transacoes: CRUD completo com recorrencia (`/api/transactions`)
- Categorias: CRUD completo (`/api/categories`)
- Dashboard (`/api/dashboard`): saldo atual, proximos eventos e dados para graficos
- Jobs agendados:
	- `GenerateRecurringTransactions` para gerar lancamentos recorrentes
	- `SendUpcomingReminders` para enviar e-mails de lembrete

## Modelagem

Migrations criadas para:

- `users`
- `events`
- `transactions`
- `categories`
- `recurring_rules`
- `personal_access_tokens`

Com chaves estrangeiras, indices e relacionamentos Eloquent.

## Como rodar localmente

1. Instale dependencias:

```bash
composer install
```

2. Configure ambiente:

```bash
cp .env.example .env
php artisan key:generate
```

3. Ajuste credenciais MySQL no `.env`:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=agender
DB_USERNAME=root
DB_PASSWORD=
```

4. Rode migrations e seeders:

```bash
php artisan migrate --seed
```

5. Suba a API:

```bash
php artisan serve
```

API em `http://127.0.0.1:8000/api`.

## Fila e agendamento (recorrencia e lembretes)

Em outro terminal, execute o worker de fila:

```bash
php artisan queue:work
```

Para processar jobs agendados em ambiente local:

```bash
php artisan schedule:work
```

## Usuario de exemplo (seeder)

- Email: `julia@example.com`
- Senha: `password123`

