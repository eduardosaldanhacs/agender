import client from './client'

export async function listTransactions(params = {}) {
  const { data } = await client.get('/transactions', { params })
  return data
}

export async function createTransaction(payload) {
  const { data } = await client.post('/transactions', payload)
  return data
}

export async function updateTransaction(id, payload) {
  const { data } = await client.put(`/transactions/${id}`, payload)
  return data
}

export async function deleteTransaction(id) {
  const { data } = await client.delete(`/transactions/${id}`)
  return data
}
