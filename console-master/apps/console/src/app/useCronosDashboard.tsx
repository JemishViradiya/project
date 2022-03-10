import { initialize, ReduxSlice, selectIsInitialized } from '@ues-data/dashboard-config'
import type { ReduxQuery } from '@ues-data/shared'
import { NoPermissions, useStatefulReduxQuery } from '@ues-data/shared'

import { dashboardConfigs } from '../assets'

const query: ReduxQuery<boolean, Parameters<typeof initialize>[0], boolean> = {
  query: cronosNavigation => initialize(cronosNavigation ? dashboardConfigs : []),
  mockQuery: cronosNavigation => initialize(cronosNavigation ? dashboardConfigs : []),
  selector: () => selectIsInitialized,
  slice: ReduxSlice,
  permissions: NoPermissions,
}

export const useCronosDashboard = (cronosNavigation: boolean) => {
  useStatefulReduxQuery(query, { variables: cronosNavigation })
}
