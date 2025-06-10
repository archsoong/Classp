import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  // Toggle between English and Traditional Chinese
  const toggleLanguage = () => {
    const currentLang = i18n.language;
    const newLang = currentLang === 'zh-TW' ? 'en' : 'zh-TW';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="neo-main-nav-link"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '4px',
        cursor: 'pointer',
        border: 'none',
        background: 'none',
        color: 'inherit',
        fontSize: 'inherit',
        fontWeight: 'inherit',
        textDecoration: 'none'
      }}
      title={t('language.switch')}
    >
      🌐 {i18n.language === 'zh-TW' ? t('language.english') : t('language.chinese')}
    </button>
  );
};

export default LanguageSwitcher; 