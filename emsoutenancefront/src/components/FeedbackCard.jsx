import React from 'react';

const FeedbackCard = ({ title, content, type = 'info' }) => {
    const typeStyles = {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        grammar: 'bg-purple-50 border-purple-200 text-purple-800'
    };

    return (
        <div className={`p-4 mb-4 border rounded-lg ${typeStyles[type]}`}>
            <h4 className="font-bold mb-2 uppercase text-xs tracking-wider">{title}</h4>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {content}
            </div>
        </div>
    );
};

export default FeedbackCard;
