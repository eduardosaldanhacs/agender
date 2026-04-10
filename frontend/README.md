# Agender Frontend (React + Vite)

SPA para gerenciamento de calendario e financas pessoais, consumindo a API Laravel.

## Stack

- React 18 + Vite
- Tailwind CSS
- Axios
- React Router
- FullCalendar
- Chart.js + react-chartjs-2

## Paginas

- Login
- Cadastro
- Dashboard
- Calendario
- Transacoes
- Categorias

## Como rodar localmente

1. Instale dependencias:

```bash
npm install
```

2. Configure URL da API:

```bash
cp .env.example .env
```

Arquivo `.env`:

```dotenv
VITE_API_URL=http://127.0.0.1:8000/api
```

3. Rode o frontend:

```bash
npm run dev
```

Frontend em `http://127.0.0.1:5173`.

## Build de producao

```bash
npm run build
```

