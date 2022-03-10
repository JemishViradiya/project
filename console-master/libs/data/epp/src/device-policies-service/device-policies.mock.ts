import type { DevicePolicyListItem } from './../device-policies/types'
import { MOCK_POLICY_LIST } from './data.mock'
import type { IDevicePoliciesApi } from './types'

class DevicePoliciesMockApiClass implements IDevicePoliciesApi {
  fetchDevicePolicyList(): Promise<DevicePolicyListItem[]> {
    return Promise.resolve(MOCK_POLICY_LIST)
  }
}

const DevicePoliciesMockApi = new DevicePoliciesMockApiClass()

export default DevicePoliciesMockApi
