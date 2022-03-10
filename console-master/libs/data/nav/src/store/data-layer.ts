import type { ReduxQuery } from '@ues-data/shared'
import { NoPermissions } from '@ues-data/shared'

import type { QueryAppsVars } from './actions'
import { fetchNavAppsStart } from './actions'
import { getApps } from './selectors'
import type { NavAppsState } from './types'
import { ReduxSlice } from './types'

export const queryApps: ReduxQuery<string, QueryAppsVars, NavAppsState['navApps']> = {
  query: payload => fetchNavAppsStart(false, payload?.refetch),
  mockQuery: payload => fetchNavAppsStart(true, payload?.refetch),
  selector: () => getApps,
  dataProp: null,
  slice: ReduxSlice,
  permissions: NoPermissions,
}
