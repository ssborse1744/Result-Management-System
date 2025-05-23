import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';

const ClassConfig = () => {
  const [classes, setClasses] = useState(['10A', '10B', '11A']);
  const [subjects, setSubjects] = useState(['Math', 'Science', 'English']);
  const [newClass, setNewClass] = useState('');
  const [newSubject, setNewSubject] = useState('');

  const addClass = () => {
    if (newClass && !classes.includes(newClass)) {
      setClasses([...classes, newClass]);
      setNewClass('');
    }
  };

  const addSubject = () => {
    if (newSubject && !subjects.includes(newSubject)) {
      setSubjects([...subjects, newSubject]);
      setNewSubject('');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Academic Configuration</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Class Management */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="bg-blue-100 p-2 rounded-full mr-3">🏫</span>
            Manage Classes
          </h3>
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Add new class"
              className="flex-grow p-2 border rounded-l"
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
            />
            <button 
              onClick={addClass}
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
            >
              <FiPlus />
            </button>
          </div>
          <ul className="border rounded divide-y">
            {classes.map((cls, index) => (
              <li key={index} className="p-3 flex justify-between items-center">
                {cls}
                <button className="text-red-500 hover:text-red-700">
                  <FiTrash2 />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Subject Management */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="bg-green-100 p-2 rounded-full mr-3">📚</span>
            Manage Subjects
          </h3>
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Add new subject"
              className="flex-grow p-2 border rounded-l"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
            <button 
              onClick={addSubject}
              className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600"
            >
              <FiPlus />
            </button>
          </div>
          <ul className="border rounded divide-y">
            {subjects.map((subject, index) => (
              <li key={index} className="p-3 flex justify-between items-center">
                {subject}
                <button className="text-red-500 hover:text-red-700">
                  <FiTrash2 />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClassConfig;