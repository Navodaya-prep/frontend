import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import hi from './hi.json';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
];

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
    },
    lng: 'en',            // default; overridden on startup from stored preference
    fallbackLng: 'en',
    compatibilityJSON: 'v3', // React Native (Hermes) lacks Intl.PluralRules
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export default i18n;
