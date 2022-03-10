import type { ReduxQuery } from '@ues-data/shared'
import { NoPermissions } from '@ues-data/shared'

import { DevicePoliciesApi, DevicePoliciesMockApi } from './../device-policies-service'
import { fetchDevicePolicyListStart } from './actions'
import type { DevicePoliciesTaskId } from './constants'
import { DevicePoliciesReduxSlice } from './constants'
import { selectDevicePolicyList } from './selectors'
import type { DevicePoliciesState, DevicePolicyListItem } from './types'

const fetchDevicePolicyList: ReduxQuery<
  DevicePolicyListItem[],
  undefined,
  DevicePoliciesState['tasks'][DevicePoliciesTaskId.FetchDevicePolicyList]
> = {
  query: () => fetchDevicePolicyListStart(DevicePoliciesApi),
  mockQuery: () => fetchDevicePolicyListStart(DevicePoliciesMockApi),
  selector: () => selectDevicePolicyList,
  slice: DevicePoliciesReduxSlice,
  permissions: NoPermissions, // --TODO
}

export { fetchDevicePolicyList }
