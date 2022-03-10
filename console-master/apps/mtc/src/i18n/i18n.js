import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import * as en from './locales/en.json'
import * as fr from './locales/fr.json'

const resources = {
  en: {
    translation: {
      ...en.default,
    },
  },
  fr: {
    translation: {
      ...fr.default,
    },
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources,
  })

export default i18n
