import type { Response } from '@ues-data/shared-types'

import { axiosInstance, personaUsersBaseUrl } from '../config.rest'
import type { ListRequestParams, StatisticsCountResponse } from '../types'
import { paramsSerializer, transformListRequestParams } from '../utils'
import type UserInterface from './user-interface'
import type {
  DevicesGroupedByUserListResponse,
  GetTenantDeviceOnlineCountParams,
  GetUserContainingUsernameParams,
  GetUserListParams,
  ShortDeviceItem,
  ShortUserItem,
  UserDetails,
  UserDevicesResponse,
  UsersListResponse,
  UserWithTrustScore,
} from './users-types'

class UsersClass implements UserInterface {
  getUserList(params: GetUserListParams): Response<UsersListResponse> {
    const queryParams = transformListRequestParams(params)

    return axiosInstance().get(personaUsersBaseUrl, { params: queryParams, paramsSerializer })
  }
  getDevicesGroupedByUserList(params: ListRequestParams): Response<DevicesGroupedByUserListResponse> {
    const queryParams = transformListRequestParams(params)

    return axiosInstance().get(`${personaUsersBaseUrl}/devices/groupedByUser`, { params: queryParams, paramsSerializer })
  }
  getUserDetails(userId: string): Response<UserDetails> {
    return axiosInstance().get(`${personaUsersBaseUrl}/${userId}`)
  }
  deleteUsers(userIds: string[]): Response {
    return axiosInstance().delete(personaUsersBaseUrl, { params: { id: userIds }, paramsSerializer })
  }
  getUserDevices(userId: string): Response<UserDevicesResponse> {
    return axiosInstance().get(`${personaUsersBaseUrl}/devices`, { params: { userId } })
  }
  getUsersContainingUsername(params: GetUserContainingUsernameParams): Response<ShortUserItem[]> {
    return axiosInstance().get(`${personaUsersBaseUrl}/short`, { params, paramsSerializer })
  }
  getDeviceContainsDeviceName(query: string): Response<ShortDeviceItem[]> {
    return axiosInstance().get(`${personaUsersBaseUrl}/devices/prompt`, { params: { deviceName: query } })
  }
  getTenantDeviceOnlineCount(params: GetTenantDeviceOnlineCountParams): Response<StatisticsCountResponse> {
    return axiosInstance().get(`${personaUsersBaseUrl}/devices/counts`, { params, paramsSerializer })
  }
  getTenantTopLowestTrustScoreUsers(): Response<UserWithTrustScore[]> {
    return axiosInstance().get(`${personaUsersBaseUrl}/trustScores/lowest`)
  }
}

const UsersApi = new UsersClass()

export { UsersApi }
