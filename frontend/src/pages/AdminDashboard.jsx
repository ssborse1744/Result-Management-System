import React from 'react';
// import HeroSection from './HeroSection';
import HeroSection from '../components/HeroSection';
// import FeaturesGrid from './FeaturesGrid';
import FeaturesGrid from '../components/FeaturesGrid';
// import CTASection from './CTASection';
import CTASection from '../components/CTASection';
import AdminNavbar from '../components/AdminNavbar';

const Dashboard = () => {
  return (
    <div className="space-y-8">
    <AdminNavbar/>
      <HeroSection 
        title="Result Management System"
        subtitle="Empowering educators with streamlined result processing"
        quote="Education is not the filling of a pail, but the lighting of a fire."
        author="William Butler Yeats"
      />
      
      <FeaturesGrid />
      
      <CTASection 
        title="Ready to transform your workflow?"
        description="Our system handles 500+ concurrent users with 99.9% uptime, ensuring seamless result management during peak periods."
        
      />
    </div>
  );
};

export default Dashboard;