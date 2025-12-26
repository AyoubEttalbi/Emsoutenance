import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";
import api from "../../services/api";
import { CalendarIcon, ProfessorBoardIcon, UsersIcon } from "../../components/icons/ModernIcons";

export default function AdminHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingReports: 0,
    scheduledDefenses: 0,
    upcomingDefenses: 0
  });
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Récupérer les statistiques
      const [studentsRes, reportsRes, defensesRes] = await Promise.all([
        api.get('/admin/students'),
        api.get('/admin/reports'),
        api.get('/admin/defenses')
      ]);

      const totalStudents = studentsRes.data.total || studentsRes.data.length || 0;
      const allReports = reportsRes.data.data || reportsRes.data || [];
      const allDefenses = defensesRes.data.data || defensesRes.data || [];

      const pendingReports = allReports.filter(r => r.status === 'pending' || r.status === 'need_correction').length;
      const scheduledDefenses = allDefenses.filter(d => d.status === 'scheduled').length;

      // Compter les soutenances à venir (dans les 7 prochains jours)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const upcomingDefenses = allDefenses.filter(d => {
        if (d.status !== 'scheduled' || !d.scheduled_at) return false;
        const defenseDate = new Date(d.scheduled_at);
        return defenseDate <= nextWeek && defenseDate >= new Date();
      }).length;

      setStats({
        totalStudents,
        pendingReports,
        scheduledDefenses,
        upcomingDefenses
      });

      // Récupérer les rapports récents (derniers 10)
      const recentReports = allReports
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10);
      setReports(recentReports);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateReport = async (reportId) => {
    try {
      await api.post(`/admin/reports/${reportId}/validate`);
      fetchDashboardData(); // Recharger les données
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      alert('Erreur lors de la validation du rapport');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { label: 'En attente', class: 'bg-yellow-900 text-yellow-300' },
      'validated': { label: 'Validé', class: 'bg-green-900 text-green-300' },
      'need_correction': { label: 'Correction nécessaire', class: 'bg-orange-900 text-orange-300' },
      'rejected': { label: 'Rejeté', class: 'bg-red-900 text-red-300' }
    };

    const statusInfo = statusMap[status] || { label: status, class: 'bg-gray-700 text-gray-300' };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white">
      <Navbar />
      <AdminSidebar />
      <main className="md:ml-64 pt-4 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-lg p-6 mb-8 shadow-xl">
          <h1 className="text-3xl font-bold mb-2">Tableau de bord administrateur</h1>
          <p className="text-gray-300 text-xl">Bienvenue, {user?.name || "Administrateur"}</p>
        </div>

        {/* Statistiques */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-400">Chargement des statistiques...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 text-center shadow-lg hover:bg-gray-700 transition-colors">
              <p className="text-4xl font-extrabold text-blue-400">{stats.totalStudents}</p>
              <p className="text-gray-300 mt-2">Étudiants inscrits</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center shadow-lg hover:bg-gray-700 transition-colors">
              <p className="text-4xl font-extrabold text-yellow-400">{stats.pendingReports}</p>
              <p className="text-gray-300 mt-2">Rapports en attente</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center shadow-lg hover:bg-gray-700 transition-colors">
              <p className="text-4xl font-extrabold text-green-400">{stats.scheduledDefenses}</p>
              <p className="text-gray-300 mt-2">Soutenances planifiées</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 text-center shadow-lg hover:bg-gray-700 transition-colors">
              <p className="text-4xl font-extrabold text-purple-400">{stats.upcomingDefenses}</p>
              <p className="text-gray-300 mt-2">Soutenances à venir (7jrs)</p>
            </div>
          </div>
        )}

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/admin/students" className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all border border-gray-700 hover:border-blue-500 transform hover:scale-[1.01]">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <span className="mr-2">
                <UsersIcon className="w-6 h-6 text-blue-400" />
              </span>
              Gestion des étudiants
            </h2>
            <p className="text-gray-400 mb-4">Gérer les informations des étudiants, assigner des encadrants et rapporteurs</p>
            <div className="flex justify-end">
              <span className="text-blue-400 font-medium">Accéder →</span>
            </div>
          </Link>
          <Link to="/admin/professors" className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all border border-gray-700 hover:border-green-500 transform hover:scale-[1.01]">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <span className="mr-2">
                <ProfessorBoardIcon className="w-6 h-6 text-green-400" />
              </span>
              Gestion des professeurs
            </h2>
            <p className="text-gray-400 mb-4">Gérer les informations des professeurs et leurs rôles</p>
            <div className="flex justify-end">
              <span className="text-blue-400 font-medium">Accéder →</span>
            </div>
          </Link>
          <Link to="/admin/schedule" className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all border border-gray-700 hover:border-purple-500 transform hover:scale-[1.01]">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <span className="mr-2">
                <CalendarIcon className="w-6 h-6 text-purple-400" />
              </span>
              Planification des soutenances
            </h2>
            <p className="text-gray-400 mb-4">Organiser les soutenances, assigner les jurys et les salles</p>
            <div className="flex justify-end">
              <span className="text-blue-400 font-medium">Accéder →</span>
            </div>
          </Link>
          <Link to="/admin/contact-messages" className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all border border-gray-700 hover:border-yellow-500 transform hover:scale-[1.01]">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <span className="mr-2">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              Messages de contact
            </h2>
            <p className="text-gray-400 mb-4">Consulter et gérer les messages reçus depuis le formulaire de contact</p>
            <div className="flex justify-end">
              <span className="text-blue-400 font-medium">Accéder →</span>
            </div>
          </Link>
        </div>

        {/* Validation des rapports */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-xl">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Rapports récents</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : reports.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Aucun rapport disponible</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 uppercase text-sm">
                    <th className="pb-4 pr-4 font-medium">Étudiant</th>
                    <th className="pb-4 pr-4 font-medium">Filière</th>
                    <th className="pb-4 pr-4 font-medium">Version</th>
                    <th className="pb-4 pr-4 font-medium">Date de dépôt</th>
                    <th className="pb-4 pr-4 font-medium">Statut</th>
                    <th className="pb-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-t border-gray-700 hover:bg-gray-700 transition-colors">
                      <td className="py-4 pr-4 font-medium">{report.student?.user?.name || 'N/A'}</td>
                      <td className="py-4 pr-4 text-sm text-gray-300">{report.student?.filiere || 'N/A'}</td>
                      <td className="py-4 pr-4 text-sm text-gray-300">
                        <span className="px-2 py-1 rounded text-xs bg-blue-900 text-blue-300">
                          {report.version === 'initial' ? 'Initial' : 'Corrigé'}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-sm text-gray-300">
                        {report.submitted_at ? new Date(report.submitted_at).toLocaleDateString('fr-FR') : '-'}
                      </td>
                      <td className="py-4 pr-4">
                        {getStatusBadge(report.status)}
                      </td>
                      <td className="py-4">
                        <button
                          className="text-blue-400 hover:text-blue-300 mr-3 text-sm transition-colors"
                          onClick={() => {
                            const backendUrl = import.meta.env.VITE_API_BASE_URL
                              ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
                              : 'http://localhost:8000';
                            window.open(`${backendUrl}/storage/${report.file_path}`, '_blank');
                          }}
                        >
                          Voir
                        </button>
                        {report.status === "validated" && (
                          <button
                            className="text-green-400 hover:text-green-300 text-sm transition-colors"
                            onClick={() => handleValidateReport(report.id)}
                          >
                            Valider
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}