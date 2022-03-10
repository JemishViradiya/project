import type { RouteHandler } from 'workbox-routing'

import { getIdToken } from './api/session-mgr'
import { fallbackNavigationHandler } from './fallback'
import { EventBus } from './lib/events'
import logFactory from './lib/log'
import { isNetworkOnly, isNetworkOnlyNavigation } from './lib/util'
import workbox from './workbox'

const { precache, addRoute } = workbox.precaching
const { registerRoute, NavigationRoute } = workbox.routing
const { NetworkOnly } = workbox.strategies
const ID_TOKEN_HINT = 'idTokenHint'
const CLEAR_SESSION = 'clear-session'

const {
  isProduction,
  productionInDev,
  precacheOptions,
  precacheDevExcludeAssetPattern,
  pwaPattern,
  networkOnlyPatterns,
  handledNavigationPatterns,
  skippedNavigationPatterns,
  networkOnlyHandler = false,
} = self.swConfig

const navigationLog = logFactory({ name: 'Worker', cached: 'proxy', tag: 'sw:navigation' })
const handleResponse: typeof navigationLog = (result, event, opts) => {
  if (result.type === 'opaqueredirect') {
    const event = new CustomEvent(CLEAR_SESSION, { detail: { origin: 'venue', variant: 'navigation' } })
    EventBus.dispatchEvent(event)
  }
  return navigationLog(result, event, opts)
}

// Use the navigation routing of workbox-navigaton-preload to
// serve a fallback index.html from the precache
const networkOnly = new NetworkOnly({
  // fetchOptions: {
  //   mode: 'same-origin',
  //   credentials: 'same-origin',
  // },
})
const navigationHandler: RouteHandler = async context => {
  try {
    let result
    // use the preloaded response, if it's there
    if (context.event.preloadResponse) {
      result = context.event.preloadResponse.then(response => {
        if (response) {
          console.log('sw:navigation Preload response', response)
          return response
        }
        return networkOnly.handle(context)
      })
    }
    if (!result) {
      result = networkOnly.handle(context)
    }
    // do not throw an error so we can handle this in the fallback (catch) handler
    if (result) {
      return handleResponse(await result, context.event)
    }
  } catch (error) {
    // console.warn(error.message || error)
    // // do not throw an error so we can handle this in the fallback (catch) handler
    // return catchHandler(context)
    // return Object.assign(Response.error(), error.details.error)
    throw error.details ? error.details.error : error
  }
  return fallbackNavigationHandler(context)
}

// Register this strategy to handle all navigations.
registerRoute<boolean>(
  new NavigationRoute(navigationHandler, {
    allowlist: handledNavigationPatterns,
    denylist: skippedNavigationPatterns,
  }),
)

const logoffHandler: RouteHandler = async context => {
  const event = new CustomEvent(CLEAR_SESSION, { detail: { origin: 'venue', variant: 'navigation' } })
  EventBus.dispatchEvent(event)

  let logoutRequest
  const storedIdToken = await getIdToken()
  if (storedIdToken) {
    const url = new URL(context.request.url)
    url.searchParams.append(ID_TOKEN_HINT, storedIdToken)
    logoutRequest = url.toString()
  } else {
    const event = new CustomEvent(CLEAR_SESSION, { detail: { origin: 'session-mgr', variant: 'navigation' } })
    EventBus.dispatchEvent(event)
  }

  return fetch(logoutRequest || context.request, {
    redirect: 'manual',
    mode: 'same-origin',
    credentials: 'same-origin',
  })
}

// Register this strategy to handle cylance Logoff navigation
registerRoute<boolean>(
  new NavigationRoute(logoffHandler, {
    allowlist: [new RegExp('^/Account/Logoff.*')],
  }),
)

if (networkOnlyHandler) {
  const networkOnlyNavigationHandler: RouteHandler = async context => {
    const result = await networkOnly.handle(context)

    if (result) {
      return handleResponse(result, context.event)
    }
    return navigationLog(new Response(undefined, { status: 404 }), context.event)
  }
  registerRoute(new NavigationRoute(networkOnlyNavigationHandler))
}

// Use the injectManifest mode of one of the Workbox
// build tools to precache a list of URLs, including fallbacks.
const precacheEntries = self.workboxManifest.filter(item => {
  const url = item.url.split(/[#?]/)[0]
  return (
    !(
      pwaPattern.exec(url) ||
      isNetworkOnly(url) ||
      isNetworkOnlyNavigation(url) ||
      (!isProduction && !productionInDev && precacheDevExcludeAssetPattern.exec(item.url))
    ) || url === '/index.html'
  )
})
if (!isProduction && productionInDev) {
  // precacheEntries.unshift({
  //   url: '/maintenancePage.html',
  //   revision: null,
  // })
  precacheEntries.unshift({
    url: '/',
    revision: null,
  })
}

precache(precacheEntries, {
  ...precacheOptions,
  ignoreURLParametersMatching: [].concat(isProduction ? [/^utm_/] : [/.*/]),
})

// Precache route
addRoute({
  directoryIndex: null,
  cleanURLs: false,
  ignoreURLParametersMatching: networkOnlyPatterns,
  urlManipulation: ({ url }) => {
    const decoded = decodeURIComponent(url.href)
    return [new URL(decoded)]
  },
})
