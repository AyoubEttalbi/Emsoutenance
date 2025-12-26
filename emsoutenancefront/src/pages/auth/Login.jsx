import { useNavigate, useLocation } from "react-router-dom"
import { Link } from "react-router-dom"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

export default function Login() {
  const navigate = useNavigate()
  
  const handleRoleSelection = (role) => {
    if (role === "admin") navigate("/login/admin", { replace: true })
    else if (role === "student") navigate("/login/student", { replace: true })
    else if (role === "professor") navigate("/login/professor", { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="card glass p-8 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Gestion des Soutenances de Stages</h1>
          <p className="text-[#a0aec0] mb-8 text-center">Connectez-vous pour accéder à votre espace.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="btn-primary py-4 rounded-lg shadow-md hover:shadow-lg transition-all" onClick={() => handleRoleSelection("admin")}>
              <div className="flex flex-col items-center">
                <span className="text-xl mb-2">Administrateur</span>
                <span className="text-sm text-gray-300">Gestion des soutenances</span>
              </div>
            </button>
            <button className="btn-primary py-4 rounded-lg shadow-md hover:shadow-lg transition-all" onClick={() => handleRoleSelection("student")}>
              <div className="flex flex-col items-center">
                <span className="text-xl mb-2">Étudiant</span>
                <span className="text-sm text-gray-300">Dépôt de rapports</span>
              </div>
            </button>
            <button className="btn-primary py-4 rounded-lg shadow-md hover:shadow-lg transition-all" onClick={() => handleRoleSelection("professor")}>
              <div className="flex flex-col items-center">
                <span className="text-xl mb-2">Professeur</span>
                <span className="text-sm text-gray-300">Encadrement & Jury</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
