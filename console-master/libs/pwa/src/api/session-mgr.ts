import type { RouteHandlerCallbackContext } from 'workbox-routing/types/RouteHandler'

import { EventBus } from '../lib/events'
import logFactory, { groupCollapsedStyle, logStyle, urlStyle } from '../lib/log'
import type { EidJwtToken } from '../types/base'
import { EXCHANGE_STATE_COMPLETED, EXCHANGE_STATE_REQUEST, EXCHANGE_STATE_RESPONSE } from '../types/base'
import type { SessionState, SmgrSession } from '../types/session-mgr'
import { ActiveSessionState, NoSessionState } from '../types/session-mgr'
import type { VenueToken } from '../types/venue-session'
import workbox from '../workbox'
import { clearStorage, restoreSessionFromStorage, updateStorage } from './session-mgr-cache'
import {
  appBroadcastChannel,
  jwtDecode,
  SESSION_UPDATE,
  SessionError,
  TOKEN_PARSE_FAILED,
  triggerSessionContextUpdate,
} from './util'

const { registerRoute } = workbox.routing

declare const self: ServiceWorkerGlobalScope & typeof globalThis

const SESSION_CHANNEL = 'session-mgr'

const URLs = {
  Session: '/uc/session/eid',
  LoginFailure: '/uc/session/eid/failure',
  LoginSuccess: '/uc/session/eid/success',
  Logout: '/uc/session/eid/logout',
}

const RESPONSE_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'private, no-cache, no-store',
}

const sessionLog = logFactory({ name: 'Worker', cached: 'in-memory', tag: 'sw:session' })

const stateLog = (action, message) => {
  console.log('%c%s%c %s: %c%s', groupCollapsedStyle, 'sw:session-mgr', logStyle, action, urlStyle, message)
}

const channel = appBroadcastChannel(SESSION_CHANNEL)
const broadcastUpdate = async data => {
  const message = { type: 'SESSION_UPDATED', meta: 'workbox-broadcast-update', ...data }
  console.log('sw:session-mgr broadcast: >>', message)
  if (channel) {
    message.channel = channel.name
    channel.postMessage(message)
  } else {
    message.channel = channel.name
    const windows = await self.clients.matchAll({ type: 'window' })
    for (const win of windows) {
      win.postMessage(message)
    }
  }
}

const session: {
  current: SessionState
  expiring?: ReturnType<typeof setTimeout>
  error?: Error
} = {
  current: new NoSessionState(),
}

self.addEventListener('message', event => {
  stateLog('message', event.data.type)
  if (event.data.type === EXCHANGE_STATE_REQUEST) {
    const messageSource = event.source as ServiceWorker
    messageSource.postMessage({ type: EXCHANGE_STATE_RESPONSE, sessionData: session.current.getSession() })
  } else if (event.data.type === EXCHANGE_STATE_RESPONSE && session.current instanceof NoSessionState) {
    session.current = session.current.clone(event.data.sessionData)
    if (session.current instanceof ActiveSessionState) {
      scheduleExpiration(event.data.sessionData.tokenExpirationTime)
    }
    const target = event.currentTarget?.['serviceWorker'] as ServiceWorker
    target?.postMessage({ type: EXCHANGE_STATE_COMPLETED })
  }
})

EventBus.addEventListener('clear-session', (event: CustomEvent) => {
  if (event.detail && event.detail.origin === SESSION_CHANNEL) {
    const previous = session.current
    session.current = new NoSessionState()
    clearTimeout(session.expiring)
    session.error = event.detail.error
    clearStorage()

    const { current, error } = session
    if (current !== previous) {
      const sessionData = current.getSession()
      clearTimeout(msgTimeoutId)
      msgTimeoutId = setTimeout(
        () =>
          broadcastUpdate({
            cacheName: 'session',
            url: URLs.Session,
            payload: JSON.stringify({ ...sessionData, error }),
          }),
        100,
      )
    }
  }
})

const cleanup = (error?: Error) => {
  const event = new CustomEvent('clear-session', { detail: { origin: SESSION_CHANNEL, error } })
  EventBus.dispatchEvent(event)
}

