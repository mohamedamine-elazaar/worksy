import { useState, useEffect } from 'react'
import AuthContext from './authCore'

export default function AuthProvider({ children }) {
  const [role, setRoleState] = useState(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('role')
      if (stored) setRoleState(stored)
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

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  )
}
