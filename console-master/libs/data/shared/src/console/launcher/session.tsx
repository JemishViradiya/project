import * as React from 'react'

import { useMock } from '../../lib/mockContext'
import { SessionAcquisitionError } from '../../types/error'
import { checkServiceWorkerError } from '../../utils/error'
import { externalPromise } from '../externalPromise'
import { makeBroadcastChannel } from '../shared/useBroadcastChannel'
import type { UesSessionApiType } from '../type-api'
import type { UesSessionProviderData } from '../types'
import { SessionLoginUrl, SessionLogoutUrl, SessionStartUrl } from './network'
import { LauncherSessionQuery } from './query'
import type { LauncherSession, LauncherSessionProviderData } from './types'

const Context = React.createContext<LauncherSessionProviderData>({ loading: true, future: new Promise(() => null) })

/**
 * useUesSessionState react hook
 *
 * inludes full context and loading state
 */
export const useLauncherSessionState = (): LauncherSessionProviderData => React.useContext(Context)

const ref: React.MutableRefObject<LauncherSessionProviderData> = {
  current: {
    loading: true,
    future: externalPromise<void>(),
  },
}

const getRegion = (): string => ref.current.data?.region

const getTenantId = (): string => ref.current.data?.tenantId

const getToken = (): string => ref.current.data?.accessToken

const getPermissions = (): Set<string> => ref.current.data?.permissions

const getSession = (): LauncherSessionProviderData => ref.current

const getSessionKey = (): string => ref.current.data?.key

const clearSession = (): void => {
  // todo: call service-worker
}

/**
 * Ues Session non-react API
 */
export const LauncherSessionApi: UesSessionApiType<LauncherSession> & { SessionLoginUrl: typeof SessionLoginUrl } = {
  getRegion,
  getTenantId,
  getToken,
  getPermissions,
  getSession,
  clearSession,
  getSessionKey,
  SessionStartUrl,
  SessionLoginUrl,
  SessionLogoutUrl,
}

let useBroadcastChannel: (mock: boolean) => UesSessionProviderData<LauncherSession>
let tokenTimeoutId

export const LauncherSessionProvider: React.FC<{
  redirect?: false
  loading?: React.ReactNode
  mock?: boolean | undefined
  tenantParam?: string
}> = React.memo(
  ({
    redirect = true,
    loading: loadingElement,
    mock = process.env.NODE_CONFIG_ENV === 'test',
    tenantParam,
    children,
  }): JSX.Element => {
    const shouldMock = useMock({ mock })
    if (!useBroadcastChannel) {
      useBroadcastChannel = makeBroadcastChannel({ name: 'launcher-session', query: LauncherSessionQuery, ref })
    }
    const state = useBroadcastChannel(shouldMock)

    const { loading, data: { loggedIn, tokenExpirationTime } = {}, error, fetchData } = state
    const shouldRedirect = redirect && !loading && (!loggedIn || error) && !shouldMock

    React.useEffect(() => {
      if (shouldRedirect) {
        const redirectUrl = SessionStartUrl(tenantParam ? tenantParam.toLowerCase() : undefined)
        console.log('vtx:session redirecting to', redirectUrl)
        window.location.href = redirectUrl
      } else if (fetchData) {
        const expiry = tokenExpirationTime - Date.now()
        if (expiry > 0) {
          clearTimeout(tokenTimeoutId)
          tokenTimeoutId = setTimeout(async () => {
            fetchData()
          }, expiry - 5000)
        }
      }
    }, [fetchData, shouldRedirect, tenantParam, tokenExpirationTime])

    if (loadingElement && loading) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <>{loadingElement}</>
    }

    if (shouldRedirect) {
      return null
    }

    if (error && !shouldMock && redirect) {
      checkServiceWorkerError(error)
      throw new SessionAcquisitionError(error)
    }

    return <Context.Provider value={state}>{children}</Context.Provider>
  },
)
