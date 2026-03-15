// context/AuthContext.jsx — Global authentication state
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // Fetch current user profile on app load if token exists
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token')
      if (!savedToken) {
        setLoading(false)
        return
      }
      try {
        const data = await authService.getProfile()
        setUser(data.user)
      } catch {
        // Token invalid or expired — clear it
        localStorage.removeItem('token')
        setToken(null)
      } finally {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials)
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  const signup = useCallback(async (credentials) => {
    const data = await authService.signup(credentials)
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for convenient access
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
