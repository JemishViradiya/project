import logFactory from './lib/log'
import matchPrecache from './lib/matchPrecache'
import { CACHE_NAMES, isMediaRequest } from './lib/util'
import workbox from './workbox'

const { CacheableResponsePlugin } = workbox.cacheableResponse
const { ExpirationPlugin } = workbox.expiration
const { registerRoute } = workbox.routing
const { CacheFirst, NetworkFirst } = workbox.strategies

const { isProduction, fetchOptions, precacheOptions, pwaPattern } = self.swConfig

const AssetCachePlugins = cacheName => [
  new CacheableResponsePlugin({ statuses: [200] }),
  new ExpirationPlugin({
    cacheName,
    maxEntries: 50,
    purgeOnQuotaError: true,
  }),
]

const precacheLog = logFactory({ name: 'Pre-caching', cached: 'precached' })
const assetLog = logFactory({ name: 'Static-caching', cached: 'static' })
const mediaLog = logFactory({ name: 'Media-caching', cached: 'media' })

const precacheWrapper = (log, next) => context =>
  matchPrecache(decodeURIComponent(context.request.url), precacheOptions).then(precached => {
    if (precached) {
      return precacheLog(precached, context)
    }
    return next.handle(context).then(response => log(response, context))
  })

// Use an explicit strategy and a dedicated cache for static assets.
const AssetCacheStrategy = isProduction ? CacheFirst : NetworkFirst
registerRoute(
  isMediaRequest,
  precacheWrapper(
    mediaLog,
    new AssetCacheStrategy({
      cacheName: CACHE_NAMES.Media,
      plugins: AssetCachePlugins(CACHE_NAMES.Media),
      networkTimeoutSeconds: 30,
      fetchOptions,
      matchOptions: {
        ignoreSearch: !isProduction,
      },
    }),
  ),
)

const assetPrecache = precacheWrapper(
  assetLog,
  new AssetCacheStrategy({
    cacheName: CACHE_NAMES.Asset,
    plugins: AssetCachePlugins(CACHE_NAMES.Asset),
    networkTimeoutSeconds: 15,
    fetchOptions,
    matchOptions: {
      ignoreSearch: !isProduction,
    },
  }),
)
registerRoute(pwaPattern, assetPrecache)
