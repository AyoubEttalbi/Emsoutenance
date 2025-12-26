import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";
import api from "../../services/api";
import { ArrowUpIcon, ArrowDownIcon, SortIcon, SearchIcon, XIcon } from "../../components/icons/ModernIcons";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFiliere, setFilterFiliere] = useState('');
  const [filterStageType, setFilterStageType] = useState('');
  const [filterEncadrant, setFilterEncadrant] = useState('');
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    password: "Student123",
    matricule: "",
    filiere: "",
    stage_type: "PFE",
    phone: "",
    encadrant_id: "",
    rapporteur_id: "",
  });

  useEffect(() => {
    fetchStudents();
    fetchProfessors();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/students');
      const studentsData = response.data.data || response.data || [];
      setStudents(studentsData);
    } catch (error) {
      console.error('Erreur lors du chargement des étudiants:', error);
      alert('Erreur lors du chargement des étudiants');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessors = async () => {
    try {
      const response = await api.get('/admin/professors');
      const professorsData = response.data.data || response.data || [];
      setProfessors(professorsData);
    } catch (error) {
      console.error('Erreur lors du chargement des professeurs:', error);
    }
  };

  const handleAddStudent = async () => {
    try {
      await api.post('/admin/students', newStudent);
      setNewStudent({
        name: "",
        email: "",
        password: "Student123",
        matricule: "",
        filiere: "",
        stage_type: "PFE",
        phone: "",
        encadrant_id: "",
        rapporteur_id: "",
      });
      setShowAddModal(false);
      fetchStudents();
      alert('Étudiant créé avec succès');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat().join(', ');
        alert(`Erreur: ${errors}`);
      } else {
        alert('Erreur lors de la création de l\'étudiant');
      }
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setNewStudent({
      name: student.user?.name || "",
      email: student.user?.email || "",
      matricule: student.matricule || "",
      filiere: student.filiere || "",
      stage_type: student.stage_type || "PFE",
      phone: student.phone || "",
      encadrant_id: student.encadrant_id || "",
      rapporteur_id: student.rapporteur_id || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateStudent = async () => {
    try {
      await api.put(`/admin/students/${editingStudent.id}`, newStudent);
      setShowEditModal(false);
      setEditingStudent(null);
      setNewStudent({
        name: "",
        email: "",
        password: "",
        matricule: "",
        filiere: "",
        stage_type: "PFE",
        phone: "",
        encadrant_id: "",
        rapporteur_id: "",
      });
      fetchStudents();
      alert('Étudiant mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour de l\'étudiant');
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      return;
    }
    try {
      await api.delete(`/admin/students/${studentId}`);
      fetchStudents();
      alert('Étudiant supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'étudiant');
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Obtenir les filières uniques pour le filtre
  const filieres = useMemo(() => {
    const unique = [...new Set(students.map(s => s.filiere).filter(Boolean))];
    return unique.sort();
  }, [students]);

  // Filtrer et trier les étudiants
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = [...students];

    // Filtre de recherche globale
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(student => 
        student.user?.name?.toLowerCase().includes(term) ||
        student.matricule?.toLowerCase().includes(term) ||
        student.user?.email?.toLowerCase().includes(term) ||
        student.filiere?.toLowerCase().includes(term)
      );
    }

    // Filtre par filière
    if (filterFiliere) {
      filtered = filtered.filter(student => student.filiere === filterFiliere);
    }

    // Filtre par type de stage
    if (filterStageType) {
      filtered = filtered.filter(student => student.stage_type === filterStageType);
    }

    // Filtre par encadrant
    if (filterEncadrant) {
      filtered = filtered.filter(student => student.encadrant_id === parseInt(filterEncadrant));
    }

    // Tri
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue, bValue;

        switch (sortField) {
          case 'matricule':
            aValue = a.matricule || '';
            bValue = b.matricule || '';
            break;
          case 'name':
            aValue = a.user?.name || '';
            bValue = b.user?.name || '';
            break;
          case 'filiere':
            aValue = a.filiere || '';
            bValue = b.filiere || '';
            break;
          case 'stage_type':
            aValue = a.stage_type || '';
            bValue = b.stage_type || '';
            break;
          case 'encadrant':
            aValue = a.encadrant?.user?.name || 'Non assigné';
            bValue = b.encadrant?.user?.name || 'Non assigné';
            break;
          case 'rapporteur':
            aValue = a.rapporteur?.user?.name || 'Non assigné';
            bValue = b.rapporteur?.user?.name || 'Non assigné';
            break;
          default:
            return 0;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [students, searchTerm, filterFiliere, filterStageType, filterEncadrant, sortField, sortDirection]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterFiliere('');
    setFilterStageType('');
    setFilterEncadrant('');
  };

  const SortableHeader = ({ field, children }) => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 transition-colors select-none"
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center gap-2">
          <span>{children}</span>
          <span className="flex flex-col">
            {isActive ? (
              sortDirection === 'asc' ? (
                <ArrowUpIcon className="w-3 h-3 text-blue-400" />
              ) : (
                <ArrowDownIcon className="w-3 h-3 text-blue-400" />
              )
            ) : (
              <SortIcon className="w-3 h-3 text-gray-500" />
            )}
          </span>
        </div>
      </th>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white">
      <Navbar />
      <AdminSidebar />
      <main className="md:ml-64 pt-4 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Étudiants</h1>
        <button 
          className="btn-primary px-4 py-2"
          onClick={() => setShowAddModal(true)}
        >
          Ajouter un étudiant
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Recherche globale */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Recherche</label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Nom, matricule, email..."
                className="w-full bg-gray-700 border border-gray-600 rounded px-10 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filtre par filière */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Filière</label>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              value={filterFiliere}
              onChange={(e) => setFilterFiliere(e.target.value)}
            >
              <option value="">Toutes</option>
              {filieres.map(filiere => (
                <option key={filiere} value={filiere}>{filiere}</option>
              ))}
            </select>
          </div>

          {/* Filtre par type de stage */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Type Stage</label>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              value={filterStageType}
              onChange={(e) => setFilterStageType(e.target.value)}
            >
              <option value="">Tous</option>
              <option value="PFE">PFE</option>
              <option value="stage_ete">Stage d'été</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Encadrant</label>
            <select
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              value={filterEncadrant}
              onChange={(e) => setFilterEncadrant(e.target.value)}
            >
              <option value="">Tous</option>
              {professors.map(prof => (
                <option key={prof.id} value={prof.id}>
                  {prof.user?.name || 'N/A'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(searchTerm || filterFiliere || filterStageType || filterEncadrant) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2"
            >
              <XIcon className="w-4 h-4" />
              Réinitialiser les filtres
            </button>
          </div>
        )}

     
        <div className="mt-4 text-sm text-gray-400">
          {filteredAndSortedStudents.length} étudiant{filteredAndSortedStudents.length !== 1 ? 's' : ''} trouvé{filteredAndSortedStudents.length !== 1 ? 's' : ''}
          {filteredAndSortedStudents.length !== students.length && (
            <span className="ml-2">(sur {students.length} total)</span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Chargement des étudiants...</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <SortableHeader field="matricule">Matricule</SortableHeader>
                <SortableHeader field="name">Nom</SortableHeader>
                <SortableHeader field="filiere">Filière</SortableHeader>
                <SortableHeader field="stage_type">Type Stage</SortableHeader>
                <SortableHeader field="encadrant">Encadrant</SortableHeader>
                <SortableHeader field="rapporteur">Rapporteur</SortableHeader>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredAndSortedStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-400">
                    {searchTerm || filterFiliere || filterStageType || filterEncadrant
                      ? 'Aucun étudiant ne correspond aux critères de recherche'
                      : 'Aucun étudiant trouvé'}
                  </td>
                </tr>
              ) : (
                filteredAndSortedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{student.matricule}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{student.user?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{student.filiere}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 rounded text-xs bg-blue-900 text-blue-300">
                        {student.stage_type === 'PFE' ? 'PFE' : 'Stage d\'été'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {student.encadrant?.user?.name || 'Non assigné'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {student.rapporteur?.user?.name || 'Non assigné'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-400 hover:text-blue-300"
                          onClick={() => handleEditStudent(student)}
                        >
                          Modifier
                        </button>
                        <button 
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {showEditModal ? 'Modifier l\'étudiant' : 'Ajouter un étudiant'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nom complet *</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email *</label>
                <input 
                  type="email" 
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                />
              </div>
              {!showEditModal && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Mot de passe *</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    value={newStudent.password}
                    onChange={(e) => setNewStudent({...newStudent, password: e.target.value})}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Matricule *</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  value={newStudent.matricule}
                  onChange={(e) => setNewStudent({...newStudent, matricule: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Filière *</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  value={newStudent.filiere}
                  onChange={(e) => setNewStudent({...newStudent, filiere: e.target.value})}
                  placeholder="Ex: Informatique"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Type de stage *</label>
                <select 
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  value={newStudent.stage_type}
                  onChange={(e) => setNewStudent({...newStudent, stage_type: e.target.value})}
                >
                  <option value="PFE">PFE</option>
                  <option value="stage_ete">Stage d'été</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Téléphone</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Encadrant</label>
                <select 
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  value={newStudent.encadrant_id}
                  onChange={(e) => setNewStudent({...newStudent, encadrant_id: e.target.value})}
                >
                  <option value="">Sélectionner</option>
                  {professors.map(prof => (
                    <option key={prof.id} value={prof.id}>
                      {prof.user?.name} {prof.specialite ? `- ${prof.specialite}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Rapporteur (optionnel)</label>
                <select 
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  value={newStudent.rapporteur_id}
                  onChange={(e) => setNewStudent({...newStudent, rapporteur_id: e.target.value})}
                >
                  <option value="">Sélectionner</option>
                  {professors.map(prof => (
                    <option key={prof.id} value={prof.id}>
                      {prof.user?.name} {prof.specialite ? `- ${prof.specialite}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingStudent(null);
                    setNewStudent({
                      name: "",
                      email: "",
                      password: "",
                      matricule: "",
                      filiere: "",
                      stage_type: "PFE",
                      phone: "",
                      encadrant_id: "",
                      rapporteur_id: "",
                    });
                  }}
                >
                  Annuler
                </button>
                <button 
                  className="btn-primary px-4 py-2"
                  onClick={showEditModal ? handleUpdateStudent : handleAddStudent}
                  disabled={
                    !newStudent.name || 
                    !newStudent.matricule || 
                    !newStudent.filiere ||
                    (!showEditModal && (!newStudent.email || !newStudent.password))
                  }
                >
                  {showEditModal ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}