import type * as WorkboxBackgroundSync from 'workbox-background-sync'
import type * as WorkboxBroadcastUpdate from 'workbox-broadcast-update'
import type * as WorkboxCacheableResponse from 'workbox-cacheable-response'
import type * as WorkboxCore from 'workbox-core'
import type * as WorkboxExpiration from 'workbox-expiration'
import type * as WorkboxGoogleAnalytics from 'workbox-google-analytics'
import type * as WorkboxNavigationPreload from 'workbox-navigation-preload'
import type * as WorkboxPrecaching from 'workbox-precaching'
import type * as WorkboxRangeRequests from 'workbox-range-requests'
import * as WorkboxRouting from 'workbox-routing'
import type * as WorkboxStrategies from 'workbox-strategies'
import type * as WorkboxStreams from 'workbox-streams'

declare module 'workbox-expiration' {
  interface ExpirationPluginConfig {
    cacheName?: string
  }
}

declare module 'workbox-precaching' {
  interface PrecacheOptions {
    ignoreURLParametersMatching?: RegExp[]
    directoryIndex?: string
    cleanURLs?: boolean
    urlManipulation?: (context: WorkboxRouting.RouteHandlerCallbackContext) => URL[]
  }
  function getCacheKeyForURL(url: string | URL, options?: PrecacheOptions): string
  function precache(entries: Array<string | PrecacheEntry>, options?: PrecacheOptions): void
}

declare module 'workbox-strategies' {
  interface CacheFirstOptions {
    networkTimeoutSeconds?: number
  }
}

declare module 'workbox-routing' {
  class NavigationRoute extends WorkboxRouting.Route<boolean> {
    constructor(handler: RouteHandler, options?: NavigationRouteOptions)
  }

  interface NavigationRouteOptions {
    allowlist?: RegExp[]
    denylist?: RegExp[]
  }
}

export interface workbox {
  backgroundSync: typeof WorkboxBackgroundSync
  broadcastUpdate: typeof WorkboxBroadcastUpdate
  cacheableResponse: typeof WorkboxCacheableResponse & {
    CacheableResponsePlugin: typeof WorkboxCacheableResponse['Plugin']
  }
  core: typeof WorkboxCore
  expiration: typeof WorkboxExpiration & {
    ExpirationPlugin: typeof WorkboxExpiration['Plugin']
  }
  googleAnalytics: typeof WorkboxGoogleAnalytics
  navigationPreload: typeof WorkboxNavigationPreload
  precaching: typeof WorkboxPrecaching
  rangeRequests: typeof WorkboxRangeRequests
  routing: typeof WorkboxRouting
  strategies: typeof WorkboxStrategies
  streams: typeof WorkboxStreams

  loadModule(moduleName: string): void

  setConfig(options?: WorkboxOptions): void
}
