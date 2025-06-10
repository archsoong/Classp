import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="neo-page">
      <div className="neo-container-centered neo-max-w-4xl">
        <div className="neo-card neo-p-8 bg-neo-surface">
          <div className="neo-text-center neo-mb-8">
            <h1 className="neo-text-4xl neo-font-black neo-mb-4">Contact</h1>
            <p className="neo-text-xl neo-font-bold">Get in touch with the Classp team</p>
          </div>
          
          <div className="neo-text-center">
            <div style={{ fontSize: '80px', marginBottom: '24px' }}>📧</div>
            <h2 className="neo-text-2xl neo-font-black neo-mb-4">Coming Soon</h2>
            <p className="neo-font-bold">
              This page will contain contact information, support options, and ways to reach out to our team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 