import { BellIcon, CalendarIcon, ChartIcon, ClipboardIcon, FolderIcon, UsersIcon } from "./icons/ModernIcons"

export default function Features() {
  const features = [
    {
      icon: ClipboardIcon,
      accent: "text-sky-400",
      title: "Gestion Complète",
      description: "Administrez étudiants, professeurs et jurys en un seul endroit",
    },
    {
      icon: CalendarIcon,
      accent: "text-purple-400",
      title: "Planification Intelligente",
      description: "Planifiez automatiquement les soutenances selon les disponibilités",
    },
    {
      icon: ChartIcon,
      accent: "text-emerald-400",
      title: "Tableaux de Bord",
      description: "Visualisez l'état global des soutenances en temps réel",
    },
    {
      icon: BellIcon,
      accent: "text-amber-300",
      title: "Notifications",
      description: "Alertes automatiques pour tous les acteurs du processus",
    },
    {
      icon: FolderIcon,
      accent: "text-blue-300",
      title: "Gestion des Rapports",
      description: "Dépôt, validation et suivi des rapports de stage",
    },
    {
      icon: UsersIcon,
      accent: "text-pink-300",
      title: "Rôles Multiples",
      description: "Interfaces adaptées pour Admin, Étudiants et Professeurs",
    },
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Fonctionnalités <span className="gradient-text">Puissantes</span>
          </h2>
          <p className="text-[#a0aec0] text-lg max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour gérer efficacement vos soutenances académiques
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card animate-fade-in-up glass-hover group transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,102,255,0.15)]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`mb-4 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform ${feature.accent}`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-[#a0aec0]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
