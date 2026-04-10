import { useState } from 'react'
import Modal from './Modal'
import { currency, formatDateBR } from '../utils/format'

export default function MetricCard({ title, value, subtitle, details = [], detailsTitle = 'Transacoes consideradas' }) {
  const hasDetails = Array.isArray(details) && details.length > 0
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <article className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900/85">
        {hasDetails ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-full text-left"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{title}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
            {subtitle && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>}
            <p className="mt-3 text-xs font-semibold text-sky-700 dark:text-cyan-300">Clique para ver detalhes</p>
          </button>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{title}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
            {subtitle && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>}
          </>
        )}
      </article>

      {hasDetails && (
        <Modal title={detailsTitle} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ul className="max-h-80 space-y-1 overflow-auto pr-1">
            {details.map((item, index) => (
              <li key={`${item.description}-${item.date}-${index}`} className="flex items-start justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{item.description}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDateBR(item.date)}
                    {item.source === 'recurring_rule' ? ' • Recorrente projetada' : ''}
                  </p>
                </div>
                <p className={`text-sm font-semibold ${item.type === 'income' ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                  {item.type === 'income' ? '+' : '-'} {currency(item.amount)}
                </p>
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </>
  )
}
