import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Result = () => {
  const { instituteId, rollNumber } = useParams();
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/results/check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ instituteId, rollNumber })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch result');
        }
        setResultData(data);
      } catch (err) {
        setError(err.message || 'Server error');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [instituteId, rollNumber]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg text-gray-600">Loading result...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg text-red-500">{error}</div>
    </div>
  );

  if (!resultData) return null;

  const { student, subjects, totalMarks, percentage, examDate } = resultData;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full mx-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Result Card</h2>
          <p className="text-gray-600">Exam Date: {new Date(examDate).toLocaleDateString()}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Student Details</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {student.name}</p>
              <p><span className="font-medium">Roll No:</span> {student.rollNumber}</p>
              <p><span className="font-medium">Class:</span> {student.class}</p>
              <p><span className="font-medium">Institute ID:</span> {student.instituteId}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Result Summary</h3>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-blue-600">{percentage.toFixed(2)}%</p>
              <p className="text-lg"><span className="font-medium">Total Marks:</span> {totalMarks}</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left font-semibold text-gray-600">Subject</th>
                <th className="px-4 py-2 text-center font-semibold text-gray-600">Marks</th>
                <th className="px-4 py-2 text-center font-semibold text-gray-600">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {subjects.map((subject, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{subject.name}</td>
                  <td className="px-4 py-3 text-center">{subject.marks}</td>
                  <td className={`px-4 py-3 text-center font-medium ${
                    subject.grade === 'F' ? 'text-red-500' : 'text-green-600'
                  }`}>
                    {subject.grade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.print()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Print Result
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;