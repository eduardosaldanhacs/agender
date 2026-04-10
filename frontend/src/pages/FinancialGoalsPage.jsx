import { useEffect, useMemo, useState } from 'react'
import { listCategories } from '../api/categories'
import {
  createFinancialGoal,
  deleteFinancialGoal,
  listFinancialGoals,
  updateFinancialGoal,
} from '../api/financialGoals'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import { currency, formatDateBR, toDateInput } from '../utils/format'

const initialForm = {
  title: '',
  goal_type: 'saving',
  target_amount: '',
  current_amount: '0',
  category_id: '',
  start_date: '',
  end_date: '',
  status: 'active',
  notes: '',
}

export default function FinancialGoalsPage() {
  const [goals, setGoals] = useState([])
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialForm)

  const loadData = async () => {
    setError('')

    try {
      const [goalsData, categoriesData] = await Promise.all([listFinancialGoals(), listCategories()])
      setGoals(goalsData)
      setCategories(categoriesData)
    } catch {
      setError('Nao foi possivel carregar metas financeiras.')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const categoryOptions = useMemo(
    () => categories.map((category) => ({ value: String(category.id), label: category.name })),
    [categories],
  )

  const openCreate = () => {
    setEditingId(null)
    setForm({
      ...initialForm,
      start_date: toDateInput(new Date()),
    })
    setOpen(true)
  }

  const openEdit = (goal) => {
    setEditingId(goal.id)
    setForm({
      title: goal.title,
      goal_type: goal.goal_type,
      target_amount: String(goal.target_amount),
      current_amount: String(goal.current_amount),
      category_id: goal.category_id ? String(goal.category_id) : '',
      start_date: goal.start_date ? toDateInput(goal.start_date) : '',
      end_date: goal.end_date ? toDateInput(goal.end_date) : '',
      status: goal.status,
      notes: goal.notes || '',
    })
    setOpen(true)
  }

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      title: form.title,
      goal_type: form.goal_type,
      target_amount: Number(form.target_amount),
      current_amount: Number(form.current_amount),
      category_id: form.category_id ? Number(form.category_id) : null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      status: form.status,
      notes: form.notes || null,
    }

    try {
      if (editingId) {
        await updateFinancialGoal(editingId, payload)
      } else {
        await createFinancialGoal(payload)
      }
      setOpen(false)
      await loadData()
    } catch {
      setError('Erro ao salvar meta financeira.')
    } finally {
      setLoading(false)
    }
  }

  const remove = async () => {
    if (!editingId) return

    setLoading(true)
    setError('')

    try {
      await deleteFinancialGoal(editingId)
      setOpen(false)
      await loadData()
    } catch {
      setError('Erro ao excluir meta financeira.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <PageHeader
        title="Metas Financeiras"
        description="Defina objetivos de economia ou limites de gasto e acompanhe o progresso."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
          >
            Nova meta
          </button>
        }
      />

      {error && <p className="mb-4 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {goals.map((goal) => {
          const progress = Number(goal.progress_percentage || 0)

          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => openEdit(goal)}
              className="rounded-2xl border border-white/60 bg-white p-4 text-left shadow-soft transition hover:-translate-y-0.5"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="line-clamp-1 font-semibold text-slate-900">{goal.title}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    goal.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : goal.status === 'cancelled'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-sky-100 text-sky-700'
                  }`}
                >
                  {goal.status === 'completed' ? 'Concluida' : goal.status === 'cancelled' ? 'Cancelada' : 'Ativa'}
                </span>
              </div>

              <p className="text-sm text-slate-600">
                {goal.goal_type === 'saving' ? 'Meta de economia' : 'Limite de gasto'}
                {goal.category?.name ? ` • ${goal.category.name}` : ''}
              </p>

              <div className="mt-3">
                <p className="text-sm font-semibold text-slate-700">
                  {currency(goal.current_amount)} / {currency(goal.target_amount)}
                </p>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-sky-600"
                    style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">{progress}% concluido</p>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                {goal.end_date ? `Prazo: ${formatDateBR(goal.end_date)}` : 'Sem prazo definido'}
              </p>
            </button>
          )
        })}

        {goals.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
            Nenhuma meta cadastrada ainda.
          </div>
        )}
      </div>

      <Modal title={editingId ? 'Editar meta financeira' : 'Nova meta financeira'} isOpen={open} onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Titulo
            <input
              required
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Tipo
              <select
                value={form.goal_type}
                onChange={(e) => setForm((prev) => ({ ...prev, goal_type: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="saving">Economia</option>
                <option value="expense_limit">Limite de gasto</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Categoria (opcional)
              <select
                value={form.category_id}
                onChange={(e) => setForm((prev) => ({ ...prev, category_id: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="">Todas</option>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Valor alvo
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={form.target_amount}
                onChange={(e) => setForm((prev) => ({ ...prev, target_amount: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Valor atual
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={form.current_amount}
                onChange={(e) => setForm((prev) => ({ ...prev, current_amount: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Data inicial
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setForm((prev) => ({ ...prev, start_date: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Data final
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm((prev) => ({ ...prev, end_date: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Status
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="active">Ativa</option>
              <option value="completed">Concluida</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Observacoes
            <textarea
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              rows={4}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            {editingId && (
              <button
                type="button"
                onClick={remove}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
                disabled={loading}
              >
                Excluir
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800 disabled:opacity-70"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  )
}
