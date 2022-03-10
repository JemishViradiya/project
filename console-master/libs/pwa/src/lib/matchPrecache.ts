import type { RegisterRouteCapture } from 'workbox-routing'

import workbox from '../workbox'

const {
  cacheNames,
  _private: { getFriendlyURL },
} = workbox.core
const { getCacheKeyForURL } = workbox.precaching
const logger = console

export const cacheFetch = (cacheName: string, precachedURL: RequestInfo): Promise<Response> =>
  self.caches.open(cacheName).then(cache => cache.match(precachedURL))

export default (
  context: RegisterRouteCapture,
  {
    cacheName = cacheNames.precache,
    ignoreURLParametersMatching = [/^utm_/],
    directoryIndex = 'index.html',
    cleanURLs = true,
    urlManipulation = undefined,
  } = {},
): Promise<Response> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const url = context.request ? context.request.url : context
  const precachedURL = getCacheKeyForURL(url, {
    cleanURLs,
    directoryIndex,
    ignoreURLParametersMatching,
    urlManipulation,
  })
  if (!precachedURL) {
    // if (!self.swConfig.isProduction) {
    logger.debug(`Precaching did not find a match for ${getFriendlyURL(url)}`)
    // }
    return Promise.resolve(null)
  }

  return cacheFetch(cacheName, precachedURL)
}
