export const EXPIRY_BUFFER = 500 // 0.5 seconds
export const REFRESH_BUFFER = 5000 // 5 seconds
const MS_PER_SEC = 1000

export const getTenantId = path => {
  path = path || window.location.pathname.split('/').slice(1)
  const tenantId = path[0]
  if (tenantId.length === 0) {
    return
  }
  return tenantId.toLowerCase()
}

const getIdentity = tenant => {
  return window.localStorage.getItem(`${tenant}.idpIdentity`)
}

export const getLoginUrl = (pathname, { refresh } = {}) => {
  const url = new URL(window.location.href)
  const path = (pathname || url.pathname).split('/').slice(1)
  const tenantId = getTenantId(path)
  if (!tenantId) {
    return
  }

  const searchParams = new URLSearchParams(window.location.search.slice(1))
  if (searchParams.has('redirect_uri')) {
    // ensure we do not get into a refresh loop by returning undefined
    return
  }

  url.pathname = `${tenantId}/login`
  url.search = refresh ? '?prompt=none' : ''

  const redirect = path.slice(1).join('/')
  url.searchParams.set('redirect_uri', redirect)

  try {
    const loginHint = getIdentity(tenantId)
    if (loginHint) {
      url.searchParams.set('login_hint', loginHint)
    }
    // eslint-disable-next-line no-empty
  } catch (_) {}
  return url.href
}

export const getLogoutUrl = () => {
  const tenantId = getTenantId()
  if (!tenantId) {
    return
  }
  const url = new URL(window.location.href)
  url.hash = ''
  url.pathname = `${tenantId}/logout`
  return url.href
}

const getExpiry = tenant => {
  const expiry = window.localStorage.getItem(`${tenant}.accessTokenExpiry`)
  return expiry ? parseInt(expiry, 10) * MS_PER_SEC - EXPIRY_BUFFER : undefined
}

export const clearExpiry = tenant => {
  window.localStorage.setItem(`${tenant}.accessTokenExpiry`, 0)
}

export const refreshState = tenant => {
  const accessToken = window.localStorage.getItem(`${tenant}.accessToken`)
  const expiry = getExpiry(tenant)
  const identity = getIdentity(tenant)

  const nextState = {
    token: undefined,
    headless: undefined,
    isAuthenticated: false,
    tenant,
    expiry,
    identity,
    accessToken,
  }

  const now = Date.now()
  if (!accessToken || !expiry) {
    nextState.token = 'unauthenticated'
  } else if (now > expiry) {
    nextState.token = 'expired'
  } else if (now > expiry - REFRESH_BUFFER) {
    nextState.token = 'expiring'
    nextState.isAuthenticated = true
  } else {
    nextState.token = 'authenticated'
    nextState.isAuthenticated = true
  }
  if (!nextState.isAuthenticated) {
    nextState.accessToken = undefined
  }

  return nextState
}
