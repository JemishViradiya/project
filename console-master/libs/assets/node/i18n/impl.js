/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const i18next = require('i18next')
const Backend = require('i18next-fs-backend')
const { format } = require('./format')

i18next.use(Backend).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: [],
  supportedLngs: ['en', 'fr', 'de', 'es', 'it', 'ja', 'ko', 'pt', 'pt-BR'],
  debug: !!process.env.I18N_DEBUG,
  interpolation: {
    escapeValue: false,
    format,
  },
  react: {
    withRef: false,
    bindI18n: '',
    nsMode: 'default',
  },
  backend: {
    // path where resources get loaded from
    loadPath: path.join(__dirname, '../../../translations/src/{{ns}}/{{lng}}.json'),

    // path to save missing resources, same as loadPath to merge
    addPath: path.join(__dirname, '../../../translations/src/{{ns}}/{{lng}}.json'),

    stringify: (...args) => JSON.stringify(...args) + '\n',
  },
})

i18next.loadI18n = async () => i18next

module.exports = i18next
