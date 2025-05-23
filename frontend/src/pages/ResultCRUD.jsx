import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';

const ResultCRUD = () => {
  const [results, setResults] = useState([
    { id: 1, rollNo: '101', name: 'John Doe', math: 'A', science: 'B+', english: 'A-' },
    { id: 2, rollNo: '102', name: 'Jane Smith', math: 'B', science: 'A', english: 'B+' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResults = results.filter(result =>
    result.rollNo.includes(searchTerm) || 
    result.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Result Management</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add New Result
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center mb-4">
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by roll no or name..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Math</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Science</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">English</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result) => (
                <tr key={result.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{result.rollNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{result.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{result.math}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{result.science}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{result.english}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      <FiEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultCRUD;