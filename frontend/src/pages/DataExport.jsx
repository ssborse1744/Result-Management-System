import React from 'react';
import { FiDownload, FiFileText, FiFile } from 'react-icons/fi';

const DataExport = () => {
  const exportOptions = [
    {
      title: "Export Results",
      description: "Generate Excel or PDF reports of student results",
      formats: [
        { type: "Excel", icon: <FiFile className="text-green-500" /> },
        { type: "PDF", icon: <FiFileText className="text-red-500" /> }
      ]
    },
    {
      title: "Export Student Data",
      description: "Download complete student database",
      formats: [
        { type: "CSV", icon: <FiFile className="text-blue-500" /> },
        { type: "Excel", icon: <FiFile className="text-green-500" /> }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Data Export</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exportOptions.map((option, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
            <p className="text-gray-600 mb-4">{option.description}</p>
            <div className="flex space-x-3">
              {option.formats.map((format, i) => (
                <button
                  key={i}
                  className="flex items-center space-x-2 border px-4 py-2 rounded hover:bg-gray-50"
                >
                  {format.icon}
                  <span>{format.type}</span>
                  <FiDownload className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataExport;