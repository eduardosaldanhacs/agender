import { useCallback, useEffect, useMemo, useState } from 'react'
import { listCategories } from '../api/categories'
import { createTransaction, deleteTransaction, listTransactions, updateTransaction } from '../api/transactions'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import { currency, formatDateBR, toDateInput } from '../utils/format'

const initialForm = {
  description: '',
  amount: '',
  transaction_date: '',
  type: 'expense',
  category_id: '',
  is_recurring: false,
  frequency: 'monthly',
  end_date: '',
}

export default function TransactionsPage() {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [balanceSummary, setBalanceSummary] = useState({
    current_balance: 0,
    future_expenses: 0,
    projected_balance: 0,
  })
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [form, setForm] = useState(initialForm)

  const fetchData = useCallback(async () => {
    setError('')
    try {
      const [year, month] = selectedMonth.split('-').map(Number)
      const monthStart = new Date(year, month - 1, 1).toISOString().slice(0, 10)
      const monthEnd = new Date(year, month, 0).toISOString().slice(0, 10)

      const [txResponse, categoriesResponse] = await Promise.all([
        listTransactions({ start: monthStart, end: monthEnd }),
        listCategories(),
      ])
      setTransactions(txResponse.data)
      setBalanceSummary(txResponse.balance_summary)
      setCategories(categoriesResponse)
    } catch {
      setError('Nao foi possivel carregar transacoes.')
    }
  }, [selectedMonth])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const categorizedOptions = useMemo(
    () => categories.map((item) => ({ value: String(item.id), label: item.name })),
    [categories],
  )

  const openCreate = () => {
    setEditingId(null)
    setForm({ ...initialForm, transaction_date: toDateInput(new Date()) })
    setOpen(true)
  }

  const openEdit = (transaction) => {
    setEditingId(transaction.id)
    setForm({
      description: transaction.description,
      amount: String(transaction.amount),
      transaction_date: transaction.transaction_date,
      type: transaction.type,
      category_id: String(transaction.category_id ?? ''),
      is_recurring: Boolean(transaction.recurring_rule_id),
      frequency: transaction.recurring_rule?.frequency ?? 'monthly',
      end_date: transaction.recurring_rule?.end_date ?? '',
    })
    setOpen(true)
  }

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      ...form,
      amount: Number(form.amount),
      category_id: Number(form.category_id),
      end_date: form.end_date || null,
    }

    try {
      if (editingId) {
        await updateTransaction(editingId, payload)
      } else {
        await createTransaction(payload)
      }
      setOpen(false)
      await fetchData()
    } catch {
      setError('Erro ao salvar transacao.')
    } finally {
      setLoading(false)
    }
  }

  const remove = async () => {
    if (!editingId) return
    setLoading(true)

    try {
      await deleteTransaction(editingId)
      setOpen(false)
      await fetchData()
    } catch {
      setError('Erro ao excluir transacao.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <PageHeader
        title="Transacoes"
        description="Controle receitas e despesas com recorrencia opcional."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={openCreate}
              className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
            >
              Nova transacao
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

      <article className="rounded-2xl border border-white/60 bg-white p-4 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Saldo atual</p>
        <p className={`mt-2 text-3xl font-black ${Number(balanceSummary.current_balance) >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
          {currency(balanceSummary.current_balance)}
        </p>
      </article>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-2xl border border-white/60 bg-white p-4 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Despesas Futuras</p>
          <p className="mt-2 text-2xl font-bold text-red-700">{currency(balanceSummary.future_expenses)}</p>
        </article>

        <article className="rounded-2xl border border-white/60 bg-white p-4 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Saldo Projetado</p>
          <p className={`mt-2 text-2xl font-bold ${Number(balanceSummary.projected_balance) >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            {currency(balanceSummary.projected_balance)}
          </p>
        </article>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/60 bg-white shadow-soft">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Descricao</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                onClick={() => openEdit(tx)}
                className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-medium text-slate-900">{tx.description}</td>
                <td className="px-4 py-3">{tx.category?.name ?? '-'}</td>
                <td className="px-4 py-3">{formatDateBR(tx.transaction_date)}</td>
                <td className="px-4 py-3">{tx.type === 'income' ? 'Entrada' : 'Saida'}</td>
                <td className={`px-4 py-3 text-right font-semibold ${tx.type === 'income' ? 'text-emerald-700' : 'text-red-700'}`}>
                  {tx.type === 'income' ? '+' : '-'} {currency(tx.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal title={editingId ? 'Editar transacao' : 'Nova transacao'} isOpen={open} onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Descricao
            <input
              required
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Valor
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={form.amount}
                onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Data
              <input
                type="date"
                required
                value={form.transaction_date}
                onChange={(e) => setForm((prev) => ({ ...prev, transaction_date: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Tipo
              <select
                value={form.type}
                onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="income">Entrada</option>
                <option value="expense">Saida</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Categoria
              <select
                required
                value={form.category_id}
                onChange={(e) => setForm((prev) => ({ ...prev, category_id: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="">Selecione</option>
                {categorizedOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.is_recurring}
              onChange={(e) => setForm((prev) => ({ ...prev, is_recurring: e.target.checked }))}
            />
            Transacao recorrente
          </label>

          {form.is_recurring && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Frequencia
                <select
                  value={form.frequency}
                  onChange={(e) => setForm((prev) => ({ ...prev, frequency: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  <option value="daily">Diaria</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                  <option value="yearly">Anual</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Data final (opcional)
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm((prev) => ({ ...prev, end_date: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
            </div>
          )}

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
