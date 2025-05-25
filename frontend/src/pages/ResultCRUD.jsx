import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiSearch, FiArrowRight, FiX } from 'react-icons/fi';

const ResultCRUD = () => {
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [rollInput, setRollInput] = useState('');
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing results
  useEffect(() => {
    fetchResults();
    fetchSubjects();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/results`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setResults(data);
      }
    } catch (err) {
      setError('Failed to fetch results');
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/subjects`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setSubjects(data);
      } else {
        throw new Error(data.error || 'Failed to fetch subjects');
      }
    } catch (err) {
      setError('Failed to fetch subjects: ' + err.message);
      console.error('Subject fetch error:', err);
    }
  };

  const handleRollSubmit = async (e) => {
    e.preventDefault();
    if (!rollInput.trim()) {
      setError('Please enter a roll number');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/students/roll/${rollInput}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await res.json();
      if (res.ok && data) {
        setStudent(data);
        // Initialize marks array with current subjects
        if (subjects.length === 0) {
          setError('No subjects found. Please add subjects first.');
          return;
        }
        setMarks(subjects.map(subj => ({
          subject: subj._id,
          name: subj.name,
          marks: '',
          grade: ''
        })));
        setStep(2);
      } else {
        throw new Error(data.error || 'Student not found');
      }
    } catch (err) {
      setError(err.message || 'Server error');
      console.error('Student fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrade = (marks) => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    if (marks >= 40) return 'D';
    return 'F';
  };

  const handleMarksChange = (index, value) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      // Allow empty string for clearing input
      if (value === '') {
        setMarks(marks.map((m, i) => 
          i === index ? { ...m, marks: '', grade: '' } : m
        ));
      }
      return;
    }
    
    // Validate marks range
    if (numValue < 0 || numValue > 100) return;

    setMarks(marks.map((m, i) => 
      i === index ? { 
        ...m, 
        marks: numValue.toString(),
        grade: calculateGrade(numValue)
      } : m
    ));
  };

  const resetForm = () => {
    setStep(1);
    setRollInput('');
    setStudent(null);
    setMarks([]);
    setError('');
    setShowModal(false); // Close modal after form reset
  };

  const handleSubmitResult = async () => {
    // Validate all marks are entered
    if (!student || marks.some(m => m.marks === '')) {
      setError('Please enter marks for all subjects');
      return;
    }

    setLoading(true);
    setError('');

    const totalMarks = marks.reduce((sum, m) => sum + parseInt(m.marks), 0);
    const percentage = (totalMarks / (marks.length * 100)) * 100;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          student: student._id,
          subjects: marks.map(m => ({
            subject: m.subject,
            marks: parseInt(m.marks),
            grade: m.grade
          })),
          examDate: new Date(),
          totalMarks,
          percentage
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setResults([...results, data]);
        resetForm();
      } else {
        throw new Error(data.error || 'Failed to save result');
      }
    } catch (err) {
      setError(err.message || 'Failed to save result');
      console.error('Result submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this result?')) return;
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/results/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (res.ok) {
        setResults(results.filter(r => r._id !== id));
      } else {
        throw new Error('Failed to delete result');
      }
    } catch (err) {
      setError('Failed to delete result');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Result Management</h2>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setShowModal(true)}
        >
          Add New Result
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Result Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {step === 1 ? 'Enter Student Roll Number' : 'Enter Marks'}
              </h3>
              <button 
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleRollSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={rollInput}
                    onChange={(e) => setRollInput(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter student roll number"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-4 py-2 rounded text-white ${
                    loading 
                      ? 'bg-blue-300 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {loading ? 'Searching...' : 'Find Student'}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Student Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-lg mb-2">Student Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{student?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Roll Number</p>
                      <p className="font-medium">{student?.rollNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Class</p>
                      <p className="font-medium">{student?.class}</p>
                    </div>
                  </div>
                </div>

                {/* Marks Entry */}
                <div>
                  <h4 className="font-medium text-lg mb-4">Enter Marks</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-100 rounded-t">
                      <div className="col-span-6">
                        <span className="font-medium">Subject</span>
                      </div>
                      <div className="col-span-3 text-center">
                        <span className="font-medium">Marks</span>
                      </div>
                      <div className="col-span-3 text-center">
                        <span className="font-medium">Grade</span>
                      </div>
                    </div>
                    
                    {marks.map((mark, index) => (
                      <div key={mark.subject} className="grid grid-cols-12 gap-4 px-4 py-2 bg-white rounded border">
                        <div className="col-span-6 flex items-center">
                          <span>{mark.name}</span>
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={mark.marks}
                            onChange={(e) => handleMarksChange(index, e.target.value)}
                            className="w-full p-2 border rounded text-center"
                            placeholder="0-100"
                          />
                        </div>
                        <div className="col-span-3 flex items-center justify-center">
                          <span className={`font-medium ${
                            mark.grade === 'F' ? 'text-red-500' : 'text-green-600'
                          }`}>
                            {mark.grade || '-'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 border rounded hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmitResult}
                    disabled={loading}
                    className={`px-6 py-2 rounded text-white ${
                      loading 
                        ? 'bg-blue-300 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {loading ? 'Saving...' : 'Submit Result'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center mb-4">
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by roll number..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Roll No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Subjects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results
                .filter(result => 
                  result.student?.rollNumber?.includes(searchTerm)
                )
                .map((result) => (
                  <tr key={result._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {result.student?.rollNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {result.student?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {result.student?.class}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {result.subjects.map((sub, idx) => (
                          <div key={idx}>
                            {sub.name}: {sub.marks} ({sub.grade})
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(result._id)}
                        className="text-red-500 hover:text-red-700"
                      >
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