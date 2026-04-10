import client from './client'

export async function listNotes() {
  const { data } = await client.get('/notes')
  return data
}

export async function createNote(payload) {
  const { data } = await client.post('/notes', payload)
  return data
}

export async function updateNote(id, payload) {
  const { data } = await client.put(`/notes/${id}`, payload)
  return data
}

export async function deleteNote(id) {
  const { data } = await client.delete(`/notes/${id}`)
  return data
}
