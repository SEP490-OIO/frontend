/**
 * i18n Configuration — internationalization setup.
 *
 * Uses react-i18next to support Vietnamese (primary) + English (secondary).
 * All user-facing text goes through the t() function — no hardcoded strings.
 *
 * Translation files are organized by namespace:
 *   src/locales/vi/common.json  — Vietnamese translations
 *   src/locales/en/common.json  — English translations
 *
 * As features are built, add new namespace files:
 *   src/locales/vi/auction.json — Auction-specific Vietnamese text
 *   src/locales/en/auction.json — Auction-specific English text
 *
 * Usage in components:
 *   const { t } = useTranslation();
 *   <h1>{t('home.hero')}</h1>
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files directly (bundled with the app).
// For a larger app, these could be loaded lazily via i18next-http-backend.
import viCommon from '@/locales/vi/common.json';
import enCommon from '@/locales/en/common.json';

i18n
  // Detect user's browser language preference
  .use(LanguageDetector)
  // Connect i18next to React
  .use(initReactI18next)
  .init({
    resources: {
      vi: { common: viCommon },
      en: { common: enCommon },
    },

    // Vietnamese is the primary language (Decision #6)
    fallbackLng: 'vi',

    // Default namespace — matches our translation file names
    defaultNS: 'common',
    ns: ['common'],

    // Detect language from: localStorage > browser setting
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
    },

    interpolation: {
      // React already escapes values, so we don't need i18next to do it
      escapeValue: false,
    },
  });

export { i18n };
