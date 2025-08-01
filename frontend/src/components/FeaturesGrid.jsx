import React from 'react';
// import FeatureCard from './FeatureCard';
import FeatureCard from './FeatureCard';
import { FiUpload, FiEdit, FiUsers, FiBook, FiDownload } from 'react-icons/fi';

const FeaturesGrid = () => {
  const features = [
    {
      icon: <FiUpload className="text-blue-500 text-2xl" />,
      title: "Upload Student List",
      desc: "Upload student records easily via CSV/Excel files"
    },
    {
      icon: <FiEdit className="text-green-500 text-2xl" />,
      title: "Result Management",
      desc: "Edit individual student grades with precision"
    },
    {
      icon: <FiUsers className="text-purple-500 text-2xl" />,
      title: "Student Database",
      desc: "Centralized repository for all student records"
    },
    {
      icon: <FiBook className="text-yellow-500 text-2xl" />,
      title: "Academic Setup",
      desc: "Configure classes, subjects, and grading systems"
    },
    {
      icon: <FiDownload className="text-red-500 text-2xl" />,
      title: "Data Export",
      desc: "Generate PDF reports and Excel sheets with one click"
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.desc}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturesGrid;