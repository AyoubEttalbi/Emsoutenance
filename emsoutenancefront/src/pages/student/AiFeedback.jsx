import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import aiService from '../../services/aiService';
import Loader from '../../components/Loader';
import { AI_DISCLAIMER } from '../../utils/disclaimer';
import {
    FiBarChart2,
    FiCheckCircle,
    FiAlertTriangle,
    FiFileText,
    FiTarget,
    FiArrowLeft,
    FiAlertCircle,
    FiEdit3,
    FiClipboard,
    FiLayers
} from 'react-icons/fi';
import {
    HiOutlineLightBulb,
    HiOutlineSparkles,
    HiCheckCircle,
    HiXCircle
} from 'react-icons/hi';

// Grade color mapping
const gradeColors = {
    A: { bg: 'bg-emerald-100', text: 'text-emerald-800', ring: 'ring-emerald-500' },
    B: { bg: 'bg-green-100', text: 'text-green-800', ring: 'ring-green-500' },
    C: { bg: 'bg-yellow-100', text: 'text-yellow-800', ring: 'ring-yellow-500' },
    D: { bg: 'bg-orange-100', text: 'text-orange-800', ring: 'ring-orange-500' },
    E: { bg: 'bg-red-100', text: 'text-red-800', ring: 'ring-red-500' }
};

const gradeDescriptions = {
    A: 'Excellent - Rapport complet et professionnel',
    B: 'Très bien - Quelques améliorations mineures',
    C: 'Bien - Satisfaisant mais perfectible',
    D: 'Passable - Nécessite des améliorations',
    E: 'Insuffisant - Structure à revoir'
};

// Section Quality Bar Component
const QualityBar = ({ quality, max = 5 }) => {
    const percentage = (quality / max) * 100;
    const color = quality >= 4 ? 'bg-emerald-500' : quality >= 3 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
        </div>
    );
};

// Section Analysis Card
const SectionCard = ({ name, data }) => {
    const sectionNames = {
        introduction: 'Introduction',
        presentation_entreprise: 'Présentation Entreprise',
        missions: 'Missions & Réalisations',
        outils_technologies: 'Outils & Technologies',
        difficultes: 'Difficultés Rencontrées',
        conclusion: 'Conclusion'
    };

    return (
        <div className={`p-4 rounded-lg border-2 ${data.present ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">{sectionNames[name] || name}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${data.present ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {data.present ? <HiCheckCircle className="w-4 h-4" /> : <HiXCircle className="w-4 h-4" />}
                    {data.present ? 'Présent' : 'Manquant'}
                </span>
            </div>
            {data.present && (
                <>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">Qualité:</span>
                        <div className="flex-1">
                            <QualityBar quality={data.qualite} />
                        </div>
                        <span className="text-xs font-bold text-gray-600">{data.qualite}/5</span>
                    </div>
                </>
            )}
            <p className="text-sm text-gray-600">{data.commentaire}</p>
        </div>
    );
};

const AiFeedback = () => {
    const { reportId } = useParams();
    const [feedback, setFeedback] = useState(null);
    const [parsedAnalysis, setParsedAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        let pollTimer = null;

        const fetchFeedback = async () => {
            try {
                const data = await aiService.getAiFeedback(reportId);

                if (!isMounted) return;

                if (data.grammar_issues_count === -1) {
                    setLoading(true);
                    pollTimer = setTimeout(fetchFeedback, 2000);
                    return;
                }

                if (data.grammar_issues_count === -2) {
                    setError(data.ai_feedback || 'Analysis failed.');
                    setLoading(false);
                    return;
                }

                setFeedback(data);

                // Parse AI feedback JSON
                try {
                    const analysis = JSON.parse(data.ai_feedback);
                    setParsedAnalysis(analysis);
                } catch (e) {
                    console.log("Could not parse AI feedback as JSON, using raw text");
                }

                setLoading(false);
            } catch (err) {
                if (!isMounted) return;

                if (err.response && err.response.status === 404) {
                    pollTimer = setTimeout(fetchFeedback, 2000);
                    return;
                }

                setError('Failed to load AI feedback.');
                setLoading(false);
            }
        };

        fetchFeedback();

        return () => {
            isMounted = false;
            if (pollTimer) clearTimeout(pollTimer);
        };
    }, [reportId]);

    if (loading) return <Loader message="Analyse en cours... L'IA évalue votre rapport" />;

    if (error) return (
        <div className="max-w-4xl mx-auto p-6 text-center">
            <div className="bg-red-50 text-red-700 p-6 rounded-lg mb-4">
                <FiAlertCircle className="w-12 h-12 mx-auto mb-3" />
                <p className="font-bold mb-2">Erreur d'Analyse</p>
                <p>{error}</p>
            </div>
            <Link to="/student/ai-upload" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                <FiArrowLeft /> Réessayer
            </Link>
        </div>
    );

    const gradeStyle = parsedAnalysis?.niveau ? gradeColors[parsedAnalysis.niveau] : gradeColors.C;

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
                    <FiBarChart2 className="text-indigo-500" />
                    Évaluation du Rapport
                </h1>
                <Link to="/student/ai-upload" className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-2">
                    <FiArrowLeft /> Analyser un autre rapport
                </Link>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 rounded-r-lg flex items-center gap-3">
                <FiAlertTriangle className="text-amber-600 flex-shrink-0 w-5 h-5" />
                <p className="text-sm text-amber-800 font-medium">{AI_DISCLAIMER}</p>
            </div>

            {parsedAnalysis ? (
                <>
                    {/* Grade Card - Hero Section */}
                    <div className={`${gradeStyle.bg} rounded-2xl p-8 mb-8 shadow-lg ring-4 ${gradeStyle.ring}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium mb-1">NOTE GLOBALE</p>
                                <div className="flex items-baseline gap-3">
                                    <span className={`text-6xl font-black ${gradeStyle.text}`}>{parsedAnalysis.note_globale}</span>
                                    <span className="text-3xl text-gray-500">/20</span>
                                </div>
                                <p className="mt-2 text-gray-700">{gradeDescriptions[parsedAnalysis.niveau]}</p>
                            </div>
                            <div className={`${gradeStyle.text} text-9xl font-black opacity-30`}>
                                {parsedAnalysis.niveau}
                            </div>
                        </div>
                        {parsedAnalysis.resume_executif && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-gray-700"><strong>Résumé:</strong> {parsedAnalysis.resume_executif}</p>
                            </div>
                        )}
                    </div>

                    {/* Grammar Section */}
                    <div className="bg-purple-50 rounded-xl p-6 mb-8 border border-purple-200">
                        <h2 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                            <FiEdit3 className="text-purple-600" />
                            Grammaire & Style
                        </h2>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-purple-200 text-purple-800 px-4 py-2 rounded-full font-bold text-lg">
                                {feedback?.grammar_issues_count || 0} problèmes détectés
                            </div>
                        </div>
                        {feedback?.grammar_samples && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {JSON.parse(feedback.grammar_samples).slice(0, 6).map((sample, i) => (
                                    <div key={i} className="bg-white p-3 rounded-lg text-sm text-gray-700 border border-purple-100">
                                        {sample}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Section Analysis Grid */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
                            <FiClipboard className="text-blue-400" />
                            Analyse des Sections
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {parsedAnalysis.sections_analysis && Object.entries(parsedAnalysis.sections_analysis).map(([key, data]) => (
                                <SectionCard key={key} name={key} data={data} />
                            ))}
                        </div>
                    </div>

                    {/* Points Forts & Points à Améliorer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Points Forts */}
                        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                            <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                                <FiCheckCircle className="text-green-600" />
                                Points Forts
                            </h2>
                            <div className="space-y-4">
                                {parsedAnalysis.points_forts?.map((point, i) => (
                                    <div key={i} className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                                        <h3 className="font-bold text-green-800">{point.titre}</h3>
                                        <p className="text-gray-700 text-sm mt-1">{point.description}</p>
                                        {point.impact && (
                                            <p className="text-green-600 text-xs mt-2 italic flex items-center gap-1">
                                                <HiOutlineLightBulb className="w-4 h-4" /> {point.impact}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Points à Améliorer */}
                        <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                            <h2 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                                <FiAlertTriangle className="text-orange-600" />
                                Points à Améliorer
                            </h2>
                            <div className="space-y-4">
                                {parsedAnalysis.points_ameliorer?.map((point, i) => (
                                    <div key={i} className="bg-white p-4 rounded-lg border-l-4 border-orange-500">
                                        <h3 className="font-bold text-orange-800">{point.titre}</h3>
                                        <p className="text-gray-700 text-sm mt-1">{point.description}</p>
                                        {point.suggestion && (
                                            <p className="text-orange-600 text-xs mt-2 italic flex items-center gap-1">
                                                <HiOutlineLightBulb className="w-4 h-4" /> {point.suggestion}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Conseils Prioritaires */}
                    {parsedAnalysis.conseils_prioritaires && (
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <FiTarget />
                                Conseils Prioritaires
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {parsedAnalysis.conseils_prioritaires.map((conseil, i) => (
                                    <div key={i} className="bg-white/10 backdrop-blur p-4 rounded-lg">
                                        <span className="bg-white text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg mb-2">{i + 1}</span>
                                        <p className="text-white/90">{conseil}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                /* Fallback for non-JSON response */
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FiFileText /> Analyse Détaillée
                    </h2>
                    <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap text-gray-700">{feedback?.ai_feedback}</pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AiFeedback;
