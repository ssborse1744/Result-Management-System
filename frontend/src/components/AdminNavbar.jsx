import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminNavbar = () => {
  const navItems = [
    { path: 'upload-students', name: 'Upload Student List' },
    { path: 'results', name: 'Result Management' },
    { path: 'students', name: 'Students' },
    { path: 'classes', name: 'Class Setup' },
    { path: 'exports', name: 'Data Export' }
  ];
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium ${
                    isActive 
                      ? 'border-blue-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;