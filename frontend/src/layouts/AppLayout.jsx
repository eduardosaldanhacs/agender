import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import client from '../api/client'
import { useAuth } from '../hooks/useAuth'
import ThemeToggleButton from '../components/ThemeToggleButton'

function DashboardIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M4 5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm0 10a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4Zm10-10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5Zm0 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4Z" />
    </svg>
  )
}

function CalendarIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm12 8H5v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8Z" />
    </svg>
  )
}

function WalletIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v1h-2a2 2 0 0 0 0 4h2v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7Zm13 4h2a1 1 0 1 0 0-2h-2a1 1 0 1 0 0 2Zm-9 2a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2H8Z" />
    </svg>
  )
}

function TagIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M20.59 13.41 11 23 1 13V3h10l9.59 9.41a2 2 0 0 1 0 2ZM7.5 8A1.5 1.5 0 1 0 7.5 5a1.5 1.5 0 0 0 0 3Z" />
    </svg>
  )
}

function NotesIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M6 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h9.17a3 3 0 0 0 2.12-.88l3.83-3.83A3 3 0 0 0 22 15.17V5a3 3 0 0 0-3-3H6Zm1 5a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Zm0 4a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Zm0 4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Z" />
    </svg>
  )
}

function ChartIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M4 19a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Zm2-2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H6Zm5 0a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-2Zm5 0a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2Z" />
    </svg>
  )
}

function TargetIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M12 2a1 1 0 0 1 1 1v1.08A8.01 8.01 0 0 1 19.92 11H21a1 1 0 1 1 0 2h-1.08A8.01 8.01 0 0 1 13 19.92V21a1 1 0 1 1-2 0v-1.08A8.01 8.01 0 0 1 4.08 13H3a1 1 0 1 1 0-2h1.08A8.01 8.01 0 0 1 11 4.08V3a1 1 0 0 1 1-1Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
    </svg>
  )
}

function MoneyIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M12 2a1 1 0 0 1 1 1v1.07A5 5 0 0 1 17 9a1 1 0 1 1-2 0 3 3 0 0 0-2-2.83V10l.76.19a4 4 0 0 1-.76 7.81V20a1 1 0 1 1-2 0v-1.01A5 5 0 0 1 7 14a1 1 0 1 1 2 0 3 3 0 0 0 2 2.83V12l-.76-.19A4 4 0 0 1 12 4.99V3a1 1 0 0 1 1-1Zm-1 4.1a2 2 0 0 0-.24 3.9L11 10.1V6.1Zm2 7.7a2 2 0 0 0 .24-3.9L13 13.9v.7Z" />
    </svg>
  )
}

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { to: '/calendario', label: 'Calendario', icon: CalendarIcon },
  { to: '/transacoes', label: 'Transacoes', icon: WalletIcon },
  { to: '/categorias', label: 'Categorias', icon: TagIcon },
  { to: '/anotacoes', label: 'Anotacoes', icon: NotesIcon },
  { to: '/relatorios', label: 'Relatorios', icon: ChartIcon },
  { to: '/metas-financeiras', label: 'Metas Financeiras', icon: TargetIcon },
  { to: '/investimentos', label: 'Investimentos', icon: MoneyIcon },
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await client.post('/auth/logout')
    } catch {
      // Token local sera removido mesmo se API falhar.
    } finally {
      logout()
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 md:grid-cols-[260px_1fr]">
        <aside className="relative overflow-hidden bg-gradient-to-b from-cyan-700 via-sky-700 to-blue-900 px-4 py-6 text-white md:px-6">
          <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl" />
          <div className="pointer-events-none absolute bottom-8 right-0 h-32 w-32 rounded-full bg-sky-300/20 blur-2xl" />

          <Link to="/dashboard" className="relative text-2xl font-black tracking-tight">
            agender
          </Link>

          <p className="relative mt-2 text-sm text-cyan-100">Mini ERP pessoal</p>

          <ThemeToggleButton className="relative mt-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/30 bg-white/10 text-cyan-50 transition hover:bg-white/20" />

          <nav className="relative mt-8 space-y-2">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    isActive ? 'bg-white/20 text-white' : 'text-cyan-50 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <span className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="relative mt-10 rounded-xl border border-white/20 bg-white/10 p-4 text-sm backdrop-blur">
            <p className="font-semibold">{user?.name ?? 'Usuario'}</p>
            <p className="mt-1 text-cyan-100">{user?.email ?? '-'}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 w-full rounded-lg bg-white px-3 py-2 text-sm font-semibold text-sky-800 transition hover:bg-cyan-50"
            >
              Sair
            </button>
          </div>
        </aside>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
