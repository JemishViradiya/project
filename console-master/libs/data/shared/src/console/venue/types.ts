import type { VenueSession as VenueSessionData } from '@ues-data/network'

import type { AbstractUesSession, UesSessionProviderData } from '../types'

export interface VenueSession
  extends Omit<AbstractUesSession, 'userId' | 'tenantId' | 'scopes' | 'accessToken' | 'idToken'>,
    Omit<VenueSessionData, 'permissions'> {
  key: string
}

export interface VenueSessionProviderData extends Omit<UesSessionProviderData<AbstractUesSession>, 'data'> {
  loading: boolean
  data?: VenueSession
  error?: Error
  future: Promise<void>
  fetchData?: (refresh?: boolean) => void
}
