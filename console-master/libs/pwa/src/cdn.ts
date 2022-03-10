import workbox from './workbox'

const { registerRoute } = workbox.routing
const { CacheFirst } = workbox.strategies
const { CacheableResponsePlugin } = workbox.cacheableResponse
const { ExpirationPlugin } = workbox.expiration

const cacheName = 'cdn'
const strategy = new CacheFirst({
  cacheName,
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 60 * 60 * 24 * 365,
    }),
  ],
})

// Cache the Google Fonts webfont files with a cache first strategy for 1 year.
registerRoute(/^https:\/\/fonts\.(gstatic|googleapis)\.com\//, strategy)

// TODO: lazy preload cdn fonts
