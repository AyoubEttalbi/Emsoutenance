import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-4">À propos d'EMSoutenance</h1>
        <p className="text-[#a0aec0] mb-8">
          EMSoutenance est une plateforme dédiée à la gestion des soutenances académiques:
          planification des sessions, gestion des jurys, suivi des rapports et tableaux de bord
          adaptés aux Administrateurs, Étudiants et Professeurs.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card glass p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Objectifs</h2>
            <p className="text-[#a0aec0]">
              Simplifier le processus de soutenance et offrir une expérience fluide
              à chaque acteur impliqué.
            </p>
          </div>
          <div className="card glass p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Fonctionnalités clés</h2>
            <ul className="list-disc pl-5 text-[#a0aec0]">
              <li>Gestion des utilisateurs et des rôles</li>
              <li>Planification intelligente des soutenances</li>
              <li>Suivi et validation des rapports</li>
              <li>Notifications et rappels</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}