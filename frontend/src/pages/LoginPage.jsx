import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, me } from '../api/auth'
import AuthShell from '../components/AuthShell'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login: persistLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await login({ email, password })

      const profile = await me().catch(() => data.user)

      persistLogin({ token: data.token, user: profile })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Nao foi possivel fazer login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Entrar na sua conta"
      subtitle="Gerencie agenda e financas em um unico painel."
      footerLabel="Nao tem conta?"
      footerLink="/cadastro"
      footerText="Criar agora"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          E-mail
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-sky-500 transition focus:ring"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Senha
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-sky-500 transition focus:ring"
          />
        </label>

        {error && <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-sky-700 px-4 py-2.5 font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </AuthShell>
  )
}
