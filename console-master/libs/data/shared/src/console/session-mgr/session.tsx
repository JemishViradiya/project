import * as React from 'react'

import { useMock } from '../../lib/mockContext'
import { SessionAcquisitionError } from '../../types/error'
import { checkServiceWorkerError } from '../../utils/error'
import { externalPromise } from '../externalPromise'
import { makeBroadcastChannel } from '../shared/useBroadcastChannel'
import type { UesSessionApiType } from '../type-api'
import type { UesSessionProviderData } from '../types'
import { SessionLogoutUrl, SessionStartUrl } from './network'
import { SessionMgrQuery } from './query'
import { openSsoIframe } from './sso'
import type { SessionMgrProviderData, SmgrSession } from './types'

const Context = React.createContext<SessionMgrProviderData>({ loading: true, future: new Promise(() => null) })

/**
 * useSessionMgrState react hook
 *
 * inludes full context and loading state
 */
export const useSessionMgrState = (): SessionMgrProviderData => React.useContext(Context)

const ref: React.MutableRefObject<SessionMgrProviderData> = {
  current: {
    loading: true,
    future: externalPromise<void>(),
  },
}

const getTenantId = (): string => ref.current.data?.tenantId

const getToken = (): string => ref.current.data?.accessToken

const getTokenVenue = (): string => ref.current.data?.accessTokenVenue

const getPermissions = (): Set<string> => ref.current.data?.permissions

const getSession = (): SessionMgrProviderData => ref.current

const getSessionKey = (): string => ref.current.data?.key

const clearSession = (): void => {
  // todo: call service-worker
}

/**
 * Ues Session non-react API
 */
export const SessionMgrApi: UesSessionApiType<SmgrSession> = {
  getRegion: () => '',
  getTenantId,
  getToken,
  getTokenVenue,
  getPermissions,
  getSession,
  clearSession,
  getSessionKey,
  SessionStartUrl,
  SessionLogoutUrl,
}

const CHANNEL = 'session-mgr'
let useBroadcastChannel: (mock: boolean) => UesSessionProviderData<SmgrSession>
let tokenTimeoutId

const redirectToLoginPage = () => {
  const redirectUrl = SessionStartUrl()
  console.log('eid:session redirecting to', redirectUrl)
  window.location.href = redirectUrl
}

export const SessionMgrProvider: React.FC<{
  redirect?: boolean
  loading?: React.ReactNode
  mock?: boolean | undefined
}> = React.memo(
  ({ redirect = true, loading: loadingElement, mock = process.env.NODE_CONFIG_ENV === 'test', children }): JSX.Element => {
    const shouldMock = useMock({ mock })
    if (!useBroadcastChannel) {
      useBroadcastChannel = makeBroadcastChannel({
        name: CHANNEL,
        query: SessionMgrQuery,
        ref,
      })
    }
    const state = useBroadcastChannel(shouldMock)

    const { loading, data = {} as SmgrSession, error = data.error, fetchData } = state
    const { loggedIn, tokenExpirationTime = 0, idToken, trySso, tokenExpired } = data
    const shouldTrySso = trySso && !shouldMock && idToken
    const shouldRedirect = redirect && !loading && !shouldMock && !loggedIn

    React.useEffect(() => {
      if (tokenExpired && fetchData) {
        clearTimeout(tokenTimeoutId)
        fetchData(true)
      } else if (shouldRedirect && !shouldTrySso) {
        redirectToLoginPage()
      } else if (fetchData) {
        const expiry = tokenExpirationTime - Date.now()
        if (expiry > 0) {
          clearTimeout(tokenTimeoutId)
          tokenTimeoutId = setTimeout(async () => {
            fetchData(true)
          }, expiry)
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldRedirect, tokenExpirationTime, shouldTrySso, tokenExpired])

    if (loadingElement && loading) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <>{loadingElement}</>
    }

    if (shouldTrySso) {
      return (
        <>
          {loadingElement}
          {openSsoIframe(idToken, redirectToLoginPage)}
        </>
      )
    }

    if (shouldRedirect && !shouldTrySso) {
      return null
    }

    if (error && !shouldMock && redirect) {
      checkServiceWorkerError(error)
      throw new SessionAcquisitionError(error)
    }

    return <Context.Provider value={state}>{children}</Context.Provider>
  },
)
