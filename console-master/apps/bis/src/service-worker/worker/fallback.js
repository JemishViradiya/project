import maintenance from './handlers/maintenance'
import logFactory from './lib/log'
import matchPrecache from './lib/matchPrecache'
import { CACHE_NAMES, isMediaRequest, isNetworkOnly } from './lib/util'

const { allowOffline, precacheOptions, publicPath, networkOnlyNavigationPatterns } = self.swConfig

const cacheableDestinations = new Set(['font', 'image', 'manifest', 'style', 'script', 'document'])

const fallbackPrecacheOptions = { ...precacheOptions, ignoreURLParametersMatching: [/.*/] }

const navigationLog = logFactory({
  name: 'Navigation-caching',
  cached: 'navigation',
})

// This "catch" handler is triggered when any of the other routes fail to
// generate a response.
export default context => {
  // The FALLBACK_URL entries must be added to the cache ahead of time, either
  // via runtime or precaching. If they are precached, then call
  // `matchPrecache(FALLBACK_URL)` (from the `workbox-precaching` package)
  // to get the response from the correct cache.
  //
  // Use event, request, and url to figure out how to respond.
  // One approach would be to use request.destination, see
  // https://medium.com/dev-channel/service-worker-caching-strategies-based-on-request-types-57411dd7652c
  const { event } = context
  const url = decodeURIComponent(event.request.url)
  let response
  if (event.request.destination === 'document') {
    if (
      allowOffline &&
      !networkOnlyNavigationPatterns.some(exclude => (typeof exclude === 'function' ? exclude(url) : exclude.test(url.pathname)))
    ) {
      const indexHtml = `${publicPath}/index.html`
      response = matchPrecache(indexHtml, fallbackPrecacheOptions)
    }
    if (response) {
      return navigationLog(response, context)
    } else {
      return maintenance(context)
      // TODO serve maintenance page
    }
  } else if (!isNetworkOnly(url) && cacheableDestinations.has(event.request.destination)) {
    response = matchPrecache(url, fallbackPrecacheOptions)
    if (!response) {
      const cacheName = isMediaRequest(context) ? CACHE_NAMES.Media : CACHE_NAMES.Asset
      response = matchPrecache(url, {
        ...fallbackPrecacheOptions,
        cacheName,
      })
      if (!response) {
        response = matchPrecache(url, fallbackPrecacheOptions)
      }
    }
    if (response) {
      return response
    }
  }
  return Response.error()
}
