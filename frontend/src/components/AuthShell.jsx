import { Link } from 'react-router-dom'

export default function AuthShell({ title, subtitle, children, footerLabel, footerLink, footerText }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-8">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-300/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 right-1/3 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/70 bg-white/90 p-6 shadow-soft backdrop-blur md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">agender</p>
        <h1 className="mt-2 text-2xl font-black text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{subtitle}</p>

        <div className="mt-6">{children}</div>

        <p className="mt-6 text-sm text-slate-600">
          {footerLabel}{' '}
          <Link className="font-semibold text-sky-700 hover:text-sky-900" to={footerLink}>
            {footerText}
          </Link>
        </p>
      </div>
    </div>
  )
}
