import React, { useState } from 'react';
import { FiDownload, FiFileText, FiFile } from 'react-icons/fi';

const DataExport = () => {
  const [loading, setLoading] = useState({ results: false, students: false });
  const [error, setError] = useState('');

  const handleExport = async (type, format) => {
    setError('');
    setLoading(prev => ({ ...prev, [type]: true }));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/exports/${type}?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-export.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export data. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const exportOptions = [
    {
      title: 'Export Results',
      type: 'results',
      description: 'Generate reports of student results',
      formats: [
        { name: 'Excel', value: 'xlsx', icon: <FiFile className="text-green-500" /> },
        { name: 'PDF', value: 'pdf', icon: <FiFileText className="text-red-500" /> }
      ]
    },
    {
      title: 'Export Student Data',
      type: 'students',
      description: 'Download complete student database',
      formats: [
        { name: 'Excel', value: 'xlsx', icon: <FiFile className="text-green-500" /> },
        { name: 'CSV', value: 'csv', icon: <FiFileText className="text-blue-500" /> }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Data Export</h2>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exportOptions.map((option, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
            <p className="text-gray-600 mb-4">{option.description}</p>
            <div className="flex space-x-3">
              {option.formats.map((format, i) => (
                <button
                  key={i}
                  className={`flex items-center space-x-2 border px-4 py-2 rounded hover:bg-gray-50 ${
                    loading[option.type] ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => handleExport(option.type, format.value)}
                  disabled={loading[option.type]}
                >
                  {format.icon}
                  <span>{format.name}</span>
                  {loading[option.type] ? (
                    <span className="animate-spin">⌛</span>
                  ) : (
                    <FiDownload className="text-gray-400" />
                  )}
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