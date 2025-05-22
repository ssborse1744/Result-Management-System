import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-blue-800 mb-4">
          Student Result Management System
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          A secure platform for students to check their academic results and for 
          administrators to manage result data efficiently.
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/checkresult')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition"
          >
            Check Result
          </button>
          <button
            onClick={() => navigate('/admin-login')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition"
          >
            Login as Admin
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
  <div className="container mx-auto px-4">
    <div className="text-center">
      <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
      <div className="space-y-2">
        <p className="text-gray-300">Sarthak Borse</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 text-gray-400">
          <a href="tel:8010833596" className="hover:text-white transition">
            <span>📞 8010833596</span>
          </a>
          <a href="mailto:ssborse2004@gmail.com" className="hover:text-white transition">
            <span>✉ ssborse2004@gmail.com</span>
          </a>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-gray-700">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Student Result Management System. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
};

export default Home;