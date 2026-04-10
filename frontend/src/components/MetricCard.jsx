export default function MetricCard({ title, value, subtitle }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900/85">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
      {subtitle && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>}
    </article>
  )
}
