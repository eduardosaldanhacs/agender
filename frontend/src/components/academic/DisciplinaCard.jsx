import TooltipDependencias from './TooltipDependencias'

const statusLabels = {
  bloqueada: 'Bloq.',
  planejada: 'Plan.',
  cursando: 'Curso',
  concluida: 'Conc.',
}

const statusStyles = {
  bloqueada: 'border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
  planejada: 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200',
  cursando: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200',
  concluida: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200',
}

export default function DisciplinaCard({
  disciplina,
  selected,
  hoverActive,
  isHovered,
  isHighlighted,
  onSelectFuture,
  onStatusChange,
  onHoverDisciplina,
  liberadasAoConcluir,
  busy,
}) {
  const status = disciplina.status_usuario || 'bloqueada'
  const canPlan = disciplina.liberada && status !== 'concluida'
  const muted = hoverActive && !isHovered && !isHighlighted

  return (
    <article
      onMouseEnter={() => onHoverDisciplina(disciplina)}
      className={`group relative min-h-[82px] rounded-md border p-1.5 shadow-sm transition duration-200 ${statusStyles[status]} ${
        isHovered ? 'z-30 scale-[1.02] ring-2 ring-slate-900 ring-offset-2 dark:ring-white dark:ring-offset-slate-950' : ''
      } ${
        isHighlighted ? 'z-20 scale-[1.02] ring-2 ring-fuchsia-500 ring-offset-2 dark:ring-fuchsia-300 dark:ring-offset-slate-950' : ''
      } ${muted ? 'opacity-35 saturate-50' : 'opacity-100'}`}
    >
      <div className="flex items-start justify-between gap-1.5">
        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase leading-none tracking-normal opacity-75">{disciplina.codigo}</p>
          <h3 className="mt-0.5 line-clamp-2 text-[10px] font-black leading-tight">{disciplina.nome}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-white/70 px-1 py-0.5 text-[9px] font-black leading-none dark:bg-slate-900/60">
          {disciplina.creditos} cr
        </span>
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-1">
        <span className="rounded-full bg-white/70 px-1 py-0.5 text-[9px] font-bold leading-none dark:bg-slate-900/60">
          {statusLabels[status]}
        </span>
        {isHighlighted && (
          <span className="rounded-full bg-fuchsia-100 px-1 py-0.5 text-[9px] font-black leading-none text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-200">
            Liberada
          </span>
        )}
        {disciplina.liberada && status !== 'concluida' && (
          <span className="rounded-full bg-white/70 px-1 py-0.5 text-[9px] font-bold leading-none dark:bg-slate-900/60">
            Disp.
          </span>
        )}
      </div>

      <div className="mt-1.5 grid gap-1">
        <select
          value={status}
          onChange={(event) => onStatusChange(disciplina.id, event.target.value)}
          disabled={busy}
          className="h-6 rounded-md border border-white/70 bg-white px-1 text-[10px] font-bold text-slate-800 outline-none disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="bloqueada">Bloqueada</option>
          <option value="planejada" disabled={!disciplina.liberada}>Planejada</option>
          <option value="cursando" disabled={!disciplina.liberada}>Cursando</option>
          <option value="concluida" disabled={!disciplina.liberada}>Concluida</option>
        </select>

        {canPlan && (
          <label className="flex h-4 items-center gap-1 text-[9px] font-bold leading-none">
            <input
              type="checkbox"
              checked={selected}
              onChange={(event) => onSelectFuture(disciplina.id, event.target.checked)}
              className="h-3 w-3 rounded border-slate-300 text-sky-700"
            />
            Planejar
          </label>
        )}
      </div>

      <TooltipDependencias
        preRequisitos={disciplina.pre_requisitos || []}
        liberadas={liberadasAoConcluir || disciplina.libera_disciplinas || []}
      />
    </article>
  )
}
