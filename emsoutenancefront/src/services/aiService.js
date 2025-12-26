import api from './api';

const aiService = {
    /**
     * Upload a PDF/DOCX report for AI analysis.
     * @param {File} file 
     * @param {string} version 
     */
    uploadReport: async (file, version) => {
        const formData = new FormData();
        formData.append('report', file);
        formData.append('version', version);

        const response = await api.post('/reports/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    /**
     * Fetch AI feedback for a report.
     * @param {number} reportId 
     */
    getAiFeedback: async (reportId) => {
        const response = await api.get(`/reports/${reportId}/ai-feedback`);
        return response.data;
    },

    /**
     * Get report history for the current student.
     */
    getHistory: async () => {
        const response = await api.get('/reports/history');
        return response.data;
    }
};

export default aiService;
