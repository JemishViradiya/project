import { environment } from './environments/environment'

declare const self: ServiceWorkerGlobalScope & typeof globalThis

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
self.workboxManifest = self.__WB_MANIFEST || []

self.__WB_DISABLE_DEV_LOGS = true

declare global {
  interface WorkerGlobalScope {
    workboxManifest: {
      url: string
      revision: string
    }[]
    swConfig: {
      productionInDev: boolean
      isProduction: boolean
      allowOffline: boolean
      maintenancePage: string
      networkOnlyPatterns: RegExp[]
      precacheDevExcludeAssetPattern: RegExp
      precacheOptions: {
        cleanURLs: boolean
      }
      pwaPattern: RegExp
      handledNavigationPatterns: RegExp[]
      skippedNavigationPatterns: RegExp[]
      networkOnlyHandler?: boolean
      fetchOptions: RequestInit & { cacheMode: 'default' | 'no-store' | 'reload' | 'force-cache' | 'only-if-cached' }
      publicPath: string
      mediaTypes?: Set<string>
      mediaExtensions?: RegExp
      dataCacheExpirationTime?: number
    }
    baseURI: string
  }
}

const resolvePublicPath = () => {
  self.baseURI = self.registration.scope // self.location.href.replace(/[^/]*$/, '')
  const url = new URL(self.baseURI)
  const publicPath = url.href.slice(url.origin.length)
  console.log('[ServiceWorker] Scope', publicPath)
  return publicPath
}

const publicPath = resolvePublicPath()

self.swConfig = {
  productionInDev: false,

  isProduction: environment.production,

  // serve application site on navigation load failure
  allowOffline: false,

  // path to error template
  maintenancePage: '/maintenancePage.html',

  // cache denylist for non-navigation requests
  networkOnlyPatterns: ['/sockjs-node', 'hot-update[.]json', 'clientParams$', '/stanley/', `^${publicPath}sw.js`].map(
    p => new RegExp(p),
  ),
  // precache denylist for development-mode non-navigation requests
  precacheDevExcludeAssetPattern: /^\/static\/(js|css)\//,
  // workbox-precache options
  precacheOptions: {
    cleanURLs: false,
  },

  // cache allowlist for pwa requests
  pwaPattern: new RegExp(`^${publicPath}pwa/`),

  // cache allowlist for navigation requests
  handledNavigationPatterns: [new RegExp(`^${publicPath}uc/.*/?$`)],
  skippedNavigationPatterns: [new RegExp(`^${publicPath}uc/session/(login|login-complete|sso|logout|logout-complete)([?].*)?$`)],

  fetchOptions: {
    // CORS mode: cors | no-cors | sameorigin
    // mode: 'no-cors',
    // Http Cache mode: default | no-store | reload | force-cache | only-if-cached
    cacheMode: 'default',
    // Referrer policy: no-referrer | no-referrer-when-downgrade | same-origin | origin | strict-origin | origin-when-cross-origin | strict-origin-when-cross-origin |  unsafe-url | ''
    referrerPolicy: 'no-referrer',
  },

  publicPath: publicPath.slice(0, -1),

  dataCacheExpirationTime: 10 * 60,
}
