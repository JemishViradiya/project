import * as React from 'react'

import { useMock } from '../../lib/mockContext'
import { SessionAcquisitionError } from '../../types/error'
import { checkServiceWorkerError } from '../../utils/error'
import { externalPromise } from '../externalPromise'
import { makeBroadcastChannel } from '../shared/useBroadcastChannel'
import type { UesSessionApiType } from '../type-api'
import type { UesSessionProviderData } from '../types'
import { SessionLogoutUrl, SessionStartUrl } from './network'
import { VenueSessionQuery } from './query'
import type { VenueSession, VenueSessionProviderData } from './types'

const Context = React.createContext<VenueSessionProviderData>({ loading: true, future: new Promise(() => null) })

/**
 * useVenueSession react hook
 *
 * includes full context
 */
export const useVenueSession = (): VenueSession => React.useContext(Context).data

/**
 * useVenueSessionState react hook
 *
 * inludes full context and loading state
 */
export const useVenueSessionState = (): VenueSessionProviderData => React.useContext(Context)

const ref: React.MutableRefObject<VenueSessionProviderData> = {
  current: {
    loading: true,
    future: externalPromise<void>(),
  },
}

const awaitVerificationToken = async (): Promise<string> => {
  if (!ref.current.data?.verificationTokenVenue) {
    await ref.current.future
  }
  return ref.current.data?.verificationTokenVenue
}

const getVerificationToken = (): string => ref.current.data?.verificationTokenVenue

const getTenantId = (): string => ref.current.data?.tenantIdVenue

const getToken = (): string => ref.current.data?.accessTokenVenue

const getSession = (): VenueSessionProviderData => ref.current

const getPermissions = (): Set<string> => ref.current.data?.permissions

const getSessionKey = (): string => ref.current.data?.key

const clearSession = (): void => {
  // todo: call service-worker
}

/**
 * Venue Session non-react API
 */
export const VenueSessionApi: Omit<UesSessionApiType, 'getSession'> & {
  awaitVerificationToken: typeof awaitVerificationToken
  getVerificationToken: typeof getVerificationToken
  getSession: typeof getSession
} = {
  awaitVerificationToken,
  getVerificationToken,
  getRegion: () => '',
  getToken,
  getTenantId,
  getPermissions,
  getSession,
  clearSession,
  getSessionKey,
  SessionStartUrl,
  SessionLogoutUrl,
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
let useBroadcastChannel: (mock: boolean) => UesSessionProviderData<VenueSession>
let tokenTimeoutId

export const VenueSessionProvider: React.FC<{
  redirect?: false
  loading?: React.ReactNode
  mock?: boolean | undefined
}> = React.memo(
  ({ redirect = true, loading: loadingElement, mock, children }): JSX.Element => {
    const shouldMock = useMock({ mock })
    if (!useBroadcastChannel) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      useBroadcastChannel = makeBroadcastChannel<VenueSession>({ name: 'venue-session', query: VenueSessionQuery, ref })
    }
    const state: VenueSessionProviderData = useBroadcastChannel(shouldMock)

    const { loading, data: { loggedIn, tokenExpirationTime } = {}, error, fetchData } = state
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
            fetchData()
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
