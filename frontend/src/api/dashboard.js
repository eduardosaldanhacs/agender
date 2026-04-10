import client from './client'

export async function getDashboard(params = {}) {
  const { data } = await client.get('/dashboard', { params })
  return data
}
