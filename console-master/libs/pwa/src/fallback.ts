import type { RouteHandlerCallbackContext } from 'workbox-routing'

import maintenance from './handlers/maintenance'
import logFactory from './lib/log'
import matchPrecache from './lib/matchPrecache'
import { CACHE_NAMES, isMediaRequest, isNetworkOnly } from './lib/util'

const { allowOffline, precacheOptions, handledNavigationPatterns, skippedNavigationPatterns } = self.swConfig

const cacheableDestinations = new Set(['font', 'image', 'manifest', 'style', 'script', 'document'])

const fallbackPrecacheOptions = {
  ...precacheOptions,
  ignoreURLParametersMatching: [/.*/],
}

const navigationLog = logFactory({
  name: 'Navigation-caching',
  cached: 'navigation',
})

export const fallbackNavigationHandler = async (context: RouteHandlerCallbackContext, url?: string): Promise<Response> => {
  let response: Response
  const { pathname } = new URL(url || decodeURIComponent(context.event.request.url))
  if (
    allowOffline &&
    handledNavigationPatterns.some(exclude => exclude.test(pathname)) &&
    !skippedNavigationPatterns.some(exclude => exclude.test(pathname))
  ) {
    response = await matchPrecache('/', fallbackPrecacheOptions)
  }
  if (response) {
    return Promise.resolve(navigationLog(response, context.event, { cacheUrl: url }))
  } else if (allowOffline) {
    return maintenance(context)
  } else {
    throw new Error(`Fallback failed`)
  }
}

// This "catch" handler is triggered when any of the other routes fail to
// generate a response.
export const catchHandler = (context: RouteHandlerCallbackContext): Promise<Response> => {
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
  let response: Promise<Response>
  if (event.request.destination === 'document') {
    try {
      return fallbackNavigationHandler(context, url)
    } catch (error) {
      console.error(error)
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
  return Promise.resolve(Response.error())
}
