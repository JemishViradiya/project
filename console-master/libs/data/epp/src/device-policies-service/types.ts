import type { DevicePolicyListItem } from './../device-policies/types'

interface IDevicePoliciesApi {
  fetchDevicePolicyList(): Promise<DevicePolicyListItem[]>
}

export { IDevicePoliciesApi }
