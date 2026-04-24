export default function ProgressBarCreditos({ progresso }) {
  const percentage = Math.max(0, Math.min(Number(progresso.percentual_conclusao || 0), 100))

  return (
    <section className="mb-5 rounded-lg border border-white/60 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Progresso do curso</p>
          <p className="mt-1 text-3xl font-black text-slate-900 dark:text-slate-100">{percentage}%</p>
        </div>
        <div className="text-right text-sm text-slate-600 dark:text-slate-300">
          <p>{progresso.creditos_concluidos || 0} de {progresso.total_creditos || 0} creditos</p>
          <p>Formatura estimada: {progresso.semestre_estimado_formatura || '-'}</p>
        </div>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full rounded-full bg-emerald-600" style={{ width: `${percentage}%` }} />
      </div>

      <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
          <p className="font-black text-slate-900 dark:text-slate-100">{progresso.total_creditos || 0}</p>
          <p className="text-slate-500 dark:text-slate-400">Total</p>
        </div>
        <div className="rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-950">
          <p className="font-black text-emerald-800 dark:text-emerald-200">{progresso.creditos_concluidos || 0}</p>
          <p className="text-emerald-700 dark:text-emerald-300">Concluidos</p>
        </div>
        <div className="rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-950">
          <p className="font-black text-amber-800 dark:text-amber-200">{progresso.creditos_restantes || 0}</p>
          <p className="text-amber-700 dark:text-amber-300">Restantes</p>
        </div>
      </div>
    </section>
  )
}
