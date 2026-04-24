export default function TooltipDependencias({ preRequisitos = [], liberadas = [] }) {
  return (
    <div className="pointer-events-none absolute left-0 right-0 top-full z-20 mt-1.5 hidden rounded-md border border-slate-200 bg-white p-2 text-left text-[10px] shadow-xl group-hover:block dark:border-slate-700 dark:bg-slate-900">
      <div>
        <p className="font-bold text-slate-900 dark:text-slate-100">Pre-requisitos</p>
        {preRequisitos.length > 0 ? (
          <ul className="mt-1 space-y-1 text-slate-600 dark:text-slate-300">
            {preRequisitos.map((disciplina) => (
              <li key={disciplina.id}>{disciplina.codigo} - {disciplina.nome}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-slate-500 dark:text-slate-400">Nenhum.</p>
        )}
      </div>

      <div className="mt-3">
        <p className="font-bold text-slate-900 dark:text-slate-100">Libera ao concluir</p>
        {liberadas.length > 0 ? (
          <ul className="mt-1 space-y-1 text-slate-600 dark:text-slate-300">
            {liberadas.map((disciplina) => (
              <li key={disciplina.id}>{disciplina.codigo} - {disciplina.nome}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-slate-500 dark:text-slate-400">Nenhuma disciplina direta.</p>
        )}
      </div>
    </div>
  )
}
