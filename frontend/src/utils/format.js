export function currency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0))
}

function extractDatePart(value) {
  if (!value) return ''
  const raw = String(value)
  return raw.includes('T') ? raw.slice(0, 10) : raw.slice(0, 10)
}

export function formatDateBR(value) {
  const datePart = extractDatePart(value)
  if (!datePart || !datePart.includes('-')) return ''

  const [year, month, day] = datePart.split('-')
  if (!year || !month || !day) return ''

  return `${day}/${month}/${year}`
}

export function formatTimeShort(value) {
  if (!value) return ''
  return String(value).slice(0, 5)
}

export function toDateInput(value) {
  if (!value) return ''
  const date = new Date(value)
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function toDateTimeLocal(value) {
  if (!value) return ''
  const date = new Date(value)
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  const h = `${date.getHours()}`.padStart(2, '0')
  const min = `${date.getMinutes()}`.padStart(2, '0')
  return `${y}-${m}-${d}T${h}:${min}`
}

export function toEventDateTime(date, time) {
  if (!date) return ''

  const datePart = String(date).includes('T') ? String(date).slice(0, 10) : String(date)
  const timePart = String(time || '00:00').slice(0, 5)

  return `${datePart}T${timePart}:00`
}
