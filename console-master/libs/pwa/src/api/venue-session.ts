import { EventBus } from '../lib/events'
import logFactory, { groupCollapsedStyle, logStyle, urlStyle } from '../lib/log'
import type { FetchWithTimoutInit as RequestInitWithTimout } from '../lib/util'
import { fetchWithTimeout } from '../lib/util'
import type { VenueSession, VenueToken } from '../types/venue-session'
import workbox from '../workbox'
import { appBroadcastChannel, Error401, jwtDecode, SESSION_UPDATE, TOKEN_PARSE_FAILED, VENUE_SESSION_EXPIRED } from './util'

const { registerRoute } = workbox.routing

declare const self: ServiceWorkerGlobalScope & typeof globalThis

const URLs = {
  Session: '/uc/session/venue',
  Authorize: '/Account/Authorize',
  AuthorizeSessionReset: '/Account/ResetSessionTimeout',
  AuthorizeTimeoutAction: '/Account/SessionAbandon',
  FetchXSRFToken: '/Dashboard',
}

const FetchXSRFTokenTimeout = 60000
const proxyOptions: RequestInitWithTimout = {
  credentials: 'include',
  mode: 'same-origin',
  redirect: 'error',
  timeout: 15000,
}

const sessionLog = logFactory({ name: 'Worker', cached: 'in-memory', tag: 'sw:session' })

const stateLog = (action, message) => {
  console.log('%c%s%c %s: %c%s', groupCollapsedStyle, 'sw:venue-session', logStyle, action, urlStyle, message)
}

const channel = appBroadcastChannel('venue-session')
const broadcastUpdate = async data => {
  const message = { type: 'SESSION_UPDATED', meta: 'workbox-broadcast-update', ...data }
  console.log('sw:venue-session broadcast: >>', message)
  if (channel) {
    channel.postMessage(message)
  } else {
    message.channel = 'venue-session'
    const windows = await self.clients.matchAll({ type: 'window' })
    for (const win of windows) {
      win.postMessage(message)
    }
  }
}

const session: {
  current: VenueSession
  expiring?: ReturnType<typeof setTimeout>
  expiryDate?: number
  fetching?: Promise<Partial<VenueSession>>
  fetchingVerification?: Promise<Partial<VenueSession>>
  error?: Error
  timestamp: number
} = {
  current: undefined as VenueSession,
  timestamp: Date.now(),
}

const loggedOutSessionState = { loggedIn: false } as VenueSession
const LogoutEvents = new Set(['logged-out', 'expired', 'navigation'])
EventBus.addEventListener('clear-session', (event: CustomEvent) => {
  if (event.detail && event.detail.origin === 'venue') {
    const previous = session.current
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    session.current = LogoutEvents.has(event.detail.variant) ? loggedOutSessionState : undefined
    session.expiring = undefined
    session.expiryDate = undefined
    session.fetching = undefined
    session.error = event.detail.error
    session.timestamp = Date.now()

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

const cleanup = (variant?: string, error?: Error) => {
  const event = new CustomEvent('clear-session', { detail: { origin: 'venue', variant, error } })
  EventBus.dispatchEvent(event)
}

let msgTimeoutId
function updateVenueSession(type, expired = false) {
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

const parseToken = (accessTokenVenue: string, verificationToken: string, venueToken: VenueToken): VenueSession => {
  const {
    tenantdefaultstype: tenantDefaultsType,
    tenantid: tenantIdVenue,
    shardid: shardId,
    userid: userIdVenue,
    ghostusername: actor,
    scp: entitlements,
    exp,
    role,
    userlogin: email,
    eecoid,
    scp,
  } = venueToken

  const tokenExpirationTime = exp * 1000

  return {
    userId: eecoid || undefined,
    userIdVenue,
    actor,
    tenantIdVenue,
    shardId,
    permissions: entitlements,
    venueRbac: { role: role?.[0], scp },
    tenantDefaultsType,
    loggedIn: true,
    token: venueToken,
    accessTokenVenue,
    verificationTokenVenue: verificationToken,
    tokenExpirationTime,
    email,
    key: btoa(`${userIdVenue}:${tenantIdVenue}`),
  }
}

const FETCH_FAILED = 'Token aquisition failed'
const RedirectCodes = new Set([301, 302, 307, 308])

const fetchVerificationToken = async () => {
  const res = await fetchWithTimeout(URLs.FetchXSRFToken, {
    timeout: FetchXSRFTokenTimeout,
    credentials: 'include',
    redirect: 'manual',
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*',
      'Upgrade-Insecure-Requests': '1',
    },
  }).catch(error => {
    console.error('Failed to fetch verification token:', error)
    throw new Error(FETCH_FAILED)
  })
  if (res.status !== 200) {
    if (res.type === 'opaqueredirect' || RedirectCodes.has(res.status)) {
      console.log('sw:venue-session: Cylance cookie-session expired')
      throw new Error401('Cylance cookie-session expired')
    }
    console.log('sw:venue-session FetchToken.status', res.status, res.type)
    throw new Error(FETCH_FAILED)
  }
  const document = await res.text()
  const match = /var antiForgeryToken[ ]*=[ ]*"([^"]+)";/.exec(document)
  return match ? match[1] : undefined
}

const fetchSession = async (jwt?: string, verificationToken?: string, withVerfication = false) => {
  stateLog('fetch-session', `current=${session.current?.loggedIn}, jwt=${!!jwt}, vt=${!!verificationToken}`)
  if (jwt) {
    try {
      const { exp } = jwtDecode<VenueToken>(jwt)
      if (exp * 1000 < Date.now()) {
        throw new Error(`Expired: ${exp}`)
      }
    } catch (error) {
      console.log('sw:venue-session JWT param was invalid:', error)
      jwt = undefined
    }
  }
  if (!jwt) {
    if (!verificationToken) {
      verificationToken = await fetchVerificationToken()
    }

    const authRes = await fetchWithTimeout(URLs.Authorize, {
      ...proxyOptions,
      method: 'POST',
      headers: {
        'X-Request-Verification-Token': verificationToken,
      },
    })
    if (authRes.status !== 200) {
      if (authRes.status === 401) throw new Error401(FETCH_FAILED)
      throw new Error(FETCH_FAILED)
    }

    jwt = await authRes.json()
    if (!jwt) {
      throw new Error(FETCH_FAILED)
    }
  } else if (!verificationToken && withVerfication) {
    verificationToken = await fetchVerificationToken()
  }

  const token = jwtDecode<VenueToken>(jwt)
  const sessionPayload = parseToken(jwt, verificationToken, token)

  session.current = sessionPayload
  session.fetching = undefined
  session.expiryDate = sessionPayload.tokenExpirationTime
  session.timestamp = Date.now()

  const expiry = session.expiryDate - Date.now()
  if (expiry <= 0) {
    throw new Error(TOKEN_PARSE_FAILED)
  } else {
    session.expiring = setTimeout(() => {
      session.error = new Error401(VENUE_SESSION_EXPIRED)
      updateVenueSession(SESSION_UPDATE.CleanUp, true)
    }, expiry - 10000)
  }

  return updateVenueSession(SESSION_UPDATE.Update)
}

const isSessionExpired = () => session.current && session.expiryDate && session.expiryDate < Date.now()
const onSessionError = error => {
  cleanup(error.status === 401 ? 'logged-out' : 'error', error)
  return session.current
}

export const acquireVenueSession = async (jwt?: string, withVerfication = false) => {
  if (isSessionExpired()) {
    cleanup()
  }
  const updatedJwt = jwt && session.current?.accessTokenVenue !== jwt
  if (!session.current || updatedJwt) {
    if (!session.fetching || updatedJwt) {
      session.fetching = fetchSession(jwt, session.current?.verificationTokenVenue, withVerfication).catch(onSessionError)
    }
    await session.fetching
  } else if (withVerfication && !session.current.verificationTokenVenue) {
    if (!session.fetchingVerification) {
      session.fetchingVerification = fetchSession(session.current.accessTokenVenue, undefined, withVerfication)
        .catch(onSessionError)
        .then(result => {
          session.fetchingVerification = undefined
          return result
        })
      session.fetching = session.fetchingVerification
    }
    await session.fetching
  }
  return session
}

export const refreshVenueSession = async (jwt?: string, withVerfication = false) => {
  let fetched
  if (session.current) {
    // try to refresh our session
    fetched = fetchSession(jwt, session.current?.verificationTokenVenue, withVerfication)
  } else {
    fetched = fetchSession()
  }

  await fetched.catch(error => {
    cleanup(error.status === 401 ? 'expired' : 'error', error)
    return session.current
  })

  return session
}

registerRoute(
  URLs.Session,
  async context => {
    stateLog('get-state', URLs.Session)
    const authorization = (context.request.headers.get('authorization') || '').substring(7)
    const { current = loggedOutSessionState, error } = await acquireVenueSession(authorization, true)

    const errorJson = error ? { message: error.message, ...error } : undefined
    if (error) console.error('sw:venue-session fetch failed:', error.stack || error)

    return sessionLog(
      new Response(JSON.stringify({ ...current, error: errorJson }), {
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
