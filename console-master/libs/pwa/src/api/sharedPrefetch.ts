import type { EidJwtToken } from '../types/base'
import workbox from '../workbox'
import { getAccessToken as getSmgrAccessToken } from './session-mgr'
import { jwtDecode } from './util'
import { getAccessToken as getVtxAccessToken } from './vtx-session'

const { CacheFirst } = workbox.strategies
const { ExpirationPlugin } = workbox.expiration
const { dataCacheExpirationTime } = self.swConfig

const CACHE_HEADER = 'Cache-Control'
export const AUTH_HEADER = 'Authorization'
export const DATA_CACHE = 'data-cache'

export const cacheFirst = new CacheFirst({
  cacheName: DATA_CACHE,
  plugins: [
    new ExpirationPlugin({
      maxAgeSeconds: dataCacheExpirationTime,
    }),
  ],
})

export const checkForCachedAccessToken = async (): Promise<string> => {
  return getVtxAccessToken() || (await getSmgrAccessToken())
}

export const hasNoCacheHeader = headers => {
  const cacheControl = headers.get(CACHE_HEADER)
  return cacheControl && cacheControl.includes('no-cache')
}

// Get combination of user and tenant
export const getKey = token => {
  const payload = jwtDecode<EidJwtToken>(token)
  return payload ? `${payload.sub}${payload.tenant}` : undefined
}

export const getTenant = token => {
  const payload = jwtDecode<EidJwtToken>(token)
  return payload?.tenant?.toUpperCase()
}

export const prefetchFailedResponse = () => new Response(JSON.stringify({ message: 'Prefetch failed' }), { status: 400 })
