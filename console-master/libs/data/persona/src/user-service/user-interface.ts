import type { Response } from '@ues-data/shared-types'

import type { ListRequestParams, StatisticsCountResponse } from '../types'
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

export default interface UserInterface {
  /**
   * Get filtered, sorted and paginated users list
   * use `exludeZoneId` param to exmplude users from specific zone
   * @param  {GetUserListParams} params
   */
  getUserList(params: GetUserListParams): Response<UsersListResponse>

  /**
   * Get filtered, sorted and paginated device grouped by users list
   * @param  {ListRequestParams} params
   * @returns Response
   */
  getDevicesGroupedByUserList(params: ListRequestParams): Response<DevicesGroupedByUserListResponse>

  /**
   * Get specific user details
   * @param  {string} userId
   */
  getUserDetails(userId: string): Response<UserDetails>

  /**
   * Delete list of users by id
   * @param  {string[]} userIds
   * @returns Response
   */
  deleteUsers(userIds: string[]): Response

  /**
   * Get all devices related to specific user
   * @param  {string} userId
   * @returns Response
   */
  getUserDevices(userId: string): Response<UserDevicesResponse>

  /**
   * Get users list which usernames contain `username` param search string
   * Can be filtered by `zoneId` and `excludeZoneId` params
   * @param  {GetUserContainingUsernameParams} params
   * @returns Response
   */
  getUsersContainingUsername(params: GetUserContainingUsernameParams): Response<ShortUserItem[]>

  /**
   * Get devices list which device names contain `query` param search string
   * @param  {string} query
   * @returns Response
   */
  getDeviceContainsDeviceName(query: string): Response<ShortDeviceItem[]>

  /**
   * Get tenant online device count log
   * @param  {GetTenantDeviceOnlineCountParams} params
   */
  getTenantDeviceOnlineCount(params: GetTenantDeviceOnlineCountParams): Response<StatisticsCountResponse>

  /**
   * Get list of users with lowest trust score on current tenant
   */
  getTenantTopLowestTrustScoreUsers(): Response<UserWithTrustScore[]>
}
