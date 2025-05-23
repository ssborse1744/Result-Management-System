import React from 'react';

const HeroSection = ({ title, subtitle, quote, author }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-xl mb-6">{subtitle}</p>
      <blockquote className="border-l-4 border-white pl-4 italic">
        "{quote}"
        <footer className="mt-2 text-blue-100">— {author}</footer>
      </blockquote>
    </div>
  );
};

export default HeroSection;