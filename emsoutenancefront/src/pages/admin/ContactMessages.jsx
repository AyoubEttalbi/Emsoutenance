import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import Navbar from "../../components/Navbar";
import AdminSidebar from "../../components/AdminSidebar";
import api from "../../services/api";

export default function ContactMessages() {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [stats, setStats] = useState({ total: 0, unread: 0 });
    const [filter, setFilter] = useState('all'); // all, read, unread

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/contact-messages');
            setMessages(response.data.data || []);
            setStats({
                total: response.data.total || 0,
                unread: response.data.unread || 0
            });
        } catch (error) {
            console.error('Erreur lors du chargement des messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await api.post(`/admin/contact-messages/${id}/mark-read`);
            fetchMessages();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la mise à jour du message');
        }
    };

    const handleMarkAsUnread = async (id) => {
        try {
            await api.post(`/admin/contact-messages/${id}/mark-unread`);
            fetchMessages();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la mise à jour du message');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

        try {
            await api.delete(`/admin/contact-messages/${id}`);
            setSelectedMessage(null);
            fetchMessages();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la suppression du message');
        }
    };

    const handleViewMessage = async (message) => {
        setSelectedMessage(message);
        if (!message.is_read) {
            await handleMarkAsRead(message.id);
        }
    };

    const filteredMessages = messages.filter(msg => {
        if (filter === 'read') return msg.is_read;
        if (filter === 'unread') return !msg.is_read;
        return true;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] text-white">
            <Navbar />
            <AdminSidebar />
            <main className="md:ml-64 pt-4 pb-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-lg p-6 mb-8 shadow-xl">
                    <h1 className="text-3xl font-bold mb-2">Messages de Contact</h1>
                    <p className="text-gray-300">Gérer les messages reçus depuis le formulaire de contact</p>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-800 rounded-lg p-6 text-center shadow-lg">
                        <p className="text-4xl font-extrabold text-blue-400">{stats.total}</p>
                        <p className="text-gray-300 mt-2">Total des messages</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 text-center shadow-lg">
                        <p className="text-4xl font-extrabold text-yellow-400">{stats.unread}</p>
                        <p className="text-gray-300 mt-2">Messages non lus</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 text-center shadow-lg">
                        <p className="text-4xl font-extrabold text-green-400">{stats.total - stats.unread}</p>
                        <p className="text-gray-300 mt-2">Messages lus</p>
                    </div>
                </div>

                {/* Filtres */}
                <div className="mb-6 flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        Tous ({stats.total})
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'unread'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        Non lus ({stats.unread})
                    </button>
                    <button
                        onClick={() => setFilter('read')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'read'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        Lus ({stats.total - stats.unread})
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Liste des messages */}
                    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
                        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
                            Messages ({filteredMessages.length})
                        </h2>
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-gray-400">Chargement...</p>
                            </div>
                        ) : filteredMessages.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">Aucun message</p>
                        ) : (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                {filteredMessages.map((message) => (
                                    <div
                                        key={message.id}
                                        onClick={() => handleViewMessage(message)}
                                        className={`p-4 rounded-lg cursor-pointer transition-all border ${selectedMessage?.id === message.id
                                                ? 'bg-blue-900 border-blue-600'
                                                : message.is_read
                                                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-650'
                                                    : 'bg-gray-700 border-yellow-600 hover:bg-gray-650'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-white flex items-center gap-2">
                                                    {message.name}
                                                    {!message.is_read && (
                                                        <span className="px-2 py-0.5 bg-yellow-600 text-yellow-100 text-xs rounded-full">
                                                            Nouveau
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className="text-sm text-gray-400">{message.email}</p>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {new Date(message.created_at).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-300 mb-1">{message.subject}</p>
                                        <p className="text-sm text-gray-400 line-clamp-2">{message.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Détails du message */}
                    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
                        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
                            Détails du message
                        </h2>
                        {selectedMessage ? (
                            <div>
                                <div className="mb-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">{selectedMessage.name}</h3>
                                            <a
                                                href={`mailto:${selectedMessage.email}`}
                                                className="text-blue-400 hover:text-blue-300 text-sm"
                                            >
                                                {selectedMessage.email}
                                            </a>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedMessage.is_read
                                                ? 'bg-green-900 text-green-300'
                                                : 'bg-yellow-900 text-yellow-300'
                                            }`}>
                                            {selectedMessage.is_read ? 'Lu' : 'Non lu'}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-sm text-gray-400 mb-1">Sujet</p>
                                        <p className="text-lg font-semibold text-white">{selectedMessage.subject}</p>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-sm text-gray-400 mb-1">Date</p>
                                        <p className="text-white">
                                            {new Date(selectedMessage.created_at).toLocaleString('fr-FR', {
                                                dateStyle: 'long',
                                                timeStyle: 'short'
                                            })}
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <p className="text-sm text-gray-400 mb-2">Message</p>
                                        <div className="bg-gray-700 rounded-lg p-4 text-gray-200 whitespace-pre-wrap">
                                            {selectedMessage.message}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 border-t border-gray-700 pt-4">
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-center transition-colors"
                                    >
                                        Répondre
                                    </a>
                                    {selectedMessage.is_read ? (
                                        <button
                                            onClick={() => handleMarkAsUnread(selectedMessage.id)}
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                                        >
                                            Marquer non lu
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleMarkAsRead(selectedMessage.id)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                                        >
                                            Marquer lu
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(selectedMessage.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-16">
                                Sélectionnez un message pour voir les détails
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
