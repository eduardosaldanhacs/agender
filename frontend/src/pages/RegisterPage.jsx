import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import AuthShell from '../components/AuthShell'
import { useAuth } from '../hooks/useAuth'

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const formatApiError = (err) => {
    if (!err?.response) {
      return 'Nao foi possivel conectar na API. Verifique se o backend esta rodando em http://127.0.0.1:8000.'
    }

    const responseData = err.response.data
    const validationErrors = responseData?.errors

    if (validationErrors && typeof validationErrors === 'object') {
      const firstFieldErrors = Object.values(validationErrors)[0]

      if (Array.isArray(firstFieldErrors) && firstFieldErrors.length > 0) {
        return firstFieldErrors[0]
      }
    }

    return responseData?.message ?? 'Nao foi possivel cadastrar.'
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await register(form)
      login({ token: data.token, user: data.user })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(formatApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Criar sua conta"
      subtitle="Comece a organizar compromissos, tarefas e dinheiro."
      footerLabel="Ja possui conta?"
      footerLink="/login"
      footerText="Fazer login"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Nome
          <input
            required
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-sky-500 transition focus:ring"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          E-mail
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-sky-500 transition focus:ring"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Senha
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-sky-500 transition focus:ring"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Confirmacao de senha
          <input
            type="password"
            required
            value={form.password_confirmation}
            onChange={(event) => updateField('password_confirmation', event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-sky-500 transition focus:ring"
          />
        </label>

        {error && <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-sky-700 px-4 py-2.5 font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Criando conta...' : 'Cadastrar'}
        </button>
      </form>
    </AuthShell>
  )
}
