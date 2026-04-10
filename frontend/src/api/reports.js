import client from './client'

export async function getReports(params = {}) {
  const { data } = await client.get('/reports', { params })
  return data
}
