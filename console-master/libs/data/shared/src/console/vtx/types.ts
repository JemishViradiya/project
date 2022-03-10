import type { VtxSession as VtxSessionData } from '@ues-data/network'

import type { AbstractUesSession, UesSessionProviderData } from '../types'

export interface VtxSession extends AbstractUesSession, Omit<VtxSessionData, 'scopes' | 'permissions'> {
  key: string
  scopes: Set<string>
}

export type VtxSessionProviderData = UesSessionProviderData<VtxSession>
