import React from 'react';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
      <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;