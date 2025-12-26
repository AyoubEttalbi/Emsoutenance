import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import FileUpload from "../../components/FileUpload";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

export default function ReportSubmission() {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    id: "",
    filiere: "",
    stage_type: "PFE"
  });
  const [reportStatus, setReportStatus] = useState("not_submitted");
  const [remarks, setRemarks] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Profil étudiant
      const profileRes = await api.get('/students/profile');
      const student = profileRes.data;

      setStudentInfo({
        name: user?.name || "",
        id: student.matricule,
        filiere: student.filiere,
        stage_type: student.stage_type || "PFE"
      });

      // 2. Rapports
      const reportsRes = await api.get('/students/reports');
      const reports = reportsRes.data;

      if (reports.length > 0) {
        const latestReport = reports[0];
        setReportStatus(latestReport.status);

        // 3. Remarques si nécessaire
        if (latestReport.status === 'need_correction' || latestReport.status === 'rejected') {
          try {
            const remarksRes = await api.get(`/students/reports/${latestReport.id}/remarks`);
            setRemarks(remarksRes.data);
          } catch (err) {
            console.error(err);
          }
        }
      }
    } catch (error) {
      console.error("Erreur chargement données:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (file) => {
    setReport(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!report) return;

    try {
      setSubmitted(true);

      const formData = new FormData();
      formData.append('file', report);

      await api.post('/students/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFeedback({
        message: "Votre rapport a été soumis avec succès.",
        type: "success"
      });

      // Recharger les données pour mettre à jour le statut
      fetchData();
      setReport(null);

    } catch (error) {
      console.error("Erreur envoi rapport:", error);
      setFeedback({
        message: error.response?.data?.message || "Erreur lors de l'envoi du rapport.",
        type: "error"
      });
    } finally {
      setSubmitted(false);
    }
  };

  const renderReportStatus = () => {
    const statusMap = {
      'not_submitted': { label: 'Non soumis', class: 'bg-gray-500' },
      'pending': { label: 'En attente de validation', class: 'bg-yellow-500' },
      'validated': { label: 'Validé', class: 'bg-green-500' },
      'need_correction': { label: 'Révision nécessaire', class: 'bg-red-500' },
      'rejected': { label: 'Rejeté', class: 'bg-red-500' }
    };

    const statusInfo = statusMap[reportStatus] || statusMap['not_submitted'];

    return <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Dépôt de rapport de stage</h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Informations sur le stage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">Étudiant:</p>
              <p>{studentInfo.name}</p>
            </div>
            <div>
              <p className="text-gray-400">ID:</p>
              <p>{studentInfo.id}</p>
            </div>
            <div>
              <p className="text-gray-400">Type de stage:</p>
              <p>{studentInfo.stage_type}</p>
            </div>
            <div>
              <p className="text-gray-400">Statut du rapport:</p>
              <p>{renderReportStatus()}</p>
            </div>
          </div>
        </div>

        {(reportStatus === "need_correction" || reportStatus === "rejected") && remarks.length > 0 && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-red-400 mb-2">Remarques du rapporteur</h3>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              {remarks.map((remark, index) => (
                <li key={index}>
                  <span className="font-medium text-gray-300">{remark.professor?.user?.name}:</span> {remark.content}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {reportStatus === "need_correction" ? "Soumettre une version corrigée" : "Soumettre votre rapport"}
          </h2>

          {reportStatus === "validated" ? (
            <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg text-center">
              <p className="text-green-400 text-lg">Votre rapport a été validé !</p>
              <p className="text-gray-400 mt-2">Vous n'avez plus d'actions à effectuer pour le moment.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <FileUpload onFileSelect={handleFileUpload} />
                <p className="text-sm text-gray-400 mt-2">
                  Formats acceptés: PDF, DOCX. Taille maximale: 10MB
                </p>
              </div>

              <button
                type="submit"
                className={`btn-primary px-6 py-2 ${(!report || submitted) ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!report || submitted}
              >
                {submitted ? "Envoi en cours..." : "Soumettre le rapport"}
              </button>
            </form>
          )}

          {feedback && (
            <div className={`mt-6 p-4 rounded-lg border ${feedback.type === 'success' ? 'bg-green-900/30 border-green-700 text-green-400' : 'bg-red-900/30 border-red-700 text-red-400'
              }`}>
              <p>{feedback.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}