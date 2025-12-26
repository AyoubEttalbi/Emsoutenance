import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FileUpload from '../../components/FileUpload';
import aiService from '../../services/aiService';
import Loader from '../../components/Loader';
import { FiUpload, FiClock, FiCheckCircle, FiList, FiAward } from 'react-icons/fi';

const UploadReport = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleFileUpload = async (file) => {
        if (!file) return;

        setLoading(true);
        setMessage('Téléchargement et analyse en cours...');
        try {
            const data = await aiService.uploadReport(file, 'initial');
            setMessage('Analyse terminée! Redirection...');
            setTimeout(() => {
                navigate(`/student/ai-feedback/${data.report_id}`);
            }, 1500);
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || 'Échec du téléchargement. Veuillez réessayer.';
            setMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-100">AI Report Analysis</h1>
                <Link
                    to="/student/ai-history"
                    className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm"
                >
                    <FiClock className="w-4 h-4" />
                    View History
                </Link>
            </div>

            {/* Upload Section */}
            {loading ? (
                <Loader message={message} />
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                    <FileUpload onFileSelect={handleFileUpload} />

                    {message && !loading && (
                        <p className={`mt-4 text-center text-sm ${message.toLowerCase().includes('failed') || message.toLowerCase().includes('échec') || message.toLowerCase().includes('error') ? 'text-red-400' : 'text-green-400'}`}>
                            {message}
                        </p>
                    )}

                    {/* What we analyze - minimal */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-gray-500 text-xs text-center mb-3">This analysis includes:</p>
                        <div className="flex justify-center gap-6 text-gray-400 text-xs">
                            <span className="flex items-center gap-1"><FiCheckCircle className="text-green-500" /> Grammar</span>
                            <span className="flex items-center gap-1"><FiList className="text-blue-500" /> Structure</span>
                            <span className="flex items-center gap-1"><FiAward className="text-amber-500" /> Grade</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadReport;
