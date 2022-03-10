import type { AbstractSession } from '@ues-data/network'

import type { AbstractQuery } from '../lib/statefulCommon'
import type { Permission } from '../permissions/types'

export type SessionBackend = 'bblauncher' | 'vtx'

export interface AbstractUesSession extends Omit<AbstractSession, 'permissions' | 'accessTokenVenue'> {
  permissions: Set<Permission>
}

export type BaseQueryArgs = {
  refresh?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseQuery<Data extends AbstractUesSession = AbstractUesSession>
  extends Omit<AbstractQuery<(args?: BaseQueryArgs) => Promise<Data>, BaseQueryArgs, Data>, 'mockQueryFn'> {
  mockQueryFn: (args?: BaseQueryArgs) => Promise<Data> | Data
  url: string
}

export interface UesSessionProviderData<Data extends AbstractUesSession> {
  loading: boolean
  data?: Data
  error?: Error
  future: Promise<void>
  fetchData?: (refresh?: boolean) => void
}
