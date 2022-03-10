import { DevicePoliciesActions } from './constants'
import type { DevicePoliciesApiProvider, DevicePolicyListItem } from './types'

const fetchDevicePolicyListStart = (apiProvider: DevicePoliciesApiProvider) => ({
  type: DevicePoliciesActions.FetchDevicePolicyListStart,
  payload: apiProvider,
})

const fetchDevicePolicyListSuccess = (list: DevicePolicyListItem[]) => ({
  type: DevicePoliciesActions.FetchDevicePolicyListSuccess,
  payload: list,
})

const fetchDevicePolicyListError = (error: Error) => ({
  type: DevicePoliciesActions.FetchDevicePolicyListError,
  payload: error,
})

export { fetchDevicePolicyListStart, fetchDevicePolicyListSuccess, fetchDevicePolicyListError }
