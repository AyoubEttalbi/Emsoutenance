import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function ProfessorHome() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    encadrant: 0,
    rapporteur: 0,
    jury: 0,
    upcomingDefenses: 0
  });
  const [upcomingDefenses, setUpcomingDefenses] = useState([]);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les étudiants
      const studentsResponse = await api.get('/professors/students');
      const students = studentsResponse.data || [];
      
      // Compter les étudiants par rôle
      const encadrantCount = students.filter(s => s.relation_type === 'encadrant').length;
      const rapporteurCount = students.filter(s => s.relation_type === 'rapporteur').length;
      
      // Récupérer les rapports
      const reportsResponse = await api.get('/professors/reports');
      const reports = reportsResponse.data || [];
      const pendingReports = reports.filter(r => 
        r.status === 'pending' || r.status === 'validated'
      ).length;
      
      // Récupérer les soutenances
      const defensesResponse = await api.get('/professors/defenses');
      const defenses = defensesResponse.data || [];
      
      // Filtrer les soutenances à venir (7 prochains jours)
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const upcoming = defenses.filter(d => {
        const defenseDate = new Date(d.scheduled_at);
        return defenseDate >= now && defenseDate <= nextWeek;
      });
      
      // Compter les jurys (examinateur + président)
      const juryCount = defenses.length;
      
      setStats({
        encadrant: encadrantCount,
        rapporteur: pendingReports,
        jury: juryCount,
        upcomingDefenses: upcoming.length
      });
      
      setUpcomingDefenses(upcoming.slice(0, 5)); // Limiter à 5
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (defense) => {
    // Le backend retourne juryMembers avec professor.user
    const juryMembers = defense.jury_members || [];
    const currentUserEmail = user?.email;
    
    // Trouver le membre du jury correspondant au professeur connecté
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

  // Le JSX est entièrement contenu dans la fonction ProfessorHome
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">Espace Professeur</h1>
        <p className="text-gray-300 text-xl">Bienvenue, {user?.name || "Professeur"}</p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Chargement des données...</p>
        </div>
      ) : (
        <>
          {/* Statistiques - (Version mise à jour) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 text-center shadow-lg hover:bg-gray-700 transition-colors">
              <p className="text-4xl font-extrabold text-blue-400">{stats.encadrant}</p>
              <p className="text-gray-300 mt-2">Étudiants encadrés</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center shadow-lg hover:bg-gray-700 transition-colors">
              <p className="text-4xl font-extrabold text-yellow-400">{stats.rapporteur}</p>
              <p className="text-gray-300 mt-2">Rapports à évaluer</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center shadow-lg hover:bg-gray-700 transition-colors">
              <p className="text-4xl font-extrabold text-green-400">{stats.jury}</p>
              <p className="text-gray-300 mt-2">Jurys à participer</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center shadow-lg hover:bg-gray-700 transition-colors">
              <p className="text-4xl font-extrabold text-purple-400">{stats.upcomingDefenses}</p>
              <p className="text-gray-300 mt-2">Soutenances à venir (7j)</p>
            </div>
          </div>

          {/* Prochaines soutenances */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Vos prochaines soutenances</h2>
            {upcomingDefenses.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400">Aucune soutenance à venir dans les 7 prochains jours</p>
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 text-white">
                    {upcomingDefenses.map((defense) => {
                      const scheduledDate = new Date(defense.scheduled_at);
                      return (
                        <tr key={defense.id} className="hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {defense.student?.user?.name || 'N/A'}
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
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Menu des fonctionnalités - (Version mise à jour) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/professor/reports" className="bg-gray-800 hover:bg-gray-700 transition-all duration-300 rounded-lg p-6 flex flex-col items-center text-center border border-gray-700 hover:border-blue-500 transform hover:scale-[1.02]">
          <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mb-4 shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-white">Gestion des rapports</h3>
          <p className="text-gray-400">Consulter et évaluer les rapports des étudiants selon votre rôle (encadrant, rapporteur)</p>
        </Link>

        <Link to="/professor/defenses" className="bg-gray-800 hover:bg-gray-700 transition-all duration-300 rounded-lg p-6 flex flex-col items-center text-center border border-gray-700 hover:border-green-500 transform hover:scale-[1.02]">
          <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mb-4 shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-white">Planning des soutenances</h3>
          <p className="text-gray-400">Consulter le planning global des soutenances et vos participations aux jurys</p>
        </Link>
      </div>
    </div>
    </div>
  );
}