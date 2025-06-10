import React from 'react';

const WishlistPage: React.FC = () => {
  return (
    <div className="neo-page">
      <div className="neo-container-centered neo-max-w-4xl">
        <div className="neo-card neo-p-8 bg-neo-surface">
          <div className="neo-text-center neo-mb-8">
            <h1 className="neo-text-4xl neo-font-black neo-mb-4">Wishlist</h1>
            <p className="neo-text-xl neo-font-bold">Features and improvements we're planning</p>
          </div>
          
          <div className="neo-text-center">
            <div style={{ fontSize: '80px', marginBottom: '24px' }}>🌟</div>
            <h2 className="neo-text-2xl neo-font-black neo-mb-4">Coming Soon</h2>
            <p className="neo-font-bold">
              This page will showcase upcoming features, user requests, and our roadmap for Classp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage; 