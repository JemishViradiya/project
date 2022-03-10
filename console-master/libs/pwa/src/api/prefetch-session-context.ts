import { EventBus } from '../lib/events'
import logFactory from '../lib/log'
import workbox from '../workbox'
import { buildFeaturesRequest, getFeaturesSync } from './featurization'
import { buildServicesRequest, getServiceEnablementSync } from './service-enablement'
import { checkForCachedAccessToken, getTenant, prefetchFailedResponse } from './sharedPrefetch'
import { TRIGGER_SESSION_CONTEXT_UPDATE } from './util'

const { registerRoute } = workbox.routing
const SESSION_CONTEXT_URL = `/uc/session-context`
let logger: ReturnType<typeof logFactory>

registerRoute(SESSION_CONTEXT_URL, async context => {
  if (!logger) {
    logger = logFactory({ name: 'Worker', cached: 'session', tag: 'sw:session-prefetch' })
  }

  try {
    const cachedAccessToken = await checkForCachedAccessToken()

    if (cachedAccessToken) {
      const authHeader = `Bearer ${cachedAccessToken}`
      const tenant = getTenant(cachedAccessToken)

      const features = await getFeaturesSync(buildFeaturesRequest(authHeader)).then(async r => await r.json())
      const serviceEnablement = await getServiceEnablementSync(buildServicesRequest(tenant, authHeader)).then(
        async r => await r.json(),
      )

      return new Response(JSON.stringify({ features, serviceEnablement }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=30',
        },
      })
    }
  } catch (error) {
    console.warn('session-context failed to load:', error)
  }

  return logger(
    new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, no-cache, no-store',
      },
    }),
    context.event,
  )
})

EventBus.addEventListener(TRIGGER_SESSION_CONTEXT_UPDATE, (event: CustomEvent) => {
  if (event.detail.accessToken) {
    const authHeader = `Bearer ${event.detail.accessToken}`
    const tenant = getTenant(event.detail.accessToken)

    getFeaturesSync(buildFeaturesRequest(authHeader))
    getServiceEnablementSync(buildServicesRequest(tenant, authHeader))
  }
})
