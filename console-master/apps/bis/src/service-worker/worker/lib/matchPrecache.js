import workbox from '../workbox'

const {
  cacheNames,
  _private: { getFriendlyURL },
} = workbox.core
const { getCacheKeyForURL } = workbox.precaching
const logger = console

export const cacheFetch = (cacheName, precachedURL) => self.caches.open(cacheName).then(cache => cache.match(precachedURL))

export default (
  context,
  {
    cacheName = cacheNames.precache,
    ignoreURLParametersMatching = [/^utm_/],
    directoryIndex = 'index.html',
    cleanURLs = true,
    urlManipulation,
  } = {},
) => {
  const url = context.request ? context.request.url : context
  const precachedURL = getCacheKeyForURL(url, {
    cleanURLs,
    directoryIndex,
    ignoreURLParametersMatching,
    urlManipulation,
  })
  if (!precachedURL) {
    if (process.env.NODE_ENV !== 'production') {
      logger.debug(`Precaching did not find a match for ${getFriendlyURL(url)}`)
    }
    return
  }

  return cacheFetch(cacheName, precachedURL)
}
