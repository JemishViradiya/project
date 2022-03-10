import { UESAPI_URL } from '../network/uesapi'
import workbox from '../workbox'
import { AUTH_HEADER, cacheFirst, DATA_CACHE, getKey, hasNoCacheHeader } from './sharedPrefetch'
import { syncExecution } from './util'

const { registerRoute } = workbox.routing

const FEATURES_URL = `${UESAPI_URL}/api/platform/v1/featurization`

registerRoute(FEATURES_URL, async context => {
  return await getFeaturesSync(context.request)
})

const getFeatures = async (request: Request) => {
  if (hasNoCacheHeader(request.headers)) {
    return await fetch(request)
  } else {
    const featuresCaches = await self.caches.open(DATA_CACHE)
    const matchingKeys = await featuresCaches.keys(request)
    const incomingHeaders = request.headers.get(AUTH_HEADER).split(' ')[1]

    if (matchingKeys.length > 0) {
      for (const req of matchingKeys) {
        const cachedHeaders = req.headers.get(AUTH_HEADER).split(' ')[1]
        if (getKey(cachedHeaders) !== getKey(incomingHeaders)) {
          await featuresCaches.delete(req)
        }
      }
    }

    return await cacheFirst.handle({ url: new URL(request.url), request })
  }
}

export const getFeaturesSync = syncExecution(getFeatures)

export const buildFeaturesRequest = (authHeader: string) => {
  return new Request(FEATURES_URL, { headers: { [AUTH_HEADER]: authHeader } })
}
