"use client"
import { Link } from "react-router-dom"

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#0066ff] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div
          className="absolute top-40 right-10 w-72 h-72 bg-[#00d4ff] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-8 left-1/2 w-72 h-72 bg-[#ff6b35] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
         

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            École Marocaine des <span className="gradient-text">Sciences de l'Ingénieur</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#a0aec0] mb-8 max-w-2xl mx-auto leading-relaxed">
            Plateforme de gestion des soutenances de PFE et stages d'été. Un outil complet pour les étudiants, 
            professeurs et administrateurs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="relative group">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#0066ff] to-[#00d4ff] opacity-60 blur-xl animate-pulse-ring" />
              <Link to="/login" className="btn-primary relative inline-block">
                <span className="relative z-10">Se connecter</span>
              </Link>
            </div>
            <Link to="/about" className="btn-secondary hover:shadow-[0_8px_32px_rgba(0,102,255,0.25)] inline-block">
              En savoir plus
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-16">
            <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="text-3xl sm:text-4xl font-bold gradient-text">3000+</div>
              <div className="text-sm text-[#a0aec0] mt-2">Étudiants formés</div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <div className="text-3xl sm:text-4xl font-bold gradient-text">1985</div>
              <div className="text-sm text-[#a0aec0] mt-2">Année de création</div>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <div className="text-3xl sm:text-4xl font-bold gradient-text">6</div>
              <div className="text-sm text-[#a0aec0] mt-2">Campus au Maroc</div>
            </div>
          </div>
          
          {/* École Photos Section */}
          
        </div>
      </div>
    </section>
  )
}
