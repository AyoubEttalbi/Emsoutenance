import React from 'react';

const Loader = ({ message = "Processing..." }) => (
    <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
    </div>
);

export default Loader;
