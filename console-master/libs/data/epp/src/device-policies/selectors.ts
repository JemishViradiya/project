import { createSelector } from 'reselect'

import { DevicePoliciesReduxSlice, DevicePoliciesTaskId } from './constants'
import type { DevicePoliciesState } from './types'

const getState = (state: { [k in typeof DevicePoliciesReduxSlice]: DevicePoliciesState }) => state[DevicePoliciesReduxSlice]
const getTasks = createSelector(getState, state => state?.tasks)

const selectDevicePolicyList = createSelector(getTasks, tasks => tasks[DevicePoliciesTaskId.FetchDevicePolicyList])

export { selectDevicePolicyList }
