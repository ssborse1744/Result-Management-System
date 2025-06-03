import React, { useState, useRef } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';

const UploadStudentList = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a valid CSV or Excel file');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setMessage('');
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange({ target: { files: [droppedFile] } });
    }
  };

  const clearFile = () => {
    setFile(null);
    setMessage('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/students/bulk-upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || `Successfully uploaded ${data.count} students`);
        clearFile();
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Upload Student List</h2>
      
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="max-w-xl mx-auto">
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center space-y-4 cursor-pointer
              ${file ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="flex flex-col items-center space-y-2">
              <FiUpload className="w-12 h-12 text-gray-400" />
              {file ? (
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600 font-medium">{file.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-gray-600">
                    Drag & drop your CSV/Excel file here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    File should contain Roll Number, Name, and Class columns
                  </p>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {message && (
            <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{message}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`
                flex items-center px-6 py-2 rounded-md text-white
                ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
              `}
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadStudentList; 