import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import zhTwTranslations from './locales/zh-TW.json';

const resources = {
  en: {
    translation: enTranslations
  },
  'zh-TW': {
    translation: zhTwTranslations
  }
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Fallback language
    debug: false, // Set to true for development debugging
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    detection: {
      // Language detection options
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

export default i18n; 