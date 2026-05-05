import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ar from './locales/ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar }
    },
    fallbackLng: 'ar',
    lng: 'ar', // Force Arabic for this project
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
