import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckResult = () => {
  const navigate = useNavigate();
  const [instituteId, setInstituteId] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock validation (replace with API call later)
    if (instituteId === 'SCHOOL123' && rollNumber === '2024') {
      navigate(`/result/${instituteId}/${rollNumber}`); // Redirect to result page
    } else {
      setError('Invalid credentials. Try: SCHOOL123 / 2024');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Check Your Result</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Institute ID</label>
            <input
              type="text"
              value={instituteId}
              onChange={(e) => setInstituteId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Roll Number</label>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Check Result
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckResult;