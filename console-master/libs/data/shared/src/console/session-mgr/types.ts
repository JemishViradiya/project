import type { SmgrSession as SessionData } from '@ues-data/network'

import type { AbstractUesSession, UesSessionProviderData } from '../types'

export interface SmgrSession extends Omit<AbstractUesSession, 'idToken'>, Omit<SessionData, 'scopes' | 'permissions'> {
  key: string
  scopes: Set<string>
}

export type SessionMgrProviderData = UesSessionProviderData<SmgrSession>
