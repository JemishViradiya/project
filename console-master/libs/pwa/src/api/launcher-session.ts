import type { RouteHandlerCallbackContext } from 'workbox-routing'

import { EventBus } from '../lib/events'
import logFactory, { groupCollapsedStyle, logStyle, urlStyle } from '../lib/log'
import type { EidJwtToken } from '../types/base'
import type { LauncherContextNoSession, LauncherContextSession, LauncherSession } from '../types/launcher-session'
import workbox from '../workbox'
import { PORTAL_URL } from './env'
import { appBroadcastChannel, jwtDecode, TOKEN_PARSE_FAILED } from './util'

const { registerRoute, NavigationRoute } = workbox.routing

declare const self: ServiceWorkerGlobalScope & typeof globalThis

const URLs = {
  Context: '/uc/session/launcher/context',
  Login: '/uc/session/launcher/login',
  Logout: '/uc/session/launcher/logout',
}

const sessionLog = logFactory({ name: 'Worker', cached: 'in-memory', tag: 'sw:session' })

const stateLog = (action, message) => {
  console.log('%c%s%c %s: %c%s', groupCollapsedStyle, 'sw:session', logStyle, action, urlStyle, message)
}

const channel = appBroadcastChannel('launcher-session')
const broadcastUpdate = async data => {
  const message = { type: 'SESSION_UPDATED', meta: 'workbox-broadcast-update', ...data }
  console.log('sw:launcher-session broadcast: >>', message)
  if (channel) {
    channel.postMessage(message)
  } else {
    message.channel = 'launcher-session'
    const windows = await self.clients.matchAll({ type: 'window' })
    for (const win of windows) {
      win.postMessage(message)
    }
  }
}

const proxyOptions: RequestInit = {
  credentials: 'include',
  mode: 'cors',
}

const session: {
  current: LauncherSession
  expiring?: ReturnType<typeof setTimeout>
  expiryDate?: number
  fetching?: Promise<Partial<LauncherSession>>
  error?: Error
} = {
  current: undefined as LauncherSession,
}

EventBus.addEventListener('clear-session', (event: CustomEvent) => {
  if (event.detail && event.detail.origin === 'launcher') {
    const previous = session.current
    session.current = undefined
    session.expiring = undefined
    session.expiryDate = undefined
    session.fetching = undefined
    session.error = event.detail.error

    const { current, error } = session
    if (current !== previous) {
      clearTimeout(msgTimeoutId)
      msgTimeoutId = setTimeout(() => {
        broadcastUpdate({
          cacheName: 'session',
          url: URLs.Context,
          payload: JSON.stringify({ ...current, error }),
        })
      }, 100)
    }
  }
})

const cleanup = () => {
  const event = new CustomEvent('clear-session', { detail: { origin: 'launcher' } })
  EventBus.dispatchEvent(event)
}

const parseSession = (payload: LauncherContextNoSession | LauncherContextSession): LauncherSession | { loggedIn: false } => {
  if (!payload.loggedIn) {
    return { loggedIn: false }
  }
  const { oidcTokens, tokenExpirationTime } = payload
  const { access_token: accessToken, id_token: idToken } = JSON.parse(oidcTokens) as {
    access_token: string
    id_token: string
  }

  const { client_id: clientId, sub: userId, act, tenant: tenantId, scope, entitlements = [] } = jwtDecode<EidJwtToken>(accessToken)

  return {
    userId,
    actor: act?.email,
    tenantId: tenantId.toUpperCase(),
    clientId,
    scopes: scope.split(' '),
    permissions: entitlements,
    loggedIn: true,
    tokenExpirationTime: Date.parse(tokenExpirationTime),
    accessToken,
    idToken,
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
    key: btoa(`${userId}:${tenantId}`),
  }
}

let msgTimeoutId
const fetchSession = async () => {
  const res = await fetch(`${PORTAL_URL}/api/console/context`, proxyOptions)
  const payload = (await res.json()) as LauncherContextNoSession | LauncherContextSession
  const json = parseSession(payload)

  clearTimeout(session.expiring)
  if (json.loggedIn) {
    session.current = json
    session.fetching = undefined
    session.expiryDate = json.tokenExpirationTime

    const expiry = session.expiryDate - Date.now()
    if (expiry <= 0) {
      throw new Error(TOKEN_PARSE_FAILED)
    } else {
      session.expiring = setTimeout(() => {
        stateLog('cleanup', 'session expired')
        cleanup()
      }, expiry - 1000)
    }
  } else {
    stateLog('cleanup', 'no session')
    cleanup()
    session.current = { loggedIn: false } as typeof session.current
    session.expiryDate = Infinity
  }

  stateLog('state acquired', json)
  return json
}

const isSessionExpired = () => session.current && session.expiryDate && session.expiryDate < Date.now()

registerRoute(
  URLs.Context,
  async context => {
    stateLog('get-state', !!session.current)
    if (isSessionExpired()) {
      cleanup()
    }
    if (!session.current) {
      if (!session.fetching) {
        session.fetching = fetchSession().catch(error => {
          console.error('sw:launcher-session fetch failed', error.stack || error)
          session.fetching = undefined
          throw error
        })
      }
      await session.fetching
    }
    const current = session.current || { loggedIn: false }

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

registerRoute(
  new NavigationRoute(
    async ({ request, url, event }: RouteHandlerCallbackContext) => {
      cleanup()
      clearTimeout(msgTimeoutId)
      msgTimeoutId = setTimeout(() => {
        broadcastUpdate({ cacheName: 'session', url: URLs.Context, payload: JSON.stringify({ loggedIn: false }) })
      }, 100)

      const searchParams = new URLSearchParams(url.searchParams)
      searchParams.set('type', 'ues')
      const Location = `${PORTAL_URL}/session/logout?${searchParams.toString()}`

      return sessionLog(
        new Response(undefined, {
          headers: { Location },
          status: 307,
        }),
        event,
      )
    },
    {
      allowlist: [/^\/uc\/session\/launcher\/logout([?].*)$/i],
    },
  ),
)

registerRoute(
  new NavigationRoute(
    async ({ request, url, event }: RouteHandlerCallbackContext) => {
      const searchParams = new URLSearchParams(url.searchParams)
      searchParams.set('type', 'ues')
      searchParams.delete('logout')
      cleanup()

      const Location = `${PORTAL_URL}/session/login?${searchParams.toString()}`
      return sessionLog(
        new Response(undefined, {
          headers: { Location },
          status: 307,
        }),
        event,
      )
    },
    {
      allowlist: [/^\/uc\/session\/launcher\/login([?].*)$/i],
    },
  ),
)
