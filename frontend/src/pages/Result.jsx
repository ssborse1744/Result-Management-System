import React from 'react';
import { useParams } from 'react-router-dom';

const Result = () => {
  const { instituteId, rollNumber } = useParams();

  // Mock data (replace with API fetch later)
  const resultData = {
    name: 'John Doe',
    rollNumber: rollNumber,
    institute: instituteId,
    grades: {
      Math: 'A',
      Science: 'B+',
      History: 'A-',
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Result</h2>
        <div className="space-y-4">
          <p><span className="font-semibold">Name:</span> {resultData.name}</p>
          <p><span className="font-semibold">Roll No:</span> {resultData.rollNumber}</p>
          <p><span className="font-semibold">Institute:</span> {resultData.institute}</p>
          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold mb-2">Grades:</h3>
            {Object.entries(resultData.grades).map(([subject, grade]) => (
              <p key={subject}>{subject}: {grade}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;