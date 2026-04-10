import dayGridPlugin from '@fullcalendar/daygrid'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { useEffect, useMemo, useState } from 'react'
import { createEvent, deleteEvent, listEvents, updateEvent } from '../api/events'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import { toDateInput, toDateTimeLocal, toEventDateTime } from '../utils/format'

function toApiPayload(form) {
  const reminderAt = form.reminder_at ? new Date(form.reminder_at).toISOString().slice(0, 19).replace('T', ' ') : null

  return {
    title: form.title,
    description: form.description || null,
    event_date: form.event_date,
    event_time: form.event_time,
    reminder_at: reminderAt,
  }
}

export default function CalendarPage() {
  const [events, setEvents] = useState([])
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '09:00',
    reminder_at: '',
  })

  const fetchEvents = async () => {
    setError('')
    try {
      const data = await listEvents()
      setEvents(data)
    } catch {
      setError('Nao foi possivel carregar os eventos.')
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const calendarEvents = useMemo(
    () =>
      events.map((event) => ({
        id: String(event.id),
        title: event.title,
        start: toEventDateTime(event.event_date, event.event_time),
        extendedProps: event,
      })),
    [events],
  )

  const openCreate = (dateStr = '') => {
    setEditingId(null)
    setForm({
      title: '',
      description: '',
      event_date: dateStr,
      event_time: '09:00',
      reminder_at: '',
    })
    setOpen(true)
  }

  const openEdit = (eventObj) => {
    setEditingId(eventObj.id)
    setForm({
      title: eventObj.title,
      description: eventObj.description || '',
      event_date: toDateInput(eventObj.event_date),
      event_time: String(eventObj.event_time).slice(0, 5),
      reminder_at: toDateTimeLocal(eventObj.reminder_at),
    })
    setOpen(true)
  }

  const submitForm = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = toApiPayload(form)
      if (editingId) {
        await updateEvent(editingId, payload)
      } else {
        await createEvent(payload)
      }
      setOpen(false)
      await fetchEvents()
    } catch {
      setError('Erro ao salvar evento.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!editingId) return

    setLoading(true)
    setError('')

    try {
      await deleteEvent(editingId)
      setOpen(false)
      await fetchEvents()
    } catch {
      setError('Erro ao remover evento.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <PageHeader
        title="Calendario"
        description="Visualizacao mensal e semanal com lembretes de eventos."
        action={
          <button
            type="button"
            onClick={() => openCreate()}
            className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
          >
            Novo evento
          </button>
        }
      />

      {error && <p className="mb-4 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-white/60 bg-white p-4 shadow-soft">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={ptBrLocale}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek',
          }}
          events={calendarEvents}
          dateClick={(arg) => openCreate(arg.dateStr)}
          eventClick={(arg) => openEdit(arg.event.extendedProps)}
          height="auto"
        />
      </div>

      <Modal title={editingId ? 'Editar evento' : 'Novo evento'} isOpen={open} onClose={() => setOpen(false)}>
        <form onSubmit={submitForm} className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Titulo
            <input
              required
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Descricao
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Data
              <input
                type="date"
                required
                value={form.event_date}
                onChange={(e) => setForm((prev) => ({ ...prev, event_date: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Hora
              <input
                type="time"
                required
                value={form.event_time}
                onChange={(e) => setForm((prev) => ({ ...prev, event_time: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Lembrete (opcional)
            <input
              type="datetime-local"
              value={form.reminder_at}
              onChange={(e) => setForm((prev) => ({ ...prev, reminder_at: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            {editingId && (
              <button
                type="button"
                onClick={handleDelete}
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