let msgTimeoutId
function updateSession(type, expired = false) {
  const current = session.current.getSession()
  if (type === SESSION_UPDATE.CleanUp) {
    stateLog(type, expired ? 'session expired' : 'no session')
    cleanup()
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

const parseToken = (accessToken: string, accessTokenVenue: string, idToken: string): SmgrSession => {
  const {
    tenantdefaultstype: tenantDefaultsType,
    tenantid: tenantIdVenue,
    shardid: shardId,
    userid: userIdVenue,
    exp,
    userlogin: email,
  } = jwtDecode<VenueToken>(accessTokenVenue)

  const { client_id: clientId, sub: userId, tenant: tenantId, scope, entitlements = [], act } = jwtDecode<EidJwtToken>(accessToken)

  return {
    userId,
    email,
    actor: act?.email,
    tenantId: tenantId.toUpperCase(),
    clientId,
    scopes: scope.split(' '),
    permissions: entitlements,
    venueRbac: {
      role: {
        isCustom: false,
        name: 'administrator',
        rbac: {},
        roleId: '00000000-0000-0000-0000-000000000001',
        zoneids: [],
      },
      scp: [],
    },
    loggedIn: true,
    tokenExpirationTime: exp * 1000,
    accessToken,
    accessTokenVenue,
    idToken,
    key: btoa(`${userId}${tenantId}`),
  }
}

const scheduleExpiration = async (tokenExpirationTime: number) => {
  const expiry = tokenExpirationTime - Date.now()
  if (expiry <= 0) {
    session.current = session.current.onError(new Error(TOKEN_PARSE_FAILED))
  } else {
    session.expiring = setTimeout(async () => {
      session.current = session.current.next()
      updateStorage(session.current.getSession())
      updateSession(SESSION_UPDATE.Update)
    }, expiry - 2000)
  }
}

const restoreSession = async () => {
  if (session.current instanceof NoSessionState) {
    session.current = await restoreSessionFromStorage()
  }
}

export const getIdToken = async () => {
  await restoreSession()
  return session.current?.getSession()?.idToken
}

export const getAccessToken = async () => {
  await restoreSession()
  return session.current?.getSession()?.accessToken
}

const sessionResponse = (context: RouteHandlerCallbackContext, body: any, status = 200) => {
  return sessionLog(
    new Response(JSON.stringify(body), {
      headers: RESPONSE_HEADERS,
      status,
    }),
    context.event,
  )
}

registerRoute(
  URLs.Session,
  async context => {
    stateLog('get-state', !!session.current)
    await restoreSession()

    if (session.current && session.current.isSessionExpired()) {
      session.current = session.current.next() // Active => expired
      updateStorage(session.current.getSession())
    }

    const currentSession = session.current
    if (!currentSession.getSession().loggedIn && !currentSession.getSession().loading) {
      session.current = session.current.next()
    }

    return sessionResponse(context, currentSession.getSession())
  },
  'GET',
)

registerRoute(
  URLs.LoginSuccess,
  async context => {
    const body = await context.request.json()
    stateLog('successfull-login', body)

    let statusCode = 200
    if (body && body.accessToken) {
      try {
        const parsedToken = parseToken(body.accessToken, body.accessTokenVenue, body.idToken)
        session.current = session.current.next(parsedToken)
        scheduleExpiration(parsedToken.tokenExpirationTime)
        updateStorage(session.current.getSession())
        triggerSessionContextUpdate(body.accessToken)
      } catch (error) {
        console.error('%c%s%c %s: %c%s', groupCollapsedStyle, 'sw:session-mgr', logStyle, 'error', urlStyle, error.message)
        statusCode = 400
        session.current = session.current.onError(new Error(TOKEN_PARSE_FAILED))
        clearStorage()
      }
    }
    updateSession(SESSION_UPDATE.Update)

    return sessionResponse(context, session.current.getSession(), statusCode)
  },
  'POST',
)

registerRoute(
  URLs.LoginFailure,
  async context => {
    const body = await context.request.json()
    stateLog('login-failed', body)

    if (body) {
      session.current = session.current.onError(new SessionError(body.statusMessage, body.statusCode))
    }
    clearStorage()
    updateSession(SESSION_UPDATE.Update)

    return sessionResponse(context, session.current.getSession(), body.statusCode)
  },
  'POST',
)

registerRoute(
  URLs.Logout,
  async context => {
    await restoreSession()
    const body = await context.request.json()
    stateLog('logout', body)
    const idToken = session.current.getSession()?.idToken
    const returnUrl = body?.returnUrl ?? ''
    cleanup()

    const processedReturnUrl = idToken ? returnUrl.replace('ID_TOKEN_HINT', idToken) : ''

    return sessionResponse(context, { ...body, returnUrl: processedReturnUrl }, body.statusCode)
  },
  'POST',
)
