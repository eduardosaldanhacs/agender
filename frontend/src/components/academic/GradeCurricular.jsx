import DisciplinaCard from './DisciplinaCard'

export default function GradeCurricular({
  disciplinas,
  selectedFuture,
  hoveredDisciplinaId,
  highlightedIds,
  onSelectFuture,
  onStatusChange,
  onHoverDisciplina,
  onClearHover,
  liberadasMap,
  busy,
}) {
  const grouped = disciplinas.reduce((acc, disciplina) => {
    const semestre = disciplina.semestre_sugerido || 1
    acc[semestre] = acc[semestre] || []
    acc[semestre].push(disciplina)
    return acc
  }, {})

  return (
    <section
      onMouseLeave={onClearHover}
      className="rounded-lg border border-white/60 bg-white p-3 shadow-soft dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-slate-100">Diagrama curricular</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Passe o mouse em uma disciplina para destacar as proximas liberadas.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">Bloqueada</span>
          <span className="rounded-full bg-sky-100 px-1.5 py-0.5 text-sky-800 dark:bg-sky-950 dark:text-sky-200">Planejada</span>
          <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-amber-800 dark:bg-amber-950 dark:text-amber-200">Cursando</span>
          <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">Concluida</span>
        </div>
      </div>

      <div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-8">
          {Object.entries(grouped).map(([semestre, items], index) => (
            <section key={semestre} className="relative min-w-0">
              {index > 0 && (
                <div className="absolute -left-2 top-8 hidden h-px w-2 bg-slate-300 2xl:block dark:bg-slate-700" />
              )}

              <div className="mb-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-normal text-slate-900 dark:text-slate-100">
                    {semestre}o sem.
                  </h3>
                  <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-black text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                    {items.reduce((total, item) => total + Number(item.creditos || 0), 0)} cr
                  </span>
                </div>
              </div>

              <div className="relative space-y-1.5">
                <div className="absolute bottom-3 left-2.5 top-3 w-px bg-slate-200 dark:bg-slate-700" />
                {items.map((disciplina) => (
                  <div key={disciplina.id} className="relative pl-3.5">
                    <span className="absolute left-[7px] top-3 h-1.5 w-1.5 rounded-full bg-slate-300 ring-[3px] ring-white dark:bg-slate-600 dark:ring-slate-900" />
                    <DisciplinaCard
                      disciplina={disciplina}
                      selected={selectedFuture.includes(disciplina.id)}
                      hoverActive={Boolean(hoveredDisciplinaId)}
                      isHovered={hoveredDisciplinaId === disciplina.id}
                      isHighlighted={highlightedIds.includes(disciplina.id)}
                      onSelectFuture={onSelectFuture}
                      onStatusChange={onStatusChange}
                      onHoverDisciplina={onHoverDisciplina}
                      liberadasAoConcluir={liberadasMap[disciplina.id]}
                      busy={busy}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
