import i18n from 'i18next'

import { I18nFormats, loadI18n } from '@ues/assets/i18n'

loadI18n(process.env.NODE_ENV || 'production', {
  ns: [],
  prefix: '/',
})

export const loadNamespaces = async (...ns: string[]) => {
  await i18n.loadNamespaces(ns)
  return i18n.getFixedT(null, ns[0])
}

export { i18n, I18nFormats }

// export const t = (key: string) => i18n.t(key)

export default i18n
