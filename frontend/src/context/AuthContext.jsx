import { createContext, useContext, useState, useEffect } from 'react'
import { login as loginApi, register as registerApi, logout as logoutApi, getMe } from '../api/auth'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        setToken(storedToken)
        try {
          const res = await getMe()
          setUser(res.data)
        } catch {
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }
    restoreSession()
  }, [])

  const login = async (data) => {
    const response = await loginApi(data)
    const newToken = response.token
    const userData = response.data
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
    return response
  }

  const register = async (data) => {
    const response = await registerApi(data)
    const newToken = response.token
    const userData = response.data
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
    return response
  }

  const logout = async () => {
    try {
      await logoutApi(token)
    } catch {
    } finally {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
