import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function StudentProfile() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", content: "" });

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        current_password: "",
        new_password: "",
        new_password_confirmation: ""
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || "",
                email: user.email || ""
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", content: "" });

        if (formData.new_password !== formData.new_password_confirmation) {
            setMessage({ type: "error", content: "Les nouveaux mots de passe ne correspondent pas" });
            setLoading(false);
            return;
        }

        try {
            await api.put('/user/password', {
                current_password: formData.current_password,
                new_password: formData.new_password,
                new_password_confirmation: formData.new_password_confirmation
            });

            setMessage({ type: "success", content: "Mot de passe modifié avec succès" });
            setFormData(prev => ({
                ...prev,
                current_password: "",
                new_password: "",
                new_password_confirmation: ""
            }));
        } catch (error) {
            console.error("Erreur changement mot de passe:", error);
            setMessage({ type: "error", content: error.response?.data?.message || "Erreur lors du changement de mot de passe" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>

                {message.content && (
                    <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-900/50 text-green-300 border border-green-800' : 'bg-red-900/50 text-red-300 border border-red-800'}`}>
                        {message.content}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Informations Personnelles */}
                    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
                        <h2 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-2">Informations Personnelles</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Nom complet</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    disabled
                                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            {/* Champs lecture seule spécifiques étudiant */}
                            {user?.student && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Matricule</label>
                                        <input
                                            type="text"
                                            value={user.student.matricule || ""}
                                            disabled
                                            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-400 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Filière</label>
                                        <input
                                            type="text"
                                            value={user.student.filiere || ""}
                                            disabled
                                            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-400 cursor-not-allowed"
                                        />
                                    </div>
                                </>
                            )}

                            <p className="text-xs text-gray-500 mt-4">
                                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Ces informations ne peuvent pas être modifiées. Contactez l'administration pour toute modification.
                            </p>
                        </div>
                    </div>

                    {/* Sécurité */}
                    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
                        <h2 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-2">Sécurité</h2>

                        <form onSubmit={handleChangePassword}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-400 mb-1">Mot de passe actuel</label>
                                <input
                                    type="password"
                                    name="current_password"
                                    value={formData.current_password}
                                    onChange={handleChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-400 mb-1">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    name="new_password"
                                    value={formData.new_password}
                                    onChange={handleChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-400 mb-1">Confirmer le nouveau mot de passe</label>
                                <input
                                    type="password"
                                    name="new_password_confirmation"
                                    value={formData.new_password_confirmation}
                                    onChange={handleChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors border border-gray-600"
                            >
                                {loading ? "Traitement..." : "Changer le mot de passe"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
