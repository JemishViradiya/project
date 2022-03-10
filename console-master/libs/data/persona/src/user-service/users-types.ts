import type { PersonaModelStatus } from '../model-service'
import type { ListRequestParams, PaginatedResponse, StatisticsTimeInterval } from '../types'

export enum UserState {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export enum ProvisioningStatus {
  NOT_PROVISIONED = 'NOT_PROVISIONED',
  SUCCESSFUL = 'SUCCESSFUL',
  SKIPPED = 'SKIPPED',
  DELETED = 'DELETED',
}

export interface ZoneInfo {
  id: string
  name: string
}

export interface UserItem {
  id: string
  zones: ZoneInfo[]
  userName: string
  domainName: string
  state: UserState
  lastEventTime: string
}

export interface ShortUserItem {
  id: string
  userName: string
  domainName: string
}

export interface ShortDeviceItem {
  deviceId: string
  deviceName: string
}

export interface DeviceByUserItem {
  userId: string
  userName: string
  deviceId: string
  deviceName: string
  modelStatus: PersonaModelStatus
  provisioningStatus: ProvisioningStatus
}

export type UsersListResponse = PaginatedResponse<UserItem>

export type DevicesGroupedByUserListResponse = PaginatedResponse<DeviceByUserItem>

export interface GetUserListParams extends ListRequestParams {
  excludeZoneId?: string
}

export interface GetUserContainingUsernameParams {
  userName: string
  zoneId?: string
  excludeZoneId?: string
}

export interface UserDetails {
  id: string
  zones: ZoneInfo[]
  userName: string
  domainName: string
}

export interface UserDeviceInfo {
  id: string
  deviceName: string
  trustScore: number
  lastEventTime: string
}

export interface UserDevicesResponse {
  data: UserDeviceInfo[]
}

export interface GetTenantDeviceOnlineCountParams {
  fromTime: string
  toTime: string
  interval: StatisticsTimeInterval
}

export interface UserWithTrustScore {
  id: string
  userName: string
  trustScore: number
}
