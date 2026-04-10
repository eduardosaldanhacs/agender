import { useEffect, useState } from 'react'
import { createCategory, deleteCategory, listCategories, updateCategory } from '../api/categories'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'

const emptyForm = { name: '', color: '#0ea5e9' }

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchCategories = async () => {
    try {
      const data = await listCategories()
      setCategories(data)
    } catch {
      setError('Nao foi possivel carregar categorias.')
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const openEdit = (category) => {
    setEditingId(category.id)
    setForm({ name: category.name, color: category.color || '#0ea5e9' })
    setOpen(true)
  }

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (editingId) {
        await updateCategory(editingId, form)
      } else {
        await createCategory(form)
      }
      setOpen(false)
      await fetchCategories()
    } catch {
      setError('Erro ao salvar categoria.')
    } finally {
      setLoading(false)
    }
  }

  const remove = async () => {
    if (!editingId) return
    setLoading(true)

    try {
      await deleteCategory(editingId)
      setOpen(false)
      await fetchCategories()
    } catch {
      setError('Erro ao excluir categoria.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <PageHeader
        title="Categorias"
        description="Organize receitas e despesas por categorias personalizadas."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
          >
            Nova categoria
          </button>
        }
      />

      {error && <p className="mb-4 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <button
            type="button"
            key={category.id}
            onClick={() => openEdit(category)}
            className="rounded-2xl border border-white/60 bg-white p-4 text-left shadow-soft transition hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3">
              <span className="h-5 w-5 rounded-full border border-slate-200" style={{ backgroundColor: category.color || '#0ea5e9' }} />
              <p className="font-semibold text-slate-900">{category.name}</p>
            </div>
          </button>
        ))}
      </div>

      <Modal title={editingId ? 'Editar categoria' : 'Nova categoria'} isOpen={open} onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Nome
            <input
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Cor
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
              className="mt-1 h-11 w-full rounded-lg border border-slate-300 px-2 py-1"
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
