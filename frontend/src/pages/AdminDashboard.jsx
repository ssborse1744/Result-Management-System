import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
// import Sidebar from '../../components/admin/Sidebar';
import AdminHeader from '../components/AdminHeader';

const Dashboard = () => {
  return (
    <div className="flex h-screen flex-col">
      {/* Top Navbar */}
      <AdminNavbar />
      
      <div className="flex flex-1 overflow-hidden">
        
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page Header */}
         <AdminHeader/>
          
          {/* Feature Pages Render Here */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;