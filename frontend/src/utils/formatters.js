export const currency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0))
}

export const toDateInput = (value) => {
  if (!value) return ''
  return new Date(value).toISOString().slice(0, 10)
}

export const toMonthLabel = (value) => {
  const [year, month] = String(value).split('-')
  return `${month}/${year}`
}
