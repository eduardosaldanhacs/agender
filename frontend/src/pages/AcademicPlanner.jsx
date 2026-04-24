import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getAcademicProgress,
  getDisciplinasLiberadas,
  listDisciplinas,
  listDisciplinasDisponiveis,
  updateDisciplinaStatus,
} from '../api/academic'
import GradeCurricular from '../components/academic/GradeCurricular'
import ProgressBarCreditos from '../components/academic/ProgressBarCreditos'
import PageHeader from '../components/PageHeader'

const emptyProgress = {
  total_creditos: 0,
  creditos_concluidos: 0,
  creditos_restantes: 0,
  percentual_conclusao: 0,
  semestre_estimado_formatura: '-',
}

export default function AcademicPlanner() {
  const [disciplinas, setDisciplinas] = useState([])
  const [disponiveis, setDisponiveis] = useState([])
  const [progresso, setProgresso] = useState(emptyProgress)
  const [selectedFuture, setSelectedFuture] = useState([])
  const [liberadasMap, setLiberadasMap] = useState({})
  const [hoveredDisciplinaId, setHoveredDisciplinaId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [disciplinasData, disponiveisData, progressoData] = await Promise.all([
        listDisciplinas(),
        listDisciplinasDisponiveis(),
        getAcademicProgress(),
      ])
      setDisciplinas(disciplinasData)
      setDisponiveis(disponiveisData)
      setProgresso(progressoData)
    } catch {
      setError('Nao foi possivel carregar o planejamento academico.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const stats = useMemo(() => {
    return {
      disponiveis: disponiveis.length,
      bloqueadas: disciplinas.filter((disciplina) => (disciplina.status_usuario || 'bloqueada') === 'bloqueada' && !disciplina.liberada).length,
      concluidas: disciplinas.filter((disciplina) => disciplina.status_usuario === 'concluida').length,
    }
  }, [disciplinas, disponiveis])

  const onSelectFuture = (id, checked) => {
    setSelectedFuture((prev) => (checked ? [...new Set([...prev, id])] : prev.filter((item) => item !== id)))
  }

  const onLoadLiberadas = useCallback(async (id) => {
    if (liberadasMap[id]) {
      return
    }

    try {
      const data = await getDisciplinasLiberadas(id)
      setLiberadasMap((prev) => ({ ...prev, [id]: data }))
    } catch {
      // Mantem as dependencias diretas ja carregadas se o hover nao conseguir consultar a API.
    }
  }, [liberadasMap])

  const onHoverDisciplina = useCallback((disciplina) => {
    setHoveredDisciplinaId(disciplina.id)
    onLoadLiberadas(disciplina.id)
  }, [onLoadLiberadas])

  const highlightedIds = useMemo(() => {
    if (!hoveredDisciplinaId) {
      return []
    }

    const hoverDisciplina = disciplinas.find((disciplina) => disciplina.id === hoveredDisciplinaId)
    const liberadas = liberadasMap[hoveredDisciplinaId] || hoverDisciplina?.libera_disciplinas || []

    return liberadas.map((disciplina) => disciplina.id)
  }, [disciplinas, hoveredDisciplinaId, liberadasMap])

  const onStatusChange = async (disciplinaId, status) => {
    setBusy(true)
    setError('')
    setMessage('')

    try {
      await updateDisciplinaStatus({ disciplina_id: disciplinaId, status })
      setMessage('Status atualizado.')
      await loadData()
    } catch (err) {
      setError(err?.response?.data?.message || 'Nao foi possivel atualizar a disciplina.')
    } finally {
      setBusy(false)
    }
  }

  const planSelected = async () => {
    if (selectedFuture.length === 0) {
      setError('Selecione ao menos uma disciplina disponivel para planejar.')
      return
    }

    setBusy(true)
    setError('')
    setMessage('')

    try {
      for (const id of selectedFuture) {
        await updateDisciplinaStatus({ disciplina_id: id, status: 'planejada' })
      }
      setMessage('Disciplinas planejadas para o proximo semestre.')
      setSelectedFuture([])
      await loadData()
    } catch (err) {
      setError(err?.response?.data?.message || 'Uma das disciplinas selecionadas possui pre-requisitos pendentes.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section>
      <PageHeader
        title="Planejamento Academico"
        description="Acompanhe creditos, pre-requisitos e previsao de formatura."
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadData}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              Atualizar
            </button>
            <button
              type="button"
              onClick={planSelected}
              disabled={busy}
              className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800 disabled:opacity-70"
            >
              Planejar selecionadas
            </button>
          </div>
        }
      />

      {error && <p className="mb-4 rounded-lg bg-red-100 px-3 py-2 text-sm font-bold text-red-700">{error}</p>}
      {message && <p className="mb-4 rounded-lg bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-700">{message}</p>}

      <ProgressBarCreditos progresso={progresso} />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-sky-100 bg-sky-50 p-4 dark:border-sky-900 dark:bg-sky-950">
          <p className="text-2xl font-black text-sky-800 dark:text-sky-200">{stats.disponiveis}</p>
          <p className="text-sm font-bold text-sky-700 dark:text-sky-300">Disponiveis para matricula</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{stats.bloqueadas}</p>
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Bloqueadas</p>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950">
          <p className="text-2xl font-black text-emerald-800 dark:text-emerald-200">{stats.concluidas}</p>
          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Concluidas</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg border border-white/60 bg-white p-6 text-sm text-slate-500 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          Carregando grade curricular...
        </div>
      ) : (
        <GradeCurricular
          disciplinas={disciplinas}
          selectedFuture={selectedFuture}
          hoveredDisciplinaId={hoveredDisciplinaId}
          highlightedIds={highlightedIds}
          onSelectFuture={onSelectFuture}
          onStatusChange={onStatusChange}
          onHoverDisciplina={onHoverDisciplina}
          onClearHover={() => setHoveredDisciplinaId(null)}
          liberadasMap={liberadasMap}
          busy={busy}
        />
      )}
    </section>
  )
}
