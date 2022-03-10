import type { AbstractUesSession, BaseQuery, UesSessionProviderData } from './types'

export type ConsoleContext = BaseQuery

export interface UesSessionProviderProps {
  redirect?: false
  loading?: React.ReactNode
  mock?: boolean | undefined
}
export type UesSessionProvider = React.FC<UesSessionProviderProps>

export interface UesSessionApiType<Context extends AbstractUesSession = AbstractUesSession> {
  getRegion: () => string
  getTenantId: () => string
  getToken: () => string
  getTokenVenue?: () => string
  getPermissions: () => Set<string>
  getSession: () => UesSessionProviderData<Context>
  clearSession: () => void
  getSessionKey: () => string
  SessionStartUrl: (arg?: string) => string
  SessionLogoutUrl: (arg?: string) => string
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export type UesSession = AbstractUesSession
export type UesSessionLoginUrl = () => string

export type useUesSession = <TContext extends UesSession = UesSession>() => TContext
export type useUesSessionState = <TContext extends AbstractUesSession = AbstractUesSession>() => UesSessionProviderData<TContext>
