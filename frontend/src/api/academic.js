import client from './client'

export async function listDisciplinas() {
  const { data } = await client.get('/disciplinas')
  return data
}

export async function listDisciplinasDisponiveis() {
  const { data } = await client.get('/disciplinas/disponiveis')
  return data
}

export async function updateDisciplinaStatus(payload) {
  const { data } = await client.post('/disciplinas/status', payload)
  return data
}

export async function getAcademicProgress() {
  const { data } = await client.get('/disciplinas/progresso')
  return data
}

export async function getDisciplinasLiberadas(id) {
  const { data } = await client.get(`/disciplinas/liberadas/${id}`)
  return data
}
