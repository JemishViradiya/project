import { EventBus } from '../lib/events'
import logFactory, { groupCollapsedStyle, logStyle, urlStyle } from '../lib/log'
import type { EidJwtToken } from '../types/base'
import type { VenueSession } from '../types/venue-session'
import type { VtxSession } from '../types/vtx-session'
import workbox from '../workbox'
import { ConsoleApi } from './env'
import {
  appBroadcastChannel,
  Error401,
  Error403,
  FETCH_FAILED,
  jwtDecode,
  SESSION_UPDATE,
  TOKEN_PARSE_FAILED,
  triggerSessionContextUpdate,
  VENUE_EECOID_MISSING,
} from './util'
import { acquireVenueSession, refreshVenueSession } from './venue-session'

const { registerRoute } = workbox.routing

declare const self: ServiceWorkerGlobalScope & typeof globalThis

const consoleApiEndpoint = ConsoleApi.apiResolver()
const URLs = {
  Session: '/uc/session/vtx',
  Vtx: `${consoleApiEndpoint}vtx/token`,
}

const loggedOutSessionState = { loggedIn: false } as VtxSession

const sessionLog = logFactory({ name: 'Worker', cached: 'in-memory', tag: 'sw:session' })

const stateLog = (action, message) => {
  console.log('%c%s%c %s: %c%s', groupCollapsedStyle, 'sw:vtx-session', logStyle, action, urlStyle, message)
}

const channel = appBroadcastChannel('vtx-session')
const broadcastUpdate = async data => {
  const message = { type: 'SESSION_UPDATED', meta: 'workbox-broadcast-update', ...data }
  console.log('sw:vtx-session broadcast: >>', message)
  if (channel) {
    channel.postMessage(message)
  } else {
    message.channel = 'vtx-session'
    const windows = await self.clients.matchAll({ type: 'window' })
    for (const win of windows) {
      win.postMessage(message)
    }
  }
}

const proxyOptions: RequestInit = {
  credentials: 'omit',
  mode: 'cors',
  redirect: 'error',
}

const session: {
  current: VtxSession
  expiring?: ReturnType<typeof setTimeout>
  expiryDate?: number
  fetching?: Promise<Partial<VtxSession>>
  error?: Error
} = {
  current: undefined as VtxSession,
}

EventBus.addEventListener('clear-session', (event: CustomEvent) => {
  if (event.detail && (event.detail.origin === 'vtx' || event.detail.origin === 'venue')) {
    const previous = session.current
    session.current = undefined
    session.expiring = undefined
    session.expiryDate = undefined
    session.fetching = undefined
    session.error = event.detail.error

    const { current, error } = session
    if (current !== previous) {
      clearTimeout(msgTimeoutId)
      msgTimeoutId = setTimeout(
        () =>
          broadcastUpdate({
            cacheName: 'session',
            url: URLs.Session,
            payload: JSON.stringify({ ...current, error }),
          }),
        100,
      )
    }
  }
})

const cleanup = (error?: Error) => {
  const event = new CustomEvent('clear-session', { detail: { origin: 'vtx', error } })
  EventBus.dispatchEvent(event)
}

let msgTimeoutId
function updateVtxSession(type, expired = false) {
  let current = session.current || loggedOutSessionState
  if (type === SESSION_UPDATE.CleanUp) {
    stateLog(type, expired ? 'session expired' : 'no session')
    cleanup()
    current = loggedOutSessionState
    return current
  }
  stateLog(type, session.current)

  clearTimeout(msgTimeoutId)
  msgTimeoutId = setTimeout(() => {
    const jsonError = session.error ? { message: session.error.message, ...session.error } : undefined
    broadcastUpdate({ cacheName: 'session', url: URLs.Session, payload: JSON.stringify({ ...current, error: jsonError }) })
  }, 100)
  return current
}

const parseToken = (accessToken: string, venueSession: VenueSession, tokenExpirationTime: number): VtxSession => {
  const { userIdVenue, actor, tenantIdVenue, shardId, tenantDefaultsType, accessTokenVenue, email, venueRbac } = venueSession

  const { client_id: clientId, sub: userId, tenant: tenantId, scope, entitlements = [] } = jwtDecode<EidJwtToken>(accessToken)

  return {
    userId,
    email,
    userIdVenue,
    actor,
    tenantId: tenantId.toUpperCase(),
    tenantIdVenue,
    shardId,
    clientId,
    scopes: scope.split(' '),
    permissions: entitlements,
    venueRbac,
    tenantDefaultsType,
    loggedIn: true,
    tokenExpirationTime,
    accessToken,
    accessTokenVenue,
    key: btoa(`${userId}${tenantId}`),
  }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const fetchSession = async (accessTokenVenue?: string, refresh = false, startTime = Date.now()) => {
  const fetchVenueSession = refresh ? refreshVenueSession : acquireVenueSession
  let venueSession: ReturnType<typeof fetchVenueSession> extends Promise<infer T> ? T : never
  try {
    venueSession = await fetchVenueSession(accessTokenVenue)
  } catch (error) {
    if (error.status === 401 && !refresh) {
      return fetchSession(undefined, true, startTime)
    }
    throw error
  }

  const { current: venueCurrent = { loggedIn: false } as VenueSession, expiryDate, error, timestamp } = venueSession
  if (!venueCurrent.loggedIn) {
    if ((!error || error['status'] === 401) && !refresh && timestamp < startTime) {
      return fetchSession(undefined, true, startTime)
    }
    throw error || new Error401(FETCH_FAILED)
  }

  if (!venueCurrent.userId) {
    throw new Error403(VENUE_EECOID_MISSING)
  }

  let authRes: Response
  try {
    authRes = await fetch(URLs.Vtx, {
      ...proxyOptions,
      method: 'POST',
      headers: {
        authorization: `Bearer ${venueCurrent.accessTokenVenue}`,
      },
    })
  } catch (error) {
    console.error('Opaque error', error)
    throw new Error(FETCH_FAILED)
  }
  if (authRes.status !== 200) {
    if (authRes.status === 401) {
      if (accessTokenVenue && venueCurrent.accessTokenVenue === accessTokenVenue) {
        return fetchSession(undefined, true, startTime)
      }
      throw new Error401(FETCH_FAILED)
    }
    throw new Error(FETCH_FAILED)
  }

  const { token: accessToken } = await authRes.json()

  if (!accessToken) {
    throw new Error(FETCH_FAILED)
  }
  const sessionPayload = parseToken(accessToken, venueCurrent, expiryDate)
  session.current = sessionPayload
  session.fetching = undefined
  session.expiryDate = expiryDate

  const expiry = session.expiryDate - Date.now()
  if (expiry <= 0) {
    throw new Error(TOKEN_PARSE_FAILED)
  } else {
    session.expiring = setTimeout(async () => {
      try {
        await fetchSession(undefined, true)
      } catch (error) {
        console.error(error)
        session.error = new Error401(FETCH_FAILED)
        updateVtxSession(SESSION_UPDATE.CleanUp, true)
      }
    }, expiry - 5000)
  }

  triggerSessionContextUpdate(accessToken)
  return updateVtxSession(SESSION_UPDATE.Update)
}

const isSessionExpired = () => session.current && session.expiryDate && session.expiryDate < Date.now()

export const getAccessToken = () => {
  return session.current?.accessToken
}

registerRoute(
  URLs.Session,
  async context => {
    const authorization = (context.request.headers.get('authorization') || '').substring(7)

    if (!authorization && context.event.preloadResponse) {
      const result = await context.event.preloadResponse.catch(error => {
        stateLog('prefetch', error.message)
      })
      if (result) {
        stateLog('prefetch', 'success')
        return result
      }
    }
    stateLog('get-state', !!session.current)
    if (isSessionExpired()) {
      cleanup()
    }

    const updatedJwt = authorization && session.current?.accessTokenVenue !== authorization
    let error: Error
    if (!session.current || updatedJwt) {
      if (!session.fetching || updatedJwt) {
        const refresh = context.request.headers.get('cache-control') === 'no-cache'
        session.fetching = fetchSession(authorization, refresh).catch(error => {
          cleanup(error)
          throw error
        })
      }
      try {
        await session.fetching
      } catch (err) {
        error = err
        // if (err.status) {
        // error = { message: err.message, ...err }
        // }
      }
    }
    const errorJson = error ? { message: error.message, ...error } : undefined
    const current = { ...(session.current || loggedOutSessionState), error: errorJson }
    if (error) {
      console.error('sw:vtx-session fetch failed:', error.stack || error)
    }

    return sessionLog(
      new Response(JSON.stringify(current), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'private, no-cache, no-store',
        },
      }),
      context.event,
    )
  },
  'GET',
)
