// import { UES_ENV } from '@ues-data/network'

import { UES_ENV } from '@ues-data/network'

import { resolveOverrideEnvironmentValue } from '../shared/overrideEnvironmentVariable'
import * as LauncherSessionApi from './launcher'
import * as SessionMgrApi from './session-mgr'
import type { UesSession, UesSessionApiType, UesSessionProviderProps } from './type-api'
import type { AbstractUesSession, BaseQuery, UesSessionProviderData } from './types'
import * as VenueSessionApi from './venue'
import * as VtxSessionApi from './vtx'

export { encodeRedirectUri } from './network'

enum UesSessionBackendTypes {
  Launcher = 'launcher',
  Vtx = 'vtx',
  SessionManager = 'session-mgr',
}

const resolveBackend = () => {
  const backend = resolveOverrideEnvironmentValue('UES_SESSION_BACKEND').value
  if (
    backend === UesSessionBackendTypes.Launcher ||
    backend === UesSessionBackendTypes.Vtx ||
    backend === UesSessionBackendTypes.SessionManager
  )
    return backend

  if (UES_ENV === 'DEV') return UesSessionBackendTypes.SessionManager
  return UesSessionBackendTypes.Vtx
}

const UesSessionBackendType: UesSessionBackendTypes = resolveBackend()

const ApiContext = ((): typeof LauncherSessionApi | typeof VtxSessionApi | typeof SessionMgrApi => {
  if (UesSessionBackendType === UesSessionBackendTypes.Launcher) {
    return LauncherSessionApi
  } else if (UesSessionBackendType === UesSessionBackendTypes.SessionManager) {
    return SessionMgrApi
  } else {
    return VtxSessionApi
  }
})()

export { LauncherSessionApi, VenueSessionApi, VtxSessionApi, SessionMgrApi, UesSessionBackendTypes, UesSessionBackendType }
export type { UesSession, UesSessionProviderData, UesSessionProviderProps }

export const UesSessionQuery = ApiContext.SessionQuery as BaseQuery
export const UesSessionApi = ApiContext.SessionApi as UesSessionApiType<AbstractUesSession>
export const UesSessionProvider = ApiContext.SessionProvider

export const useUesSessionState = ApiContext.useSessionState as <Data extends AbstractUesSession>() => UesSessionProviderData<Data>

const initialSession = {}
/**
 * useUesSession react hook
 *
 * includes full context
 */
export const useUesSession = <Data extends AbstractUesSession>(): Data =>
  useUesSessionState<Data>().data || (initialSession as Data)
