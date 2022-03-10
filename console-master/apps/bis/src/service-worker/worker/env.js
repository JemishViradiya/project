self.workboxManifest = self.__WB_MANIFEST

self.__WB_DISABLE_DEV_LOGS = true

self.swConfig = {
  productionInDev: false,

  isProduction: process.env.NODE_ENV === 'production',

  // serve maintenance page on navigation load failure
  allowOffline: false,

  // path to error template
  maintenancePage: '/maintenancePage.html',

  // cache denylist for non-navigation requests
  networkOnlyPatterns: [/\/sockjs-node/, /hot-update[.]json/, /clientParams$/, /\/stanley\//, /^\/sw.js$/],
  // precache denylist for development-mode non-navigation requests
  precacheDevExcludeAssetPattern: /^\/static\/(js|css)\//,
  // workbox-precache options
  precacheOptions: {
    cleanURLs: false,
  },

  // cache allowlist for pwa requests
  pwaPattern: /^\/pwa\//,

  // cache denylist for navigation requests
  networkOnlyNavigationPatterns: [
    // non-tenant urls
    /^\/[^/]+$/,
    // tenant routes
    /^\/[^/]+\/(login|logout|loggedOut|session)/,
  ],

  fetchOptions: {
    // CORS mode: cors | no-cors | sameorigin
    // mode: 'no-cors',
    // Http Cache mode: default | no-store | reload | force-cache | only-if-cached
    cacheMode: 'default',
    // Referrer policy: no-referrer | no-referrer-when-downgrade | same-origin | origin | strict-origin | origin-when-cross-origin | strict-origin-when-cross-origin |  unsafe-url | ''
    referrerPolicy: 'no-referrer',
  },

  // eslint-disable-next-line camelcase, no-undef
  publicPath: (__webpack_public_path__ || '/').slice(0, -1),
}
