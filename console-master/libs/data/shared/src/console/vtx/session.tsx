import * as React from 'react'

import { useMock } from '../../lib/mockContext'
import { SessionAcquisitionError } from '../../types/error'
import { checkServiceWorkerError } from '../../utils/error'
import { externalPromise } from '../externalPromise'
import { makeBroadcastChannel } from '../shared/useBroadcastChannel'
import type { UesSessionApiType } from '../type-api'
import type { UesSessionProviderData } from '../types'
import { SessionLogoutUrl, SessionStartUrl } from './network'
import { VtxSessionQuery } from './query'
import type { VtxSession, VtxSessionProviderData } from './types'

const Context = React.createContext<VtxSessionProviderData>({ loading: true, future: new Promise(() => null) })

/**
 * useVtxSessionState react hook
 *
 * inludes full context and loading state
 */
export const useVtxSessionState = (): VtxSessionProviderData => React.useContext(Context)

const ref: React.MutableRefObject<VtxSessionProviderData> = {
  current: {
    loading: true,
    future: externalPromise<void>(),
  },
}

const getTenantId = (): string => ref.current.data?.tenantId

const getToken = (): string => ref.current.data?.accessToken

const getTokenVenue = (): string => ref.current.data?.accessTokenVenue

const getPermissions = (): Set<string> => ref.current.data?.permissions

const getSession = (): VtxSessionProviderData => ref.current

const getSessionKey = (): string => ref.current.data?.key

const clearSession = (): void => {
  // todo: call service-worker
}

/**
 * Ues Session non-react API
 */
export const VtxSessionApi: UesSessionApiType<VtxSession> = {
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

let useBroadcastChannel: (mock: boolean) => UesSessionProviderData<VtxSession>
let tokenTimeoutId

export const VtxSessionProvider: React.FC<{
  redirect?: false
  loading?: React.ReactNode
  mock?: boolean | undefined
}> = React.memo(
  ({ redirect = true, loading: loadingElement, mock = process.env.NODE_CONFIG_ENV === 'test', children }): JSX.Element => {
    const shouldMock = useMock({ mock })
    if (!useBroadcastChannel) {
      useBroadcastChannel = makeBroadcastChannel({
        name: 'vtx-session',
        query: VtxSessionQuery,
        ref,
        matchUrls: new Set(['/uc/session/venue']),
      })
    }
    const state = useBroadcastChannel(shouldMock)

    const { loading, data = {} as VtxSession, fetchData, error = data.error } = state
    const { loggedIn, tokenExpirationTime = 0 } = data
    const shouldRedirect = redirect && !loading && !shouldMock && ((!loggedIn && !error) || (error && error['status'] === 401))

    React.useEffect(() => {
      if (shouldRedirect) {
        const redirectUrl = SessionStartUrl()
        console.log('vtx:session redirecting to', redirectUrl)
        window.location.href = redirectUrl
      } else if (fetchData) {
        const expiry = tokenExpirationTime - Date.now()
        if (expiry > 0) {
          clearTimeout(tokenTimeoutId)
          tokenTimeoutId = setTimeout(async () => {
            fetchData(true)
          }, expiry - 5000)
        }
      }
    }, [fetchData, shouldRedirect, tokenExpirationTime])

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
