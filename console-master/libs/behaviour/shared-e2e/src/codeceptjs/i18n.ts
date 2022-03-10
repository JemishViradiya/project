import Assets from '@ues/assets/node'

const { i18next } = Assets

i18next.loadI18n(process.env.NODE_ENV || 'production', {
  ns: [],
  prefix: '/',
})

export const loadNamespaces = async (...ns: string[]) => {
  await i18next.loadNamespaces(ns)
  return i18next.getFixedT(null, ns[0])
}

export default i18next
