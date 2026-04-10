import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import client from '../api/client'
import { useAuth } from '../hooks/useAuth'
import ThemeToggleButton from '../components/ThemeToggleButton'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/calendario', label: 'Calendario' },
  { to: '/transacoes', label: 'Transacoes' },
  { to: '/categorias', label: 'Categorias' },
  { to: '/anotacoes', label: 'Anotacoes' },
  { to: '/relatorios', label: 'Relatorios' },
  { to: '/metas-financeiras', label: 'Metas Financeiras' },
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
                {item.label}
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
