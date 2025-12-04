import { useState, useEffect } from 'react'
import AuthContext from './authCore'

export default function AuthProvider({ children }) {
  const [role, setRoleState] = useState(null)
  const [token, setTokenState] = useState(null)
  const [user, setUserState] = useState(null)

  useEffect(() => {
    try {
      const storedRole = localStorage.getItem('role')
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      if (storedRole) setRoleState(storedRole)
      if (storedToken) setTokenState(storedToken)
      if (storedUser) setUserState(JSON.parse(storedUser))
    } catch {
      /* ignore */
    }
  }, [])

  const setRole = (newRole) => {
    setRoleState(newRole)
    try {
      if (newRole) localStorage.setItem('role', newRole)
      else localStorage.removeItem('role')
    } catch {
      /* ignore */
    }
  }

  const setToken = (newToken) => {
    setTokenState(newToken)
    try {
      if (newToken) localStorage.setItem('token', newToken)
      else localStorage.removeItem('token')
    } catch { /* ignore */ }
  }

  const setUser = (newUser) => {
    setUserState(newUser)
    try {
      if (newUser) localStorage.setItem('user', JSON.stringify(newUser))
      else localStorage.removeItem('user')
    } catch { /* ignore */ }
  }

  return (
    <AuthContext.Provider value={{ role, setRole, token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
