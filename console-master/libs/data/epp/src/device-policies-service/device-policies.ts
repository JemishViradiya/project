import { axiosInstance, devicePoliciesBaseUrl } from '../config.rest'
import type { DevicePolicyListItem } from './../device-policies/types'
import type { IDevicePoliciesApi } from './types'

class DevicePoliciesApiClass implements IDevicePoliciesApi {
  fetchDevicePolicyList(): Promise<DevicePolicyListItem[]> {
    return axiosInstance().get<DevicePolicyListItem, DevicePolicyListItem[]>(`${devicePoliciesBaseUrl}/`)
  }
}

const DevicePoliciesApi = new DevicePoliciesApiClass()

export default DevicePoliciesApi
