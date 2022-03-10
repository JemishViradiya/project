import type { Response } from '@ues-data/shared-types'

import type { ListRequestParams, StatisticsCountResponse } from '../types'
import type UserInterface from './user-interface'
import {
  DeviceByUserListResponseMock,
  DeviceContainsDeviceNameResponseMock,
  getPersonaTenantDeviceOnlineCountResponse,
  PersonaTenantTopLowerTrustScoreUsersMockResponse,
  UserContainsUsernameResponseMock,
  UserDetailsResponseMock,
  UserDevicesResponseMock,
  UsersListResponseMock,
} from './users-mock.data'
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

class UsersMockClass implements UserInterface {
  getUserList(params: GetUserListParams): Response<UsersListResponse> {
    console.log('UsersMockApi -> getUserList', { params })
    return Promise.resolve({ data: UsersListResponseMock })
  }
  getDevicesGroupedByUserList(params: ListRequestParams): Response<DevicesGroupedByUserListResponse> {
    console.log('UsersMockApi -> getDevicesGroupedByUserList', { params })
    return Promise.resolve({ data: DeviceByUserListResponseMock })
  }
  getUserDetails(userId: string): Response<UserDetails> {
    console.log('UsersMockApi -> getUserDetails', { userId })
    return Promise.resolve({ data: UserDetailsResponseMock })
  }
  deleteUsers(userIds: string[]): Response<unknown> {
    console.log('UsersMockApi -> deleteUsers', { userIds })
    return Promise.resolve({ data: '' })
  }
  getUserDevices(userId: string): Response<UserDevicesResponse> {
    console.log('UsersMockApi -> getUserDevices', { userId })
    return Promise.resolve({ data: UserDevicesResponseMock })
  }
  getUsersContainingUsername(params: GetUserContainingUsernameParams): Response<ShortUserItem[]> {
    console.log('UsersMockApi -> getUsersContainingUsername', { params })
    return Promise.resolve({ data: UserContainsUsernameResponseMock })
  }
  getDeviceContainsDeviceName(query: string): Response<ShortDeviceItem[]> {
    console.log('UsersMockApi -> getDeviceContainsDeviceName', { query })
    return Promise.resolve({ data: DeviceContainsDeviceNameResponseMock })
  }
  getTenantDeviceOnlineCount(params: GetTenantDeviceOnlineCountParams): Response<StatisticsCountResponse> {
    console.log('UsersMockApi -> getTenantDeviceOnlineCount', { params })
    return Promise.resolve({ data: getPersonaTenantDeviceOnlineCountResponse(params) })
  }
  getTenantTopLowestTrustScoreUsers(): Response<UserWithTrustScore[]> {
    console.log('UsersMockApi -> getTenantTopLowestTrustScoreUsers')
    return Promise.resolve({ data: PersonaTenantTopLowerTrustScoreUsersMockResponse })
  }
}

const UsersMockApi = new UsersMockClass()

export { UsersMockApi }
