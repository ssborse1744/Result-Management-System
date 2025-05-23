import React from 'react';

const BulkUpload = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Bulk Result Upload</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <p className="text-gray-500 mb-4">Drag & drop CSV/Excel file here</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Select File
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;