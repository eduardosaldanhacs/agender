import client from './client'

export async function listEvents(params = {}) {
  const { data } = await client.get('/events', { params })
  return data
}

export async function createEvent(payload) {
  const { data } = await client.post('/events', payload)
  return data
}

export async function updateEvent(id, payload) {
  const { data } = await client.put(`/events/${id}`, payload)
  return data
}

export async function deleteEvent(id) {
  const { data } = await client.delete(`/events/${id}`)
  return data
}
