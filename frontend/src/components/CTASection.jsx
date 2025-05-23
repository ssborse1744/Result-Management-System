import React from 'react';

const CTASection = ({ title, description, primaryBtn, secondaryBtn }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          {description}
        </p>
        
      </div>
    </div>
  );
};

export default CTASection;