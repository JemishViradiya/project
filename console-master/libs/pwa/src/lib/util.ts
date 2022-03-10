/* eslint-disable prefer-template */
import type { RouteMatchCallback } from 'workbox-routing'

import workbox from '../workbox'

const { cacheNames } = workbox.core
const {
  mediaTypes = new Set(['image']),
  mediaExtensions = /\.(png|jpe?g|gif|svg|ico)$/,
  networkOnlyPatterns,
  handledNavigationPatterns,
  skippedNavigationPatterns,
} = self.swConfig

const createCacheName = name => [cacheNames.prefix, name, cacheNames.suffix].filter(s => s).join('-')

export const CACHE_NAMES = {
  Asset: createCacheName('asssets'),
  Media: createCacheName('media'),
}

const _selfOrigin = self.location.origin
export const isSelfOrigin = (url: URL): boolean => url.origin === _selfOrigin

export const isMediaRequest: RouteMatchCallback = ({ url, request }) =>
  isSelfOrigin(url) && ((request && mediaTypes.has(request.destination)) || mediaExtensions.exec(url.pathname))

export const isNetworkOnly = (url: URL | string): boolean =>
  networkOnlyPatterns.some(exclude => exclude.exec(typeof url === 'string' ? url : url.pathname))

export const isNetworkOnlyNavigation = (url: URL | string): boolean =>
  skippedNavigationPatterns.some(exclude => exclude.exec(typeof url === 'string' ? url : url.pathname)) ||
  !handledNavigationPatterns.some(exclude => exclude.exec(typeof url === 'string' ? url : url.pathname))

export type FetchWithTimoutInit = Omit<RequestInit, 'signal'> & { timeout: number; controller?: AbortController }
export const fetchWithTimeout = async (
  input: RequestInfo,
  { timeout, controller, ...init }: FetchWithTimoutInit,
): Promise<Response> => {
  controller = controller || new AbortController()
  const tid = setTimeout(() => controller.abort(), timeout)

  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(tid)
  }
}
