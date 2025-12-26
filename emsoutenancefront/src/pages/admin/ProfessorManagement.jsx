import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";
import api from "../../services/api";
import { ArrowUpIcon, ArrowDownIcon, SortIcon, SearchIcon, XIcon } from "../../components/icons/ModernIcons";

export default function ProfessorManagement() {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialite, setFilterSpecialite] = useState('');
  const [filterType, setFilterType] = useState('');
  const [newProfessor, setNewProfessor] = useState({
    name: "",
    email: "",
    password: "",
    specialite: "",
    phone: "",
    type: "",
  });

  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/professors');
      const professorsData = response.data.data || response.data || [];
      setProfessors(professorsData);
    } catch (error) {
      console.error('Erreur lors du chargement des professeurs:', error);
      alert('Erreur lors du chargement des professeurs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProfessor = async () => {
    try {
      await api.post('/admin/professors', newProfessor);
      setNewProfessor({
        name: "",
        email: "",
        password: "",
        specialite: "",
        phone: "",
        type: "",
      });
      setShowAddModal(false);
      fetchProfessors();
      alert('Professeur créé avec succès');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat().join(', ');
        alert(`Erreur: ${errors}`);
      } else {
        alert('Erreur lors de la création du professeur');
      }
    }
  };

  const handleEditProfessor = (professor) => {
    setEditingProfessor(professor);
    setNewProfessor({
      name: professor.user?.name || "",
      email: professor.user?.email || "",
      specialite: professor.specialite || "",
      phone: professor.phone || "",
      type: professor.user?.type || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateProfessor = async () => {
    try {
      await api.put(`/admin/professors/${editingProfessor.id}`, newProfessor);
      setShowEditModal(false);
      setEditingProfessor(null);
      setNewProfessor({
        name: "",
        email: "",
        password: "",
        specialite: "",
        phone: "",
        type: "",
      });
      fetchProfessors();
      alert('Professeur mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour du professeur');
    }
  };

  const handleDeleteProfessor = async (professorId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce professeur ?')) {
      return;
    }
    try {
      await api.delete(`/admin/professors/${professorId}`);
      fetchProfessors();
      alert('Professeur supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du professeur');
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

  // Obtenir les spécialités uniques pour le filtre
  const specialites = useMemo(() => {
    const unique = [...new Set(professors.map(p => p.specialite).filter(Boolean))];
    return unique.sort();
  }, [professors]);

  // Filtrer et trier les professeurs
  const filteredAndSortedProfessors = useMemo(() => {
    let filtered = [...professors];

    // Filtre de recherche globale
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(professor =>
        professor.user?.name?.toLowerCase().includes(term) ||
        professor.user?.email?.toLowerCase().includes(term) ||
        professor.specialite?.toLowerCase().includes(term) ||
        professor.phone?.toLowerCase().includes(term)
      );
    }

    // Filtre par spécialité
    if (filterSpecialite) {
      filtered = filtered.filter(professor => professor.specialite === filterSpecialite);
    }

    // Filtre par type
    if (filterType) {
      filtered = filtered.filter(professor => professor.user?.type === filterType);
    }

    // Tri
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue, bValue;

        switch (sortField) {
          case 'name':
            aValue = a.user?.name || '';
            bValue = b.user?.name || '';
            break;
          case 'email':
            aValue = a.user?.email || '';
            bValue = b.user?.email || '';
            break;
          case 'specialite':
            aValue = a.specialite || '';
            bValue = b.specialite || '';
            break;
          case 'type':
            aValue = a.user?.type || '';
            bValue = b.user?.type || '';
            break;
          case 'phone':
            aValue = a.phone || '';
            bValue = b.phone || '';
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
  }, [professors, searchTerm, filterSpecialite, filterType, sortField, sortDirection]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterSpecialite('');
    setFilterType('');
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
                <ArrowUpIcon className="w-3 h-3 text-green-400" />
              ) : (
                <ArrowDownIcon className="w-3 h-3 text-green-400" />
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a2f3a] to-[#0a0e27] text-white">
      <Navbar />
      <AdminSidebar />
      <main className="md:ml-64 pt-4 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des Professeurs</h1>
          <button
            className="btn-primary px-4 py-2"
            onClick={() => setShowAddModal(true)}
          >
            Ajouter un professeur
          </button>
        </div>

        {/* Filtres */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Recherche globale */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Recherche</label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nom, email, spécialité..."
                  className="w-full bg-gray-700 border border-gray-600 rounded px-10 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
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

            {/* Filtre par spécialité */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Spécialité</label>
              <select
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-green-500"
                value={filterSpecialite}
                onChange={(e) => setFilterSpecialite(e.target.value)}
              >
                <option value="">Toutes</option>
                {specialites.map(specialite => (
                  <option key={specialite} value={specialite}>{specialite}</option>
                ))}
              </select>
            </div>

            {/* Filtre par type */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
              <select
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-green-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Tous</option>
                <option value="encadrant">Encadrant</option>
                <option value="rapporteur">Rapporteur</option>
                <option value="examinateur">Examinateur</option>
                <option value="president">Président</option>
              </select>
            </div>
          </div>

          {/* Bouton réinitialiser les filtres */}
          {(searchTerm || filterSpecialite || filterType) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-green-400 hover:text-green-300 flex items-center gap-2"
              >
                <XIcon className="w-4 h-4" />
                Réinitialiser les filtres
              </button>
            </div>
          )}

          {/* Compteur de résultats */}
          <div className="mt-4 text-sm text-gray-400">
            {filteredAndSortedProfessors.length} professeur{filteredAndSortedProfessors.length !== 1 ? 's' : ''} trouvé{filteredAndSortedProfessors.length !== 1 ? 's' : ''}
            {filteredAndSortedProfessors.length !== professors.length && (
              <span className="ml-2">(sur {professors.length} total)</span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-400">Chargement des professeurs...</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <SortableHeader field="name">Nom</SortableHeader>
                  <SortableHeader field="email">Email</SortableHeader>
                  <SortableHeader field="specialite">Spécialité</SortableHeader>
                  <SortableHeader field="type">Type</SortableHeader>
                  <SortableHeader field="phone">Téléphone</SortableHeader>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredAndSortedProfessors.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                      {searchTerm || filterSpecialite || filterType
                        ? 'Aucun professeur ne correspond aux critères de recherche'
                        : 'Aucun professeur trouvé'}
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedProfessors.map((professor) => (
                    <tr key={professor.id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {professor.user?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{professor.user?.email || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{professor.specialite || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {professor.user?.type && (
                          <span className="px-2 py-1 rounded text-xs bg-green-900 text-green-300">
                            {professor.user.type}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{professor.phone || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-400 hover:text-blue-300"
                            onClick={() => handleEditProfessor(professor)}
                          >
                            Modifier
                          </button>
                          <button
                            className="text-red-400 hover:text-red-300"
                            onClick={() => handleDeleteProfessor(professor.id)}
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
                {showEditModal ? 'Modifier le professeur' : 'Ajouter un professeur'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nom complet *</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    value={newProfessor.name}
                    onChange={(e) => setNewProfessor({ ...newProfessor, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email *</label>
                  <input
                    type="email"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    value={newProfessor.email}
                    onChange={(e) => setNewProfessor({ ...newProfessor, email: e.target.value })}
                  />
                </div>
                {!showEditModal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Mot de passe *</label>
                    <input
                      type="password"
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      value={newProfessor.password}
                      onChange={(e) => setNewProfessor({ ...newProfessor, password: e.target.value })}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Spécialité</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    value={newProfessor.specialite}
                    onChange={(e) => setNewProfessor({ ...newProfessor, specialite: e.target.value })}
                    placeholder="Ex: Informatique"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Type de rôle</label>
                  <select
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    value={newProfessor.type}
                    onChange={(e) => setNewProfessor({ ...newProfessor, type: e.target.value })}
                  >
                    <option value="">Sélectionner</option>
                    <option value="encadrant">Encadrant</option>
                    <option value="rapporteur">Rapporteur</option>
                    <option value="examinateur">Examinateur</option>
                    <option value="president">Président</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Téléphone</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    value={newProfessor.phone}
                    onChange={(e) => setNewProfessor({ ...newProfessor, phone: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setEditingProfessor(null);
                      setNewProfessor({
                        name: "",
                        email: "",
                        password: "",
                        specialite: "",
                        phone: "",
                        type: "",
                      });
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    className="btn-primary px-4 py-2"
                    onClick={showEditModal ? handleUpdateProfessor : handleAddProfessor}
                    disabled={
                      !newProfessor.name ||
                      !newProfessor.email ||
                      (!showEditModal && !newProfessor.password)
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




