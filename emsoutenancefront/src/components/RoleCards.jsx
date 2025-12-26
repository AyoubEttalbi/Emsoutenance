import { useNavigate } from "react-router-dom"
import { ProfessorBoardIcon, ShieldIcon, StudentCapIcon } from "./icons/ModernIcons"

export default function RoleCards() {
  const navigate = useNavigate()

  const roles = [
    {
      title: "Administrateur",
      icon: ShieldIcon,
      color: "from-[#0066ff] to-[#0052cc]",
      features: ["Gestion des utilisateurs", "Affectation des jurys", "Planification", "Rapports"],
      delay: "0s",
      loginPath: "/login/admin",
    },
    {
      title: "Étudiant",
      icon: StudentCapIcon,
      color: "from-[#00d4ff] to-[#0099cc]",
      features: ["Dépôt de rapport", "Suivi de soutenance", "Consultation jury", "Notifications"],
      delay: "0.2s",
      loginPath: "/login/student",
    },
    {
      title: "Professeur",
      icon: ProfessorBoardIcon,
      color: "from-[#ff6b35] to-[#ff4500]",
      features: ["Consultation dossiers", "Ajout remarques", "Validation", "Planning"],
      delay: "0.4s",
      loginPath: "/login/professor",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Trois <span className="gradient-text">Rôles</span> Distincts
          </h2>
          <p className="text-[#a0aec0] text-lg">Une interface adaptée à chaque profil utilisateur</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <div key={index} className="animate-fade-in-up" style={{ animationDelay: role.delay }}>
              <div
                className={`bg-gradient-to-br ${role.color} p-8 rounded-2xl text-white card glass-hover group cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.25)]`}
              >
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 text-white group-hover:scale-110 transition-transform">
                  <role.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{role.title}</h3>
                <ul className="space-y-2 mb-6">
                  {role.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm opacity-90">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate(role.loginPath)}
                  className="w-full bg-white text-gray-900 font-semibold py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Accéder
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
