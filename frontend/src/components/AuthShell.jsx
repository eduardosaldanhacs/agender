import { Link } from 'react-router-dom'
import ThemeToggleButton from './ThemeToggleButton'

export default function AuthShell({ title, subtitle, children, footerLabel, footerLink, footerText }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-8 transition-colors duration-300 dark:bg-slate-950">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-300/35 blur-3xl dark:bg-sky-900/40" />
      <div className="pointer-events-none absolute -bottom-28 right-1/3 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-900/30" />

      <ThemeToggleButton className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white/85 text-slate-700 backdrop-blur transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800" />

      <div className="auth-card relative w-full max-w-md rounded-3xl border border-white/70 bg-white/90 p-6 shadow-soft backdrop-blur transition-colors duration-300 md:p-8 dark:border-slate-800 dark:bg-slate-900/85">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700 dark:text-cyan-300">agender</p>
        <h1 className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">{title}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>

        <div className="mt-6">{children}</div>

        <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
          {footerLabel}{' '}
          <Link className="font-semibold text-sky-700 hover:text-sky-900 dark:text-cyan-300 dark:hover:text-cyan-200" to={footerLink}>
            {footerText}
          </Link>
        </p>
      </div>
    </div>
  )
}
