import { useEffect, useState } from 'react'
import { createNote, deleteNote, listNotes, updateNote } from '../api/notes'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'

const emptyForm = {
  title: '',
  content: '',
  color: '#FEF3C7',
  is_pinned: false,
}

export default function NotesPage() {
  const [notes, setNotes] = useState([])
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchNotes = async () => {
    setError('')

    try {
      const data = await listNotes()
      setNotes(data)
    } catch {
      setError('Nao foi possivel carregar anotacoes.')
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const openEdit = (note) => {
    setEditingId(note.id)
    setForm({
      title: note.title ?? '',
      content: note.content ?? '',
      color: note.color || '#FEF3C7',
      is_pinned: Boolean(note.is_pinned),
    })
    setOpen(true)
  }

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        title: form.title || null,
        content: form.content,
        color: form.color || null,
        is_pinned: form.is_pinned,
      }

      if (editingId) {
        await updateNote(editingId, payload)
      } else {
        await createNote(payload)
      }

      setOpen(false)
      await fetchNotes()
    } catch {
      setError('Erro ao salvar anotacao.')
    } finally {
      setLoading(false)
    }
  }

  const remove = async () => {
    if (!editingId) return

    setLoading(true)
    setError('')

    try {
      await deleteNote(editingId)
      setOpen(false)
      await fetchNotes()
    } catch {
      setError('Erro ao excluir anotacao.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <PageHeader
        title="Anotacoes"
        description="Bloco de notas rapido para ideias, lembretes e checklists."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
          >
            Nova anotacao
          </button>
        }
      />

      {error && <p className="mb-4 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {notes.map((note) => (
          <button
            type="button"
            key={note.id}
            onClick={() => openEdit(note)}
            className="rounded-2xl border border-slate-200 p-4 text-left shadow-soft transition hover:-translate-y-0.5"
            style={{ backgroundColor: note.color || '#FFF' }}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="line-clamp-1 font-semibold text-slate-900">{note.title || 'Sem titulo'}</h3>
              {note.is_pinned && (
                <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-900">Fixada</span>
              )}
            </div>
            <p className="line-clamp-6 whitespace-pre-line text-sm text-slate-700">{note.content}</p>
          </button>
        ))}

        {notes.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
            Voce ainda nao criou anotacoes.
          </div>
        )}
      </div>

      <Modal title={editingId ? 'Editar anotacao' : 'Nova anotacao'} isOpen={open} onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Titulo
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              maxLength={120}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Conteudo
            <textarea
              required
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              rows={8}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              maxLength={10000}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Cor
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
                className="mt-1 h-11 w-full rounded-lg border border-slate-300 px-2 py-1"
              />
            </label>

            <label className="flex items-center gap-2 self-end text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.is_pinned}
                onChange={(e) => setForm((prev) => ({ ...prev, is_pinned: e.target.checked }))}
              />
              Fixar anotacao
            </label>
          </div>

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
