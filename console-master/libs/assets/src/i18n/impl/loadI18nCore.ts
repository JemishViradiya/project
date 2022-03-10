/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { InitOptions } from 'i18next'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-chained-backend'
import HttpBackend from 'i18next-http-backend'
import LocalStorageBackend from 'i18next-localstorage-backend'
import { initReactI18next } from 'react-i18next'

import { getReviewSiteId } from '../../utils/network'
import { version } from '../translations-version'

const envOptions =
  process.env.NODE_ENV === 'production' || process.env.STORYBOOK === 'true' || process.env.NODE_CONFIG_ENV === 'test'
    ? {}
    : {
        saveMissing: true,
      }

const getExpirationTime = () => {
  try {
    return parseInt(localStorage.i18n_cache_expiration, 10)
  } catch (_) {
    return 7 * 24 * 60 * 60 * 1000
  }
}

interface LanguageUtil {
  getScriptPartFromCode(code: string): string
  getLanguagePartFromCode(code: string): string
  formatLanguageCode(code: string): string
  isSupportedCode(code: string): boolean
  isSupportedLanguage(code: string): boolean
  getBestMatchFromCodes(code: string[]): string
  getFallbackCodes(fallbacks: string | string[] | ((code: string) => string), code: string): string[]
  toResolveHierarchy(code: string, fallbackCode: string): string[]
}

type Options = Partial<InitOptions> & {
  prefix?: string
  react?: InitOptions['react']
  detection?: InitOptions['detection']
  format?: (value: unknown, format: string, lng: string) => string
}

const defaultSupportedLngs = ['de-DE', 'en-US', 'es-ES', 'fr-FR', 'it-IT', 'ja-JP', 'ko-KR', 'pt-PT']
if (process.env.NODE_ENV !== 'production') defaultSupportedLngs.push('dev')

const loadI18nCore = (
  env: string | 'development',
  { format = undefined, react = undefined, detection = undefined, prefix = '', ...opts }: Options = {},
  // eslint-disable-next-line sonarjs/cognitive-complexity
): void => {
  const reviewSiteId = getReviewSiteId()
  const isGecko = 'MozAppearance' in (document?.body?.style || {})

  const fallbackLang = process.env.NODE_ENV === 'production' ? 'en' : 'dev'
  const supportedLangs = ['en', 'fr', 'de', 'es', 'it', 'ja', 'ko', 'pt-BR', 'pt']
  if (process.env.NODE_ENV !== 'production') supportedLangs.push('dev')

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
    // learn more: https://github.com/i18next/i18next-http-backend
    .use(Backend)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
      // do not load a fallback language when using non-english
      // to enable fallback, set value to one of supportedLngs
      fallbackLng: fallbackLang,

      supportedLngs: supportedLangs,
      load: 'currentOnly',
      debug: env === 'development',

      ...envOptions,

      detection: {
        order: ['querystring', 'sessionStorage', 'navigator'],
        caches: [],
        lookupsessionStorage: 'lng',
        ...detection,
      },

      react: {
        // bindI18n: '',
        bindI18n: 'languageChanged loaded',
        nsMode: 'default',
        transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
        ...react,
      },

      interpolation: {
        escapeValue: false,
        format,
      },

      backend: {
        backends: [
          LocalStorageBackend, // primary
          HttpBackend, // fallback
        ],
        backendOptions: [
          {
            prefix: reviewSiteId + (reviewSiteId.length ? '_' : '') + 'i18next_res_',
            expirationTime: getExpirationTime(),
            defaultVersion: version,
          },
          {
            // path where resources get loaded from, or a function
            // returning a path:
            // function(lngs, namespaces) { return customPath; }
            // the returned path will interpolate lng, ns if provided like giving a static path
            loadPath: prefix + 'uc/cdn/translations/{{ns}}/{{lng}}.json',

            // path to post missing resources
            addPath: prefix + 'uc/i18n/add/{{ns}}/{{lng}}',

            // requestOptions: // used for fetch, can also be a function (payload) => ({ method: 'GET' })
            requestOptions: {
              mode: 'same-origin',
              credentials: 'omit',
              cache: 'default',
            },

            // // adds parameters to resource URL. 'example.com' -> 'example.com?v=1.3.5'
            queryStringParams: { v: version },
          },
        ],
      },

      ...opts,
    })

  // custom language resolution to match venue
  const languageUtils = i18n.services.languageUtils as LanguageUtil
  languageUtils.getBestMatchFromCodes = function getBestMatchFromCodes(codes: string[]) {
    if (!codes) return null
    for (const code of codes) {
      const cleanedLng = this.formatLanguageCode(code)
      if (!cleanedLng) continue

      if (this.isSupportedCode(cleanedLng)) return cleanedLng

      // ref: UES-7010
      if (isGecko) {
        if (defaultSupportedLngs.includes(cleanedLng)) return this.getLanguagePartFromCode(cleanedLng)
        continue
      }

      const baseLng = this.getLanguagePartFromCode(cleanedLng)
      if (this.isSupportedCode(baseLng)) return baseLng
    }

    return this.getFallbackCodes(this.options.fallbackLng || 'en')[0] || null
  }
}

export { loadI18nCore }
