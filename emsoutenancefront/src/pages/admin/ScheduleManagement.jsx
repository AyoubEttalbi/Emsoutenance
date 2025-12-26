import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";
import api from "../../services/api";

export default function ScheduleManagement() {
  const [defenses, setDefenses] = useState([]);
  const [students, setStudents] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showJuryModal, setShowJuryModal] = useState(false);
  const [selectedDefense, setSelectedDefense] = useState(null);
  const [newDefense, setNewDefense] = useState({
    student_id: "",
    report_id: "",
    scheduled_at: "",
    salle: "",
  });

  const [juryMembers, setJuryMembers] = useState([
    { professor_id: "", role: "encadrant" },
    { professor_id: "", role: "rapporteur" },
    { professor_id: "", role: "examinateur" },
    { professor_id: "", role: "president" },
  ]);

  const [filter, setFilter] = useState({
    date: "",
    filiere: "",
    encadrant_id: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [defensesRes, studentsRes, professorsRes, reportsRes] = await Promise.all([
        api.get('/admin/defenses'),
        api.get('/admin/students?all=1'),
        api.get('/admin/professors'),
        api.get('/admin/reports')
      ]);

      setDefenses(defensesRes.data.data || defensesRes.data || []);
      const studentsData = studentsRes.data.data || studentsRes.data || [];
      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setProfessors(professorsRes.data.data || professorsRes.data || []);

      // Récupérer tous les rapports (pas seulement les validés)
      const allReports = reportsRes.data.data || reportsRes.data || [];
      // const validatedReports = allReports.filter(r => r.status === 'validated');
      setReports(allReports);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      alert('Erreur lors du chargement des données: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les étudiants pour n'afficher que ceux avec un rapport (quel que soit le statut)
  const studentsWithReports = students.filter(student => {
    return reports.some(r => parseInt(r.student_id) === parseInt(student.id));
  });

  const handleAddDefense = async () => {
    try {
      if (!newDefense.student_id || !newDefense.report_id || !newDefense.scheduled_at || !newDefense.salle) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }

      // Créer la date/heure complète
      const scheduledAt = `${newDefense.scheduled_at}:00`;

      const response = await api.post('/admin/defenses', {
        student_id: newDefense.student_id,
        report_id: newDefense.report_id,
        scheduled_at: scheduledAt,
        salle: newDefense.salle,
      });

      const defenseId = response.data.id;

      // Assigner le jury si tous les membres sont remplis
      const filledJury = juryMembers.filter(j => j.professor_id);
      if (filledJury.length >= 2) {
        await api.post(`/admin/defenses/${defenseId}/jury`, {
          jury: filledJury
        });
      }

      setNewDefense({
        student_id: "",
        report_id: "",
        scheduled_at: "",
        salle: "",
      });
      setJuryMembers([
        { professor_id: "", role: "encadrant" },
        { professor_id: "", role: "rapporteur" },
        { professor_id: "", role: "examinateur" },
        { professor_id: "", role: "president" },
      ]);
      setShowAddModal(false);
      fetchData();
      alert('Soutenance planifiée avec succès');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Erreur lors de la planification de la soutenance');
      }
    }
  };

  const handleAssignJury = async () => {
    try {
      const filledJury = juryMembers.filter(j => j.professor_id);
      if (filledJury.length < 2) {
        alert('Le jury doit contenir au moins 2 membres');
        return;
      }

      await api.post(`/admin/defenses/${selectedDefense.id}/jury`, {
        jury: filledJury
      });

      setShowJuryModal(false);
      setSelectedDefense(null);
      setJuryMembers([
        { professor_id: "", role: "encadrant" },
        { professor_id: "", role: "rapporteur" },
        { professor_id: "", role: "examinateur" },
        { professor_id: "", role: "president" },
      ]);
      fetchData();
      alert('Jury assigné avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'assignation du jury:', error);
      alert('Erreur lors de l\'assignation du jury');
    }
  };

  const handleDeleteDefense = async (defenseId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette soutenance ?')) {
      return;
    }
    try {
      await api.delete(`/admin/defenses/${defenseId}`);
      fetchData();
      alert('Soutenance supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la soutenance');
    }
  };

  const handleStudentSelect = (studentId) => {
    const student = students.find(s => parseInt(s.id) === parseInt(studentId));
    // Trouver le rapport de l'étudiant
    const studentReport = reports.find(r =>
      parseInt(r.student_id) === parseInt(studentId)
    );

    if (student && student.encadrant_id) {
      // Pré-remplir l'encadrant dans le jury
      setJuryMembers([
        { professor_id: student.encadrant_id.toString(), role: "encadrant" },
        { professor_id: (student.rapporteur_id || "").toString(), role: "rapporteur" },
        { professor_id: "", role: "examinateur" },
        { professor_id: "", role: "president" },
      ]);
    } else {
      setJuryMembers([
        { professor_id: "", role: "encadrant" },
        { professor_id: "", role: "rapporteur" },
        { professor_id: "", role: "examinateur" },
        { professor_id: "", role: "president" },
      ]);
    }

    setNewDefense({
      ...newDefense,
      student_id: studentId,
      report_id: studentReport?.id?.toString() || "",
    });
  };

  // Filtrer les soutenances selon les critères
  const filteredDefenses = defenses.filter(defense => {
    const student = students.find(s => s.id === defense.student_id);
    if (!student) return false;

    const matchDate = !filter.date || defense.scheduled_at?.startsWith(filter.date);
    const matchFiliere = !filter.filiere || student.filiere === filter.filiere;
    const matchEncadrant = !filter.encadrant_id || student.encadrant_id === parseInt(filter.encadrant_id);

    return matchDate && matchFiliere && matchEncadrant;
  });

  // Récupérer les rapports disponibles pour un étudiant
  const getAvailableReports = (studentId) => {
    return reports.filter(r => parseInt(r.student_id) === parseInt(studentId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white">
      <Navbar />
      <AdminSidebar />
      <main className="md:ml-64 pt-4 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Planification des Soutenances</h1>
          <button
            className="btn-primary px-4 py-2"
            onClick={() => setShowAddModal(true)}
          >
            Planifier une soutenance
          </button>
        </div>

        {/* Filtres */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-3">Filtres</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
              <input
                type="date"
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                value={filter.date}
                onChange={(e) => setFilter({ ...filter, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Filière</label>
              <select
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                value={filter.filiere}
                onChange={(e) => setFilter({ ...filter, filiere: e.target.value })}
              >
                <option value="">Toutes</option>
                {[...new Set(students.map(s => s.filiere))].filter(Boolean).map(filiere => (
                  <option key={filiere} value={filiere}>{filiere}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Encadrant</label>
              <select
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                value={filter.encadrant_id}
                onChange={(e) => setFilter({ ...filter, encadrant_id: e.target.value })}
              >
                <option value="">Tous</option>
                {professors.filter(p => p.user?.type === 'encadrant' || !p.user?.type).map(prof => (
                  <option key={prof.id} value={prof.id}>
                    {prof.user?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tableau des soutenances */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-400">Chargement des soutenances...</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Étudiant</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date & Heure</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Salle</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Statut</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Jury</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredDefenses.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                      Aucune soutenance planifiée correspondant aux critères.
                    </td>
                  </tr>
                ) : (
                  filteredDefenses.map((defense) => {
                    const student = students.find(s => s.id === defense.student_id);
                    return (
                      <tr key={defense.id} className="hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium">{student?.user?.name || 'N/A'}</div>
                            <div className="text-sm text-gray-400">{student?.matricule || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {defense.scheduled_at ? (
                            <>
                              <div>{new Date(defense.scheduled_at).toLocaleDateString('fr-FR')}</div>
                              <div className="text-sm text-gray-400">
                                {new Date(defense.scheduled_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </>
                          ) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{defense.salle || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs ${defense.status === 'scheduled' ? 'bg-blue-900 text-blue-300' :
                            defense.status === 'completed' ? 'bg-green-900 text-green-300' :
                              'bg-gray-700 text-gray-300'
                            }`}>
                            {defense.status === 'scheduled' ? 'Planifiée' :
                              defense.status === 'completed' ? 'Terminée' :
                                defense.status === 'cancelled' ? 'Annulée' : defense.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {defense.jury_members && defense.jury_members.length > 0 ? (
                            <ul className="list-disc pl-5 text-sm">
                              {defense.jury_members.map((member, index) => (
                                <li key={index}>
                                  {member.professor?.user?.name || 'N/A'} ({member.role})
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-gray-400 text-sm">Non assigné</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              className="text-blue-400 hover:text-blue-300 text-sm"
                              onClick={() => {
                                setSelectedDefense(defense);
                                if (defense.jury_members && defense.jury_members.length > 0) {
                                  const existingJury = [
                                    { professor_id: "", role: "encadrant" },
                                    { professor_id: "", role: "rapporteur" },
                                    { professor_id: "", role: "examinateur" },
                                    { professor_id: "", role: "president" },
                                  ];
                                  defense.jury_members.forEach(member => {
                                    const roleIndex = existingJury.findIndex(j => j.role === member.role);
                                    if (roleIndex !== -1) {
                                      existingJury[roleIndex].professor_id = member.professor_id;
                                    }
                                  });
                                  setJuryMembers(existingJury);
                                } else {
                                  setJuryMembers([
                                    { professor_id: "", role: "encadrant" },
                                    { professor_id: "", role: "rapporteur" },
                                    { professor_id: "", role: "examinateur" },
                                    { professor_id: "", role: "president" },
                                  ]);
                                }
                                setShowJuryModal(true);
                              }}
                            >
                              Jury
                            </button>
                            <button
                              className="text-red-400 hover:text-red-300 text-sm"
                              onClick={() => handleDeleteDefense(defense.id)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal d'ajout de soutenance */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Planifier une soutenance</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Étudiant *</label>
                  <select
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    value={newDefense.student_id}
                    onChange={(e) => handleStudentSelect(e.target.value)}
                  >
                    <option value="">Sélectionner un étudiant</option>
                    {studentsWithReports.length === 0 ? (
                      <option value="" disabled>Aucun étudiant avec rapport</option>
                    ) : (
                      studentsWithReports.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.user?.name || 'N/A'} ({student.matricule || 'N/A'}) - {student.filiere || 'N/A'}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {newDefense.student_id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Rapport *</label>
                    <select
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      value={newDefense.report_id}
                      onChange={(e) => setNewDefense({ ...newDefense, report_id: e.target.value })}
                    >
                      <option value="">Sélectionner un rapport</option>
                      {getAvailableReports(newDefense.student_id).map(report => (
                        <option key={report.id} value={report.id}>
                          {report.original_filename} - {report.version === 'initial' ? 'Initial' : 'Corrigé'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Date & Heure *</label>
                  <input
                    type="datetime-local"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    value={newDefense.scheduled_at}
                    onChange={(e) => setNewDefense({ ...newDefense, scheduled_at: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Salle *</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    value={newDefense.salle}
                    onChange={(e) => setNewDefense({ ...newDefense, salle: e.target.value })}
                    placeholder="Ex: Salle A1"
                  />
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <label className="block text-sm font-medium text-gray-400 mb-3">Composition du jury (optionnel)</label>
                  {juryMembers.map((member, index) => (
                    <div key={index} className="mb-3 grid grid-cols-2 gap-2">
                      <select
                        className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                        value={member.professor_id}
                        onChange={(e) => {
                          const updated = [...juryMembers];
                          updated[index].professor_id = e.target.value;
                          setJuryMembers(updated);
                        }}
                      >
                        <option value="">Sélectionner</option>
                        {professors.map(prof => (
                          <option key={prof.id} value={prof.id}>
                            {prof.user?.name}
                          </option>
                        ))}
                      </select>
                      <span className="px-3 py-2 bg-gray-600 rounded text-sm text-gray-300 capitalize">
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                    onClick={() => {
                      setShowAddModal(false);
                      setNewDefense({
                        student_id: "",
                        report_id: "",
                        scheduled_at: "",
                        salle: "",
                      });
                      setJuryMembers([
                        { professor_id: "", role: "encadrant" },
                        { professor_id: "", role: "rapporteur" },
                        { professor_id: "", role: "examinateur" },
                        { professor_id: "", role: "president" },
                      ]);
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    className="btn-primary px-4 py-2"
                    onClick={handleAddDefense}
                    disabled={!newDefense.student_id || !newDefense.report_id || !newDefense.scheduled_at || !newDefense.salle}
                  >
                    Planifier
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal d'assignation du jury */}
        {showJuryModal && selectedDefense && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Assigner le jury</h2>
              <p className="text-sm text-gray-400 mb-4">
                Étudiant: {students.find(s => s.id === selectedDefense.student_id)?.user?.name || 'N/A'}
              </p>
              <div className="space-y-3">
                {juryMembers.map((member, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <select
                      className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                      value={member.professor_id}
                      onChange={(e) => {
                        const updated = [...juryMembers];
                        updated[index].professor_id = e.target.value;
                        setJuryMembers(updated);
                      }}
                    >
                      <option value="">Sélectionner</option>
                      {professors.map(prof => (
                        <option key={prof.id} value={prof.id}>
                          {prof.user?.name}
                        </option>
                      ))}
                    </select>
                    <span className="px-3 py-2 bg-gray-600 rounded text-sm text-gray-300 capitalize">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-gray-700">
                <button
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                  onClick={() => {
                    setShowJuryModal(false);
                    setSelectedDefense(null);
                    setJuryMembers([
                      { professor_id: "", role: "encadrant" },
                      { professor_id: "", role: "rapporteur" },
                      { professor_id: "", role: "examinateur" },
                      { professor_id: "", role: "president" },
                    ]);
                  }}
                >
                  Annuler
                </button>
                <button
                  className="btn-primary px-4 py-2"
                  onClick={handleAssignJury}
                >
                  Assigner
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}