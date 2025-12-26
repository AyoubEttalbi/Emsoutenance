import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api", /* Configuration de l’URL de base de l’API */
})


api.interceptors.request.use((config) => { /*Un interceptor permet de modifier automatiquement chaque requête avant qu’elle soit envoyée.*/

  const token = localStorage.getItem("access_token") /* Ajout du token d’authentification*/
  if (token) {
    config.headers.Authorization = `Bearer ${token}` /* Si le token existe, on l’ajoute dans le header HTTP */
  }
  return config
})

// Intercepteur pour gérer les erreurs de manière globale
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response } = error
    if (response && response.status === 401) {
      // Si on reçoit une erreur 401 (Non autorisé), c'est que le token est expiré ou invalide
      // On déconnecte l'utilisateur proprement
      localStorage.removeItem("access_token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api
