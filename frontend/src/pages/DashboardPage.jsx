import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import { getDashboard } from '../api/dashboard'
import MetricCard from '../components/MetricCard'
import PageHeader from '../components/PageHeader'
import { currency, formatDateBR, formatTimeShort } from '../utils/format'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function DashboardPage() {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [dashboard, setDashboard] = useState({
    upcoming_events: [],
    balance_summary: {
      current_balance: 0,
      future_expenses: 0,
      projected_balance: 0,
      future_income: 0,
      current_transactions: [],
      future_expense_items: [],
      future_income_items: [],
      projected_items: [],
    },
    expenses_by_category: [],
    monthly_summary: [],
  })

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [year, month] = selectedMonth.split('-').map(Number)
      const monthStart = new Date(year, month - 1, 1)
      const monthEnd = new Date(year, month, 0)

      const data = await getDashboard({
        start_date: monthStart.toISOString().slice(0, 10),
        end_date: monthEnd.toISOString().slice(0, 10),
      })
      setDashboard(data)
    } catch {
      setError('Nao foi possivel carregar o dashboard.')
    } finally {
      setLoading(false)
    }
  }, [selectedMonth])

  useEffect(() => {
    loadData()
  }, [loadData])

  const expenseChart = useMemo(() => {
    const labels = dashboard.expenses_by_category.map((item) => item.category)
    const values = dashboard.expenses_by_category.map((item) => Number(item.total))

    return {
      labels,
      datasets: [
        {
          label: 'Despesas por categoria',
          data: values,
          backgroundColor: ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#14b8a6', '#6366f1'],
          borderWidth: 0,
        },
      ],
    }
  }, [dashboard.expenses_by_category])

  const monthlyChart = useMemo(() => {
    const labels = dashboard.monthly_summary.map((item) => item.month)

    return {
      labels,
      datasets: [
        {
          label: 'Receitas',
          data: dashboard.monthly_summary.map((item) => Number(item.income)),
          backgroundColor: '#16a34a',
        },
        {
          label: 'Despesas',
          data: dashboard.monthly_summary.map((item) => Number(item.expense)),
          backgroundColor: '#dc2626',
        },
      ],
    }
  }, [dashboard.monthly_summary])

  const nextEvent = dashboard.upcoming_events[0]

  return (
    <section>
      <PageHeader
        title="Dashboard"
        description="Visao consolidada de agenda e financas pessoais."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={loadData}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Atualizar
            </button>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <span>Mes</span>
              <input
                type="month"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
          </div>
        }
      />

      {error && <p className="mb-4 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Saldo Atual"
          value={currency(dashboard.balance_summary.current_balance)}
          subtitle="Movimentos do mes selecionado ate hoje"
          details={dashboard.balance_summary.current_transactions}
          detailsTitle="Transacoes no saldo atual"
        />
        <MetricCard
          title="Despesas Futuras"
          value={currency(dashboard.balance_summary.future_expenses)}
          subtitle="Apenas do mes selecionado"
          details={dashboard.balance_summary.future_expense_items}
          detailsTitle="Despesas consideradas"
        />
        <MetricCard
          title="Saldo Projetado"
          value={currency(dashboard.balance_summary.projected_balance)}
          subtitle="Saldo do mes selecionado"
          details={dashboard.balance_summary.projected_items}
          detailsTitle="Movimentos futuros projetados"
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <MetricCard
          title="Receita Futura"
          value={currency(dashboard.balance_summary.future_income)}
          subtitle="Entradas que ainda vao acontecer"
          details={dashboard.balance_summary.future_income_items}
          detailsTitle="Receitas consideradas"
        />
        <MetricCard
          title="Evento Mais Proximo"
          value={nextEvent?.title ?? 'Nenhum evento'}
          subtitle={nextEvent ? `${formatDateBR(nextEvent.event_date)} as ${formatTimeShort(nextEvent.event_time)}` : 'Cadastre eventos no calendario'}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-white/60 bg-white p-4 shadow-soft">
          <h2 className="mb-3 text-lg font-bold text-slate-900">Despesas por Categoria</h2>
          <div className="h-80">
            {loading ? (
              <p className="text-sm text-slate-500">Carregando grafico...</p>
            ) : (
              <Doughnut
                data={expenseChart}
                options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
              />
            )}
          </div>
        </article>

        <article className="rounded-2xl border border-white/60 bg-white p-4 shadow-soft">
          <h2 className="mb-3 text-lg font-bold text-slate-900">Resumo Mensal (Receitas x Despesas)</h2>
          <div className="h-80">
            {loading ? (
              <p className="text-sm text-slate-500">Carregando grafico...</p>
            ) : (
              <Bar
                data={monthlyChart}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: { legend: { position: 'bottom' } },
                }}
              />
            )}
          </div>
        </article>
      </div>

      <article className="mt-6 rounded-2xl border border-white/60 bg-white p-4 shadow-soft">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Proximos Eventos</h2>
        <ul className="space-y-2">
          {dashboard.upcoming_events.length === 0 && (
            <li className="rounded-lg border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-500">
              Nenhum evento futuro encontrado.
            </li>
          )}
          {dashboard.upcoming_events.map((event) => (
            <li key={event.id} className="rounded-lg border border-slate-200 px-3 py-3">
              <p className="font-semibold text-slate-900">{event.title}</p>
              <p className="text-sm text-slate-600">{formatDateBR(event.event_date)} as {formatTimeShort(event.event_time)}</p>
            </li>
          ))}
        </ul>
      </article>
    </section>
  )
}
