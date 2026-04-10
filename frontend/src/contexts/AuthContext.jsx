import { useMemo, useState } from 'react'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('agender_token'))
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('agender_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = ({ token: nextToken, user: nextUser }) => {
    localStorage.setItem('agender_token', nextToken)
    localStorage.setItem('agender_user', JSON.stringify(nextUser))
    setToken(nextToken)
    setUser(nextUser)
  }

  const logout = () => {
    localStorage.removeItem('agender_token')
    localStorage.removeItem('agender_user')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
