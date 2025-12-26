import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function ReportReview() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("encadrant");
  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState({
    encadrant: [],
    rapporteur: [],
    jury: []
  });
  const [reports, setReports] = useState([]);
  const [defenses, setDefenses] = useState([]);

  const [selectedReport, setSelectedReport] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Récupérer les étudiants
      const studentsResponse = await api.get('/professors/students');
      const allStudents = studentsResponse.data || [];

      // Séparer par rôle
      const encadrantStudents = allStudents.filter(s => s.relation_type === 'encadrant');
      const rapporteurStudents = allStudents.filter(s => s.relation_type === 'rapporteur');

      // Récupérer les rapports
      const reportsResponse = await api.get('/professors/reports');
      const allReports = reportsResponse.data || [];
      setReports(allReports);

      // Récupérer les soutenances (pour l'onglet jury)
      const defensesResponse = await api.get('/professors/defenses');
      const allDefenses = defensesResponse.data || [];
      setDefenses(allDefenses);

      // Enrichir les étudiants avec leurs rapports
      const encadrantWithReports = encadrantStudents.map(student => {
        const studentReports = allReports.filter(r => r.student_id === student.id);
        const latestReport = studentReports.length > 0 ? studentReports[0] : null;
        return {
          ...student,
          report: latestReport,
          reportStatus: latestReport ? latestReport.status : 'Non déposé',
          reportDate: latestReport ? latestReport.submitted_at : null,
          defenseDate: null // À récupérer depuis les défenses si nécessaire
        };
      });

      const rapporteurWithReports = rapporteurStudents.map(student => {
        const studentReports = allReports.filter(r => r.student_id === student.id);
        const latestReport = studentReports.length > 0 ? studentReports[0] : null;
        return {
          ...student,
          report: latestReport,
          reportStatus: latestReport ? latestReport.status : 'Non déposé',
          reportDate: latestReport ? latestReport.submitted_at : null,
          defenseDate: null
        };
      });

      // Préparer les données pour l'onglet jury
      const juryData = allDefenses.map(defense => {
        const juryMembers = defense.jury_members || [];
        const currentUserEmail = user?.email;
        const juryMember = juryMembers.find(jm => jm.professor?.user?.email === currentUserEmail);

        return {
          id: defense.student?.id,
          name: defense.student?.user?.name,
          filiere: defense.student?.filiere,
          role: juryMember?.role || 'N/A',
          reportStatus: defense.report?.status === 'validated' ? 'Validé' : 'En attente',
          defenseDate: defense.scheduled_at
        };
      });

      setStudents({
        encadrant: encadrantWithReports,
        rapporteur: rapporteurWithReports,
        jury: juryData
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      alert('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (student) => {
    if (student.report?.file_path) {
      // Construit l'URL complète vers le backend
      const backendUrl = import.meta.env.VITE_API_BASE_URL
        ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
        : 'http://localhost:8000';

      window.open(`${backendUrl}/storage/${student.report.file_path}`, '_blank');
    } else {
      alert('Aucun rapport disponible pour cet étudiant');
    }
  };

  const handleAddFeedback = (student) => {
    if (!student.report) {
      alert('Aucun rapport disponible pour cet étudiant');
      return;
    }
    setSelectedReport(student.report);
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedReport || !feedback.trim()) return;

    try {
      await api.post(`/professors/reports/${selectedReport.id}/remarks`, {
        content: feedback
      });

      alert('Remarques ajoutées avec succès');
      setFeedback("");
      setShowFeedbackModal(false);
      fetchData(); // Recharger les données
    } catch (error) {
      console.error('Erreur lors de l\'ajout des remarques:', error);
      alert('Erreur lors de l\'ajout des remarques');
    }
  };

  const handleValidateReport = async (student) => {
    if (!student.report) {
      alert('Aucun rapport disponible pour cet étudiant');
      return;
    }

    if (!window.confirm('Êtes-vous sûr de vouloir valider ce rapport ?')) {
      return;
    }

    try {
      await api.post(`/professors/reports/${student.report.id}/validate`);
      alert('Rapport validé avec succès');
      fetchData(); // Recharger les données
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      const errorMsg = error.response?.data?.message || 'Erreur lors de la validation du rapport';
      alert(errorMsg);
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'pending': 'En attente',
      'validated': 'Validé',
      'need_correction': 'Correction demandée',
      'rejected': 'Rejeté'
    };
    return statusMap[status] || status;
  };

  const getStatusBadge = (status) => {
    const badges = {
      'validated': 'bg-green-900 text-green-300',
      'pending': 'bg-yellow-900 text-yellow-300',
      'need_correction': 'bg-red-900 text-red-300',
      'rejected': 'bg-red-900 text-red-300'
    };
    return badges[status] || 'bg-gray-700 text-gray-300';
  };

  const renderStudentList = (roleStudents) => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Chargement des données...</p>
        </div>
      );
    }

    if (roleStudents.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          Aucun étudiant assigné pour ce rôle.
        </div>
      );
    }

    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Matricule</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nom</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Filière</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Statut</th>
              {activeTab === "jury" && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rôle</th>
              )}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date soutenance</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {roleStudents.map((student) => {
              const reportStatus = student.report?.status || (student.reportStatus === 'Non déposé' ? null : student.reportStatus);
              const hasReport = student.report || (reportStatus && reportStatus !== 'Non déposé');

              return (
                <tr key={student.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{student.matricule || student.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{student.user?.name || student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{student.filiere}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {reportStatus ? (
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(reportStatus)}`}>
                        {getStatusLabel(reportStatus)}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                        Non déposé
                      </span>
                    )}
                  </td>
                  {activeTab === "jury" && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-900 text-purple-300">
                        {student.role}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {student.defenseDate ? new Date(student.defenseDate).toLocaleDateString('fr-FR') : "Non planifiée"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {hasReport && (
                        <button
                          className="text-blue-400 hover:text-blue-300"
                          onClick={() => handleViewReport(student)}
                        >
                          Voir rapport
                        </button>
                      )}
                      {activeTab === "rapporteur" && reportStatus === "pending" && (
                        <>
                          <button
                            className="text-green-400 hover:text-green-300"
                            onClick={() => handleValidateReport(student)}
                          >
                            Valider
                          </button>
                          <button
                            className="text-yellow-400 hover:text-yellow-300"
                            onClick={() => handleAddFeedback(student)}
                          >
                            Remarques
                          </button>
                        </>
                      )}
                      {activeTab === "encadrant" && hasReport && (
                        <button
                          className="text-yellow-400 hover:text-yellow-300"
                          onClick={() => handleAddFeedback(student)}
                        >
                          Remarques
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Gestion des Rapports et Soutenances</h1>

        <div className="mb-6">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "encadrant"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"
                  }`}
                onClick={() => setActiveTab("encadrant")}
              >
                Étudiants encadrés
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "rapporteur"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"
                  }`}
                onClick={() => setActiveTab("rapporteur")}
              >
                Rapporteur
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "jury"
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"
                  }`}
                onClick={() => setActiveTab("jury")}
              >
                Jury de soutenance
              </button>
            </nav>
          </div>
        </div>

        {renderStudentList(students[activeTab])}

        {/* Modal pour ajouter des remarques */}
        {showFeedbackModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-4">Remarques sur le rapport</h2>
              <p className="mb-4 text-gray-300">
                Étudiant: <span className="font-medium">{selectedReport.student?.user?.name || 'N/A'}</span>
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">Vos remarques</label>
                <textarea
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 h-32"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Détaillez les points à améliorer dans le rapport..."
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                  onClick={() => setShowFeedbackModal(false)}
                >
                  Annuler
                </button>
                <button
                  className="btn-primary px-4 py-2"
                  onClick={handleSubmitFeedback}
                  disabled={!feedback.trim()}
                >
                  Envoyer les remarques
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}