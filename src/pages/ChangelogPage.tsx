import React from 'react';
import { useTranslation } from 'react-i18next';

const ChangelogPage: React.FC = () => {
  const { t } = useTranslation(); // Add i18n translation hook

  return (
    <div className="neo-page">
      {/* Header */}
      <div className="neo-text-center neo-mb-8">
        <h1 className="neo-text-4xl neo-font-black neo-mb-4">{t('changelog.title')}</h1>
        <p className="neo-text-xl neo-font-bold">{t('changelog.subtitle')}</p>
      </div>
      
      <div className="neo-container-centered neo-max-w-4xl">
        {/* Changelog v0.02 */}
        <div className="neo-card neo-p-6 bg-neo-surface neo-mb-6">
          <h2 className="neo-text-2xl neo-font-black neo-mb-2">Changelog v0.02</h2>
          <p className="neo-text-lg neo-font-bold neo-mb-4" style={{ color: '#666' }}>2025.06.10</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li className="neo-font-bold neo-mb-2">• Added navigation bar to improve site navigation</li>
            <li className="neo-font-bold neo-mb-2">• Added About us, Contact, Wishlist, Login page</li>
          </ul>
        </div>

        {/* Changelog v0.01 */}
        <div className="neo-card neo-p-6 bg-neo-surface neo-mb-6">
          <h2 className="neo-text-2xl neo-font-black neo-mb-2">Changelog v0.01</h2>
          <p className="neo-text-lg neo-font-bold neo-mb-4" style={{ color: '#666' }}>2025.06.05</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li className="neo-font-bold neo-mb-2">• Create and manage class</li>
            <li className="neo-font-bold neo-mb-2">• Add question and publish question in real time for teacher</li>
            <li className="neo-font-bold neo-mb-2">• Answer question and see result in real time for student</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChangelogPage; 