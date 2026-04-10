export default function PageHeader({ title, description, action }) {
  return (
    <header className="mb-6 rounded-2xl border border-white/60 bg-white/90 p-5 shadow-soft backdrop-blur transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/85">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl dark:text-slate-100">{title}</h1>
          {description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</p>}
        </div>
        {action}
      </div>
    </header>
  )
}
