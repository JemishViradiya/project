import fallbackHandler from './fallback'
import { isNetworkOnly } from './lib/util'
import workbox from './workbox'

const { precache, addRoute } = workbox.precaching
const { registerRoute, NavigationRoute } = workbox.routing
const { NetworkOnly } = workbox.strategies

const {
  isProduction,
  productionInDev,
  precacheOptions,
  precacheDevExcludeAssetPattern,
  pwaPattern,
  networkOnlyPatterns,
  networkOnlyNavigationPatterns,
} = self.swConfig

// Use the navigation routing of workbox-navigaton-preload to
// serve a fallback index.html from the preache
const networkOnly = new NetworkOnly()
const navigationHandler = async context => {
  try {
    return await networkOnly.handle(context)
  } catch (error) {
    console.warn(error.message || error)
    // do not throw an error so we can handle this in the fallback (catch) handler
  }
  return fallbackHandler(context)
}

// Register this strategy to handle all navigations.
// navigationPreload.enable()
registerRoute(
  new NavigationRoute(navigationHandler, {
    denylist: networkOnlyNavigationPatterns,
  }),
)
registerRoute(new NavigationRoute(networkOnly))

// Use the injectManifest mode of one of the Workbox
// build tools to precache a list of URLs, including fallbacks.
const precacheEntries = self.workboxManifest.filter(
  item =>
    !(
      pwaPattern.exec(item.url) ||
      isNetworkOnly(item.url) ||
      (!isProduction && !productionInDev && precacheDevExcludeAssetPattern.exec(item.url))
    ) || item.url === '/index.html',
)
if (!isProduction && productionInDev) {
  precacheEntries.unshift({
    url: '/maintenancePage.html',
    revision: null,
  })
  precacheEntries.unshift({
    url: '/index.html',
    revision: null,
  })
}

precache(precacheEntries, {
  ...precacheOptions,
  ignoreURLParametersMatching: [].concat(isProduction ? [/^utm_/] : [/.*/]),
})

// Precache route
addRoute({
  directoryIndex: false,
  cleanURLs: false,
  ignoreURLParametersMatching: networkOnlyPatterns,
  urlManipulation: ({ url }) => {
    const decoded = decodeURIComponent(url)
    return [new URL(decoded)]
  },
})
