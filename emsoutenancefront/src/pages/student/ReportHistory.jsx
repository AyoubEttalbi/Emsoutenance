import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import aiService from '../../services/aiService';
import Loader from '../../components/Loader';
import {
    FiClock,
    FiFileText,
    FiArrowRight,
    FiRefreshCw,
    FiTrendingUp,
    FiUpload
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';

// Grade color mapping
const gradeColors = {
    A: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    B: 'bg-green-100 text-green-800 border-green-300',
    C: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    D: 'bg-orange-100 text-orange-800 border-orange-300',
    E: 'bg-red-100 text-red-800 border-red-300'
};

const HistoryCard = ({ report }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const gradeStyle = report.niveau ? gradeColors[report.niveau] : 'bg-gray-100 text-gray-600 border-gray-300';

    return (
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-5 hover:bg-white/20 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <FiFileText className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white truncate max-w-[200px]" title={report.filename}>
                            {report.filename || 'Rapport sans nom'}
                        </h3>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                            <FiClock className="w-3 h-3" />
                            {formatDate(report.created_at)}
                        </p>
                    </div>
                </div>

                {/* Grade Badge */}
                {report.has_feedback && report.niveau ? (
                    <div className={`px-3 py-2 rounded-lg border-2 ${gradeStyle} font-bold text-center min-w-[60px]`}>
                        <div className="text-2xl">{report.grade}</div>
                        <div className="text-xs opacity-80">/20</div>
                    </div>
                ) : report.is_processing ? (
                    <div className="px-3 py-2 rounded-lg bg-blue-100 text-blue-800 border-2 border-blue-300 flex items-center gap-2">
                        <FiRefreshCw className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Analyse...</span>
                    </div>
                ) : (
                    <div className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 border-2 border-gray-300 text-sm">
                        En attente
                    </div>
                )}
            </div>

            {/* Version Badge */}
            <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded ${report.version === 'corrige'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                    {report.version === 'corrige' ? 'Version Corrigée' : 'Version Initiale'}
                </span>

                {report.has_feedback && (
                    <Link
                        to={`/student/ai-feedback/${report.id}`}
                        className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm font-medium group-hover:translate-x-1 transition-transform"
                    >
                        Voir détails <FiArrowRight className="w-4 h-4" />
                    </Link>
                )}
            </div>
        </div>
    );
};

const ReportHistory = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await aiService.getHistory();
                setReports(data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to load history:', err);
                setError('Impossible de charger l\'historique');
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // Calculate stats
    const totalReports = reports.length;
    const avgGrade = reports.filter(r => r.grade).length > 0
        ? (reports.filter(r => r.grade).reduce((sum, r) => sum + r.grade, 0) / reports.filter(r => r.grade).length).toFixed(1)
        : null;
    const bestGrade = reports.filter(r => r.grade).length > 0
        ? Math.max(...reports.filter(r => r.grade).map(r => r.grade))
        : null;

    if (loading) return <Loader message="Chargement de l'historique..." />;

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <FiClock className="text-indigo-400" />
                    Historique des Analyses
                </h1>
                <Link
                    to="/student/ai-upload"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <FiUpload /> Nouveau Rapport
                </Link>
            </div>

            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Stats Cards */}
            {totalReports > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl p-5">
                        <div className="flex items-center gap-3">
                            <FiFileText className="w-8 h-8 text-indigo-400" />
                            <div>
                                <p className="text-gray-400 text-sm">Total Rapports</p>
                                <p className="text-3xl font-bold text-white">{totalReports}</p>
                            </div>
                        </div>
                    </div>

                    {avgGrade && (
                        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-5">
                            <div className="flex items-center gap-3">
                                <FiTrendingUp className="w-8 h-8 text-green-400" />
                                <div>
                                    <p className="text-gray-400 text-sm">Moyenne</p>
                                    <p className="text-3xl font-bold text-white">{avgGrade}/20</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {bestGrade && (
                        <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-xl p-5">
                            <div className="flex items-center gap-3">
                                <HiOutlineSparkles className="w-8 h-8 text-amber-400" />
                                <div>
                                    <p className="text-gray-400 text-sm">Meilleure Note</p>
                                    <p className="text-3xl font-bold text-white">{bestGrade}/20</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Reports Grid */}
            {reports.length === 0 ? (
                <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
                    <FiFileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-300 mb-2">Aucun rapport analysé</h2>
                    <p className="text-gray-500 mb-6">Commencez par télécharger votre premier rapport</p>
                    <Link
                        to="/student/ai-upload"
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        <FiUpload /> Analyser un rapport
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reports.map((report) => (
                        <HistoryCard key={report.id} report={report} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReportHistory;
