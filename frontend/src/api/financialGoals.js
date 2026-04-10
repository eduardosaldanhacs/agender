import client from './client'

export async function listFinancialGoals() {
  const { data } = await client.get('/financial-goals')
  return data
}

export async function createFinancialGoal(payload) {
  const { data } = await client.post('/financial-goals', payload)
  return data
}

export async function updateFinancialGoal(id, payload) {
  const { data } = await client.put(`/financial-goals/${id}`, payload)
  return data
}

export async function deleteFinancialGoal(id) {
  const { data } = await client.delete(`/financial-goals/${id}`)
  return data
}
