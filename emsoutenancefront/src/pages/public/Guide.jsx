import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

export default function Guide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-4">Guide & Aide</h1>
        <p className="text-[#a0aec0] mb-8">
          Cette section vous aide à prendre en main la plateforme EMSoutenance.
        </p>
        <div className="space-y-6">
          <section className="card glass p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Étudiants</h2>
            <ul className="list-disc pl-5 text-[#a0aec0]">
              <li>Créez un compte et connectez-vous</li>
              <li>Déposez votre rapport dans l'espace dédié</li>
              <li>Suivez le statut et les retours du jury</li>
            </ul>
          </section>
          <section className="card glass p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Professeurs</h2>
            <ul className="list-disc pl-5 text-[#a0aec0]">
              <li>Consultez les rapports attribués</li>
              <li>Ajoutez des remarques et validez les rapports</li>
              <li>Visualisez le calendrier des soutenances</li>
            </ul>
          </section>
          <section className="card glass p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Administrateurs</h2>
            <ul className="list-disc pl-5 text-[#a0aec0]">
              <li>Gérez les étudiants et les jurys</li>
              <li>Planifiez les soutenances</li>
              <li>Suivez les indicateurs de réussite</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}