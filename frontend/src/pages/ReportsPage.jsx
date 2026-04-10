import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { listCategories } from '../api/categories'
import { getReports } from '../api/reports'
import MetricCard from '../components/MetricCard'
import PageHeader from '../components/PageHeader'
import { currency, formatDateBR, toDateInput } from '../utils/format'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend)

function formatMonthLabel(month) {
  if (!month || typeof month !== 'string') return month
  const [year, monthNumber] = month.split('-')
  if (!year || !monthNumber) return month

  const names = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `${names[Number(monthNumber) - 1] || monthNumber}/${year}`
}

export default function ReportsPage() {
  const today = new Date()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({
    start_date: toDateInput(new Date(today.getFullYear(), today.getMonth() - 5, 1)),
    end_date: toDateInput(new Date(today.getFullYear(), today.getMonth() + 1, 0)),
    type: '',
    category_id: '',
  })
  const [reports, setReports] = useState({
    totals: { income: 0, expense: 0, net: 0 },
    monthly_spending: [],
    financial_evolution: [],
    top_categories: [],
  })

  const loadData = useCallback(async (currentFilters = filters) => {
    setLoading(true)
    setError('')

    try {
      const [reportResponse, categoriesResponse] = await Promise.all([
        getReports({
          start_date: currentFilters.start_date,
          end_date: currentFilters.end_date,
          type: currentFilters.type || undefined,
          category_id: currentFilters.category_id || undefined,
        }),
        listCategories(),
      ])

      setReports(reportResponse)
      setCategories(categoriesResponse)
    } catch {
      setError('Nao foi possivel carregar os relatorios.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadData()
  }, [loadData])

  const spendingChart = useMemo(() => {
    return {
      labels: reports.monthly_spending.map((item) => formatMonthLabel(item.month)),
      datasets: [
        {
          label: 'Gastos por mes',
          data: reports.monthly_spending.map((item) => Number(item.total)),
          backgroundColor: '#ef4444',
        },
      ],
    }
  }, [reports.monthly_spending])

  const evolutionChart = useMemo(() => {
    const labels = reports.financial_evolution.map((item) => formatMonthLabel(item.month))

    return {
      labels,
      datasets: [
        {
          label: 'Saldo mensal',
          data: reports.financial_evolution.map((item) => Number(item.balance)),
          borderColor: '#0f766e',
          backgroundColor: 'rgba(15, 118, 110, 0.12)',
          fill: true,
          tension: 0.25,
        },
      ],
    }
  }, [reports.financial_evolution])

  const topCategoriesChart = useMemo(() => {
    return {
      labels: reports.top_categories.map((item) => item.name),
      datasets: [
        {
          label: 'Top categorias',
          data: reports.top_categories.map((item) => Number(item.total)),
          backgroundColor: reports.top_categories.map((item) => item.color || '#3b82f6'),
        },
      ],
    }
  }, [reports.top_categories])

  const onApplyFilters = async (event) => {
    event.preventDefault()
    await loadData(filters)
  }

  return (
    <section>
      <PageHeader
        title="Relatorios"
        description="Gastos por mes, evolucao financeira e top categorias com filtros inteligentes."
      />

      {error && <p className="mb-4 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

      <form onSubmit={onApplyFilters} className="mb-4 rounded-2xl border border-white/60 bg-white p-4 shadow-soft">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="block text-sm font-medium text-slate-700">
            Data inicial
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => setFilters((prev) => ({ ...prev, start_date: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Data final
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => setFilters((prev) => ({ ...prev, end_date: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Tipo
            <select
              value={filters.type}
              onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="">Todos</option>
              <option value="income">Entrada</option>
              <option value="expense">Saida</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Categoria
            <select
              value={filters.category_id}
              onChange={(e) => setFilters((prev) => ({ ...prev, category_id: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              const next = {
                start_date: toDateInput(new Date(today.getFullYear(), today.getMonth() - 5, 1)),
                end_date: toDateInput(new Date(today.getFullYear(), today.getMonth() + 1, 0)),
                type: '',
                category_id: '',
              }
              setFilters(next)
              loadData(next)
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Limpar filtros
          </button>
          <button
            type="submit"
            className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
          >
            Aplicar filtros
          </button>
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard title="Receitas" value={currency(reports.totals.income)} subtitle={`Periodo ${formatDateBR(filters.start_date)} a ${formatDateBR(filters.end_date)}`} />
        <MetricCard title="Despesas" value={currency(reports.totals.expense)} subtitle="Total filtrado" />
        <MetricCard title="Saldo" value={currency(reports.totals.net)} subtitle="Receitas - Despesas" />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-white/60 bg-white p-4 shadow-soft">
          <h2 className="mb-3 text-lg font-bold text-slate-900">Gastos por Mes</h2>
          <div className="h-72">
            {loading ? (
              <p className="text-sm text-slate-500">Carregando grafico...</p>
            ) : (
              <Bar data={spendingChart} options={{ maintainAspectRatio: false, responsive: true }} />
            )}
          </div>
        </article>

        <article className="rounded-2xl border border-white/60 bg-white p-4 shadow-soft">
          <h2 className="mb-3 text-lg font-bold text-slate-900">Evolucao Financeira</h2>
          <div className="h-72">
            {loading ? (
              <p className="text-sm text-slate-500">Carregando grafico...</p>
            ) : (
              <Line data={evolutionChart} options={{ maintainAspectRatio: false, responsive: true }} />
            )}
          </div>
        </article>
      </div>

      <article className="mt-6 rounded-2xl border border-white/60 bg-white p-4 shadow-soft">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Top Categorias</h2>
        <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
          <div className="h-64">
            {loading ? (
              <p className="text-sm text-slate-500">Carregando grafico...</p>
            ) : (
              <Doughnut data={topCategoriesChart} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            )}
          </div>

          <ul className="space-y-2">
            {reports.top_categories.length === 0 && (
              <li className="rounded-lg border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-500">
                Nenhuma categoria para o filtro selecionado.
              </li>
            )}
            {reports.top_categories.map((category) => (
              <li key={category.category_id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color || '#3b82f6' }} />
                  <span className="font-medium text-slate-900">{category.name}</span>
                </div>
                <span className="text-sm font-semibold text-slate-700">{currency(category.total)}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </section>
  )
}
