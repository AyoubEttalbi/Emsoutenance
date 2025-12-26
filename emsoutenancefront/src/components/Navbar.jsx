"use client"

import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const userMenuRef = useRef(null)

  // Fermer le menu utilisateur quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  // Obtenir les initiales du nom
  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Obtenir le nom du rôle en français
  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Administrateur"
      case "student":
        return "Étudiant"
      case "professor":
        return "Professeur"
      default:
        return "Utilisateur"
    }
  }

  // Obtenir la couleur du badge selon le rôle
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "student":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "professor":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate("/")
    setIsOpen(false)
  }

  // Get role-specific home route
  const getHomeRoute = () => {
    if (!user) return "/"
    switch (user.role) {
      case "admin":
        return "/admin"
      case "student":
        return "/student"
      case "professor":
        return "/professor"
      default:
        return "/"
    }
  }

  // Get role-specific links
  const getRoleLinks = () => {
    if (!user) return null

    switch (user.role) {
      case "admin":
        return (
          <>
            <Link to="/admin" className="text-[#a0aec0] hover:text-white transition-colors">
              Tableau de bord
            </Link>
            <Link to="/admin/students" className="text-[#a0aec0] hover:text-white transition-colors">
              Étudiants
            </Link>
            <Link to="/admin/professors" className="text-[#a0aec0] hover:text-white transition-colors">
              Professeurs
            </Link>
            <Link to="/admin/schedule" className="text-[#a0aec0] hover:text-white transition-colors">
              Planification
            </Link>
          </>
        )
      case "student":
        return (
          <>
            <Link to="/student" className="text-[#a0aec0] hover:text-white transition-colors">
              Tableau de bord
            </Link>
            <Link to="/student/report" className="text-[#a0aec0] hover:text-white transition-colors">
              Mon rapport
            </Link>
          </>
        )
      case "professor":
        return (
          <>
            <Link to="/professor" className="text-[#a0aec0] hover:text-white transition-colors">
              Tableau de bord
            </Link>
            <Link to="/professor/reports" className="text-[#a0aec0] hover:text-white transition-colors">
              Rapports
            </Link>
          </>
        )
      default:
        return null
    }
  }

  return (
    <nav className="glass sticky top-0 z-50 border-b border-[#2d3748]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={getHomeRoute()} className="flex items-center gap-2 cursor-pointer animate-fade-in-up">
            <img
              src="/emsi-logo.png"
              alt="EMSI"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = "/placeholder-logo.png"
              }}
            />
            <span className="text-xl font-bold gradient-text hidden sm:inline">EMSoutenance</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                {/* Liens spécifiques au rôle */}
                {getRoleLinks()}
                {/* Menu utilisateur avec dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors group"
                  >
                    {/* Avatar avec initiales */}
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00d4aa] to-[#0a0e27] flex items-center justify-center text-white font-semibold text-sm border-2 border-[#00d4aa]/30">
                        {getInitials(user.name)}
                      </div>
                    </div>
                    {/* Nom et rôle */}
                    <div className="flex flex-col items-start">
                      <span className="text-white text-sm font-medium">
                        {user.name || "Utilisateur"}
                      </span>
                      <span className={`text-xs ${user.role === "admin" ? "text-red-400" : user.role === "student" ? "text-blue-400" : "text-purple-400"}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </div>
                    {/* Icône chevron */}
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50 animate-fade-in-up">
                      {/* En-tête */}
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-sm font-medium text-white">{user.name || "Utilisateur"}</p>
                        <p className="text-[10px] text-gray-400 mt-1 truncate" title={user.email}>{user.email}</p>
                        <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${getRoleBadgeColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </div>

                      {/* Options du menu */}
                      <div className="py-2">
                        {user.role !== "admin" && (
                          <Link
                            to={user.role === "student" ? "/student/profile" : "/professor/profile"}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Mon profil
                          </Link>
                        )}
                        {user.role === "admin" && (
                          <Link
                            to="/admin/settings"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Paramètres
                          </Link>
                        )}
                      </div>

                      {/* Séparateur */}
                      <div className="border-t border-gray-700"></div>

                      {/* Déconnexion */}
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          handleLogout()
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Liens publics visibles avant connexion */}
                <Link to="/" className="text-[#a0aec0] hover:text-white transition-colors">
                  Accueil
                </Link>
                <Link to="/about" className="text-[#a0aec0] hover:text-white transition-colors">
                  À propos
                </Link>
                <Link to="/guide" className="text-[#a0aec0] hover:text-white transition-colors">
                  Guide
                </Link>
                <Link to="/contact" className="text-[#a0aec0] hover:text-white transition-colors">
                  Contact
                </Link>

                <Link to="/login" className="btn-primary relative overflow-hidden">
                  <span className="relative z-10">Se connecter</span>
                  <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fade-in-up">
            {user ? (
              <>
                {/* Liens spécifiques au rôle */}
                <div className="space-y-2">
                  {user.role === "admin" && (
                    <>
                      <Link to="/admin" className="block w-full px-4 py-2 text-[#a0aec0] hover:text-white" onClick={() => setIsOpen(false)}>
                        Tableau de bord
                      </Link>
                      <Link to="/admin/students" className="block w-full px-4 py-2 text-[#a0aec0] hover:text-white" onClick={() => setIsOpen(false)}>
                        Étudiants
                      </Link>
                      <Link to="/admin/professors" className="block w-full px-4 py-2 text-[#a0aec0] hover:text-white" onClick={() => setIsOpen(false)}>
                        Professeurs
                      </Link>
                      <Link to="/admin/schedule" className="block w-full px-4 py-2 text-[#a0aec0] hover:text-white" onClick={() => setIsOpen(false)}>
                        Planification
                      </Link>
                    </>
                  )}
                  {user.role === "student" && (
                    <>
                      <Link to="/student" className="block w-full px-4 py-2 text-[#a0aec0] hover:text-white" onClick={() => setIsOpen(false)}>
                        Tableau de bord
                      </Link>
                      <Link to="/student/report" className="block w-full px-4 py-2 text-[#a0aec0] hover:text-white" onClick={() => setIsOpen(false)}>
                        Mon rapport
                      </Link>
                    </>
                  )}
                  {user.role === "professor" && (
                    <>
                      <Link to="/professor" className="block w-full px-4 py-2 text-[#a0aec0] hover:text-white" onClick={() => setIsOpen(false)}>
                        Tableau de bord
                      </Link>
                      <Link to="/professor/reports" className="block w-full px-4 py-2 text-[#a0aec0] hover:text-white" onClick={() => setIsOpen(false)}>
                        Rapports
                      </Link>
                    </>
                  )}
                </div>
                {/* Informations utilisateur mobile */}
                <div className="px-4 py-3 border-t border-gray-700 mt-2 pt-3">
                  <div className="flex items-center gap-3 mb-3">
                    {/* Avatar avec initiales */}
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00d4aa] to-[#0a0e27] flex items-center justify-center text-white font-semibold text-sm border-2 border-[#00d4aa]/30">
                        {getInitials(user.name)}
                      </div>
                    </div>
                    {/* Nom et rôle */}
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{user.name || "Utilisateur"}</p>
                      <p className={`text-xs ${user.role === "admin" ? "text-red-400" : user.role === "student" ? "text-blue-400" : "text-purple-400"}`}>
                        {getRoleLabel(user.role)}
                      </p>
                    </div>
                  </div>
                  {user.role !== "admin" && (
                    <Link
                      to={user.role === "student" ? "/student/profile" : "/professor/profile"}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors mb-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Mon profil
                    </Link>
                  )}
                  {user.role === "admin" && (
                    <Link
                      to="/admin/settings"
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors mb-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Paramètres
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      handleLogout()
                    }}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 rounded transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Liens publics */}
                <Link to="/" className="block w-full px-4 py-2 text-[#a0aec0] hover:text-white" onClick={() => setIsOpen(false)}>
                  Accueil
                </Link>
                <Link to="/about" className="block w-full px-4 py-2 text-[#a0aec0] hover:text-white" onClick={() => setIsOpen(false)}>
                  À propos
                </Link>
                <Link to="/guide" className="block w-full px-4 py-2 text-[#a0aec0] hover:text-white" onClick={() => setIsOpen(false)}>
                  Guide
                </Link>
                <Link to="/contact" className="block w-full px-4 py-2 text-[#a0aec0] hover:text-white" onClick={() => setIsOpen(false)}>
                  Contact
                </Link>
                <Link to="/login" className="w-full inline-block btn-primary mt-2" onClick={() => setIsOpen(false)}>
                  Se connecter
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
