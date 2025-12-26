import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { CalendarIcon } from "../../components/icons/ModernIcons";

export default function ProfessorDefenses() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [defenses, setDefenses] = useState([]);
  const [filter, setFilter] = useState("all"); // all, upcoming, past

  useEffect(() => {
    fetchDefenses();
  }, []);

  const fetchDefenses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/professors/defenses');
      const allDefenses = response.data || [];
      setDefenses(allDefenses);
    } catch (error) {
      console.error('Erreur lors du chargement des soutenances:', error);
      alert('Erreur lors du chargement des soutenances');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (defense) => {
    const juryMembers = defense.jury_members || [];
    const currentUserEmail = user?.email;
    
    const juryMember = juryMembers.find(jm => jm.professor?.user?.email === currentUserEmail);
    if (!juryMember) return null;
    
    const role = juryMember.role;
    const colors = {
      encadrant: 'bg-blue-800 text-blue-300',
      rapporteur: 'bg-yellow-800 text-yellow-300',
      examinateur: 'bg-green-800 text-green-300',
      president: 'bg-red-800 text-red-300'
    };
    
    const labels = {
      encadrant: 'Encadrant',
      rapporteur: 'Rapporteur',
      examinateur: 'Examinateur',
      president: 'Président'
    };
    
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[role] || 'bg-gray-800 text-gray-300'}`}>
        {labels[role] || role}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const badges = {
      'scheduled': 'bg-blue-900 text-blue-300',
      'completed': 'bg-green-900 text-green-300',
      'cancelled': 'bg-red-900 text-red-300'
    };
    return badges[status] || 'bg-gray-700 text-gray-300';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'scheduled': 'Planifiée',
      'completed': 'Terminée',
      'cancelled': 'Annulée'
    };
    return labels[status] || status;
  };

  const filteredDefenses = defenses.filter(defense => {
    if (filter === "all") return true;
    
    const defenseDate = new Date(defense.scheduled_at);
    const now = new Date();
    
    if (filter === "upcoming") {
      return defenseDate >= now;
    }
    if (filter === "past") {
      return defenseDate < now;
    }
    return true;
  });

  // Trier par date
  const sortedDefenses = [...filteredDefenses].sort((a, b) => {
    return new Date(a.scheduled_at) - new Date(b.scheduled_at);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Planning des Soutenances</h1>
            <p className="text-gray-400">Consultez vos participations aux jurys de soutenance</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded transition-colors ${
                filter === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-4 py-2 rounded transition-colors ${
                filter === "upcoming" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              À venir
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`px-4 py-2 rounded transition-colors ${
                filter === "past" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Passées
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-400">Chargement des soutenances...</p>
          </div>
        ) : sortedDefenses.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <CalendarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aucune soutenance trouvée</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Étudiant</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Heure</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Salle</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Votre rôle</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Statut</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Jury</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {sortedDefenses.map((defense) => {
                  const scheduledDate = new Date(defense.scheduled_at);
                  return (
                    <tr key={defense.id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{defense.student?.user?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-400">{defense.student?.matricule || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {scheduledDate.toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {scheduledDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{defense.salle || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getRoleBadge(defense) || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(defense.status)}`}>
                          {getStatusLabel(defense.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="space-y-1">
                          {defense.jury_members?.map((member, index) => (
                            <div key={index} className="text-xs text-gray-400">
                              {member.professor?.user?.name} ({member.role})
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}



