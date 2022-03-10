/* eslint-disable prefer-template */
import workbox from '../workbox'

const { cacheNames } = workbox.core
const {
  mediaTypes = new Set(['image']),
  mediaExtensions = /\.(png|jpe?g|gif|svg|ico)$/,
  networkOnlyPatterns,
  networkOnlyNavigationPatterns,
} = self.swConfig

const createCacheName = name => [cacheNames.prefix, name, cacheNames.suffix].filter(s => s).join('-')

export const CACHE_NAMES = {
  Asset: createCacheName('asssets'),
  Media: createCacheName('media'),
}

const _selfOrigin = self.location.origin
export const isSelfOrigin = url => url.origin === _selfOrigin

export const isMediaRequest = ({ request }) =>
  isSelfOrigin(request.url) && (mediaTypes.has(request.destination) || mediaExtensions.exec(request.url))

export const isNetworkOnly = url => networkOnlyPatterns.some(exclude => exclude.exec(url.pathname))

export const isNetworkOnlyNavigation = url => networkOnlyNavigationPatterns.some(exclude => exclude.exec(url.pathname))
