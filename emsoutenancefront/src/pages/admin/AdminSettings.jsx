import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";
import api from "../../services/api";

export default function AdminSettings() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile"); // profile, password

  // Profil
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  // Mot de passe
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.put("/profile", profileData);
      
      // Mettre à jour le localStorage avec les nouvelles données
      const updatedUser = { ...user, ...response.data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setSuccess("Profil mis à jour avec succès");
      
      // Recharger la page pour mettre à jour le contexte
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat().join(", ");
        setError(errors);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur lors de la mise à jour du profil");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      await api.post("/change-password", {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation,
      });

      setSuccess("Mot de passe modifié avec succès");
      
      // Réinitialiser le formulaire
      setPasswordData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat().join(", ");
        setError(errors);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur lors du changement de mot de passe");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white">
      <Navbar />
      <AdminSidebar />
      <main className="md:ml-64 pt-4 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-lg p-6 mb-8 shadow-xl">
            <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
            <p className="text-gray-300">Gérez votre profil et vos préférences</p>
          </div>

          {/* Tabs */}
          <div className="bg-gray-800 rounded-lg mb-6 overflow-hidden">
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === "profile"
                    ? "bg-gradient-to-r from-[#00d4aa]/20 to-transparent text-[#00d4aa] border-b-2 border-[#00d4aa]"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profil
                </div>
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === "password"
                    ? "bg-gradient-to-r from-[#00d4aa]/20 to-transparent text-[#00d4aa] border-b-2 border-[#00d4aa]"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Mot de passe
                </div>
              </button>
            </div>
          </div>

          {/* Messages de succès/erreur */}
          {success && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-300">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {success}
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Contenu du profil */}
          {activeTab === "profile" && (
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-2xl font-semibold mb-6">Informations du profil</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Mise à jour..." : "Mettre à jour le profil"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Contenu du mot de passe */}
          {activeTab === "password" && (
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-2xl font-semibold mb-6">Changer le mot de passe</h2>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent"
                    value={passwordData.current_password}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        current_password: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent"
                    value={passwordData.new_password}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        new_password: e.target.value,
                      })
                    }
                    required
                    minLength={8}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Le mot de passe doit contenir au moins 8 caractères
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent"
                    value={passwordData.new_password_confirmation}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        new_password_confirmation: e.target.value,
                      })
                    }
                    required
                    minLength={8}
                  />
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Changement..." : "Changer le mot de passe"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Informations supplémentaires */}
          <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Informations de compte</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Rôle</p>
                <p className="text-white font-medium mt-1">
                  <span className="px-3 py-1 bg-red-900 text-red-300 rounded text-sm font-semibold">
                    Administrateur
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Date de création</p>
                <p className="text-white font-medium mt-1">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString("fr-FR")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}





