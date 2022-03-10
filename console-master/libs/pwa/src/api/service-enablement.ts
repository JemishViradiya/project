import { UESAPI_URL } from '../network/uesapi'
import workbox from '../workbox'
import { AUTH_HEADER, cacheFirst, DATA_CACHE, getKey, hasNoCacheHeader } from './sharedPrefetch'
import { syncExecution } from './util'

const { registerRoute } = workbox.routing

// eslint-disable-next-line no-useless-escape
const SERVICE_ENABLEMENT_URL = `${UESAPI_URL}/api/platform/v1/tenants/.*/services`

registerRoute(new RegExp(SERVICE_ENABLEMENT_URL), async context => {
  return await getServiceEnablementSync(context.request)
})

const getServiceEnablement = async (request: Request) => {
  if (hasNoCacheHeader(request.headers)) {
    return await fetch(request)
  } else {
    const serviceEnablementCaches = await self.caches.open(DATA_CACHE)
    const matchingKeys = await serviceEnablementCaches.keys(request)
    const incomingHeaders = request.headers.get(AUTH_HEADER).split(' ')[1]

    if (matchingKeys.length > 0) {
      for (const req of matchingKeys) {
        const cachedHeaders = req.headers.get(AUTH_HEADER).split(' ')[1]
        if (getKey(cachedHeaders) !== getKey(incomingHeaders)) {
          await serviceEnablementCaches.delete(req)
        }
      }
    }

    return await cacheFirst.handle({ url: new URL(request.url), request })
  }
}

export const getServiceEnablementSync = syncExecution(getServiceEnablement)

export const buildServicesRequest = (tenant: string, authHeader: string) => {
  return new Request(SERVICE_ENABLEMENT_URL.replace('.*', tenant) + '?max=100&offset=0', { headers: { [AUTH_HEADER]: authHeader } })
}
