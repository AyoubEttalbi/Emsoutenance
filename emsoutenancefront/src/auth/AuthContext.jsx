import { createContext, useContext, useMemo, useState, useEffect } from "react"
import { Navigate, useLocation } from "react-router-dom"
import api from "../services/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const logout = async () => {
    try {
      // call l'API de déconnexion si l'utilisateur est connecté
      const token = localStorage.getItem('access_token')
      if (token) {
        await api.post('/logout')
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      // Nettoyer le localStorage dans tous les cas
      setUser(null)
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
    }
  }

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token')
      const storedUser = localStorage.getItem('user')
      
      if (token && storedUser) {
        try {
          // Vérifier si le token est toujours valide en récupérant les infos utilisateur
          const response = await api.get('/user')
          setUser(response.data)
          localStorage.setItem('user', JSON.stringify(response.data))
        } catch (error) {
          // Token invalide, déconnecter l'utilisateur
          setUser(null)
          localStorage.removeItem('access_token')
          localStorage.removeItem('user')
        }
      }
      setLoading(false)
    }
    
    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', {
        email,
        password
      })

      const { access_token, user: userData } = response.data

      // Stocker le token et les données utilisateur
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user', JSON.stringify(userData))
      
      setUser(userData)
      return true
    } catch (error) {
      console.error('Erreur de connexion:', error)
      throw error
    }
  }

  const value = useMemo(() => ({ user, login, logout, loading }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
