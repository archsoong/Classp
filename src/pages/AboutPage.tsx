import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="neo-page">
      <div className="neo-container-centered neo-max-w-4xl">
        <div className="neo-card neo-p-8 bg-neo-surface">
          <div className="neo-text-center neo-mb-8">
            <h1 className="neo-text-4xl neo-font-black neo-mb-4">About</h1>
            <p className="neo-text-xl neo-font-bold">Learn more about Classp</p>
          </div>
          
          <div className="neo-text-center">
            <div style={{ fontSize: '80px', marginBottom: '24px' }}>ℹ️</div>
            <h2 className="neo-text-2xl neo-font-black neo-mb-4">Coming Soon</h2>
            <p className="neo-font-bold">
              This page will contain information about Classp, our mission, and how we're transforming classroom interactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 