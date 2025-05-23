import React from 'react';
import { FiBell, FiHelpCircle, FiChevronDown } from 'react-icons/fi';
import { useLocation, Link } from 'react-router-dom';

const AdminHeader = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Breadcrumbs */}
        <div className="flex items-center">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link to="/admin" className="text-gray-400 hover:text-gray-500">
                  <span className="text-blue-500 font-medium">Admin</span>
                </Link>
              </li>
              {pathnames.map((path, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                const name = path.replace('-', ' ');
                
                return (
                  <li key={path}>
                    <div className="flex items-center">
                      <span className="mx-2 text-gray-300">/</span>
                      {isLast ? (
                        <span className="text-gray-600 capitalize">{name}</span>
                      ) : (
                        <Link 
                          to={routeTo} 
                          className="text-blue-500 hover:text-blue-600 capitalize"
                        >
                          {name}
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Right-side controls */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:text-gray-600 relative">
            <FiBell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
          <button className="p-2 text-gray-500 hover:text-gray-600">
            <FiHelpCircle className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              A
            </div>
            <span className="text-gray-700 font-medium">Admin</span>
            <FiChevronDown className="text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;