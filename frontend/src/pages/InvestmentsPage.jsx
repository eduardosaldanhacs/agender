import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import MetricCard from '../components/MetricCard'
import { currency } from '../utils/format'
import { calculateCompoundInvestment } from '../utils/investments'

const defaultValues = {
  initialAmount: '2500',
  monthlyContribution: '0',
  annualReferenceRate: '10.65',
  percentageOfReference: '120',
  months: '12',
}

export default function InvestmentsPage() {
  const [form, setForm] = useState(defaultValues)

  const result = useMemo(
    () =>
      calculateCompoundInvestment({
        initialAmount: form.initialAmount,
        monthlyContribution: form.monthlyContribution,
        annualReferenceRate: form.annualReferenceRate,
        percentageOfReference: form.percentageOfReference,
        months: form.months,
      }),
    [form],
  )

  const exampleProjectedLabel = useMemo(() => {
    const months = Number(form.months || 12)
    if (months === 12) return 'Projecao em 1 ano'
    return `Projecao em ${months} meses`
  }, [form.months])

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const applyExample = () => {
    setForm(defaultValues)
  }

  return (
    <section>
      <PageHeader
        title="Investimentos"
        description="Simule CDI, percentual contratado e aportes mensais com projeção composta."
        action={
          <button
            type="button"
            onClick={applyExample}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Usar exemplo
          </button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-2xl border border-white/60 bg-white p-5 shadow-soft transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/85">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Parametros da simulacao</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            A projeção é bruta e não considera IR, taxas, inflação ou mudanças na taxa CDI no período.
          </p>

          <form className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Valor inicial
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.initialAmount}
                  onChange={(e) => updateField('initialAmount', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-sky-500 transition focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Aporte mensal
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.monthlyContribution}
                  onChange={(e) => updateField('monthlyContribution', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-sky-500 transition focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                CDI anual (%)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.annualReferenceRate}
                  onChange={(e) => updateField('annualReferenceRate', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-sky-500 transition focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Percentual do CDI (%)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.percentageOfReference}
                  onChange={(e) => updateField('percentageOfReference', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-sky-500 transition focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Prazo (meses)
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.months}
                  onChange={(e) => updateField('months', e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-sky-500 transition focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </label>
            </div>
          </form>
        </article>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <MetricCard title="Saldo final estimado" value={currency(result.finalBalance)} subtitle={exampleProjectedLabel} />
          <MetricCard title="Total investido" value={currency(result.totalContributed)} subtitle="Capital aportado no periodo" />
          <MetricCard title="Ganho estimado" value={currency(result.projectedGain)} subtitle="Projecao bruta de rentabilidade" />
          <MetricCard title="Rentabilidade anual" value={`${(result.annualRate * 100).toFixed(2)}%`} subtitle="Taxa efetiva anual da simulacao" />
        </div>
      </div>

      <article className="mt-6 rounded-2xl border border-white/60 bg-white p-5 shadow-soft transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/85">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Evolucao mensal</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">Como o saldo tende a crescer ao longo do periodo.</p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Exemplo: 2500 em 120% do CDI
          </p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-3 py-2">Mes</th>
                <th className="px-3 py-2">Aportes</th>
                <th className="px-3 py-2">Saldo projetado</th>
                <th className="px-3 py-2 text-right">Ganho acumulado</th>
              </tr>
            </thead>
            <tbody>
              {result.timeline.map((item) => (
                <tr key={item.month} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-3 font-medium text-slate-900 dark:text-slate-100">{item.month}</td>
                  <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{currency(Number(form.monthlyContribution || 0) * item.month)}</td>
                  <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{currency(item.balance)}</td>
                  <td className="px-3 py-3 text-right font-semibold text-emerald-700 dark:text-emerald-400">{currency(item.gain)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}
