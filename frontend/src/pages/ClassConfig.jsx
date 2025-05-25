import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const SubjectConfig = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

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
      }
    } catch (err) {
      setError('Failed to fetch subjects');
    }
  };

  const addSubject = async () => {
    if (!newSubject.trim()) {
      setError('Subject name cannot be empty');
      return;
    }

    if (subjects.find(s => s.name.toLowerCase() === newSubject.toLowerCase())) {
      setError('Subject already exists');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: newSubject,
          instituteId: localStorage.getItem('instituteId')
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setSubjects([...subjects, data]);
        setNewSubject('');
      } else {
        throw new Error(data.error || 'Failed to add subject');
      }
    } catch (err) {
      setError(err.message || 'Failed to add subject');
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/subjects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (res.ok) {
        setSubjects(subjects.filter(s => s._id !== id));
      } else {
        throw new Error('Failed to delete subject');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete subject');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Subject Management</h2>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Add new subject (e.g., Mathematics)"
            className="flex-grow p-2 border rounded-l focus:outline-none focus:border-blue-500"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
          />
          <button 
            onClick={addSubject}
            disabled={loading}
            className={`px-4 py-2 rounded-r text-white ${
              loading 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Adding...' : <FiPlus />}
          </button>
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Available Subjects</h3>
          {subjects.length === 0 ? (
            <p className="text-gray-500 italic">No subjects added yet</p>
          ) : (
            <ul className="border rounded-lg divide-y">
              {subjects.map((subject) => (
                <li 
                  key={subject._id} 
                  className="p-3 flex justify-between items-center hover:bg-gray-50"
                >
                  <span>{subject.name}</span>
                  <button
                    onClick={() => deleteSubject(subject._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectConfig;