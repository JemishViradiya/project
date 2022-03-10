import type { PlatformPagedView } from '../../shared/types'

export enum DeviceOs {
  IOS = 'iOS',
  ANDROID = 'Android',
}

export enum RiskLevelStatus {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  SECURED = 'SECURED',
  UNKNOWN = 'UNKNOWN',
}

export enum EmmConnectionType {
  UEM = 'UEM',
  INTUNE = 'INTUNE',
  NULL = 'NULL',
}

export enum EmmConnectionRegistrationStatus {
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  ERROR = 'ERROR',
  UNKNOWN = 'UNKNOWN',
}

export interface PlatformDevice {
  deviceId: string
  extDeviceId?: string
  platform: string
  osVersion: string
  securityPatch?: string
  deviceModelName: string
  deviceModelAlias?: string
  manufacturer?: string
}

export interface PlatformService {
  serviceId: string
  status: 'ASSOCIATED' | 'DISASSOCIATED'
}

export interface PlatformEndpoint {
  guid: string
  tenantId: string
  userId: string
  appBundleId?: string
  appVersion?: string
  entitlementId?: string
  created?: Date
  modified?: Date
  expires?: Date
  deviceInfo: PlatformDevice
  services?: PlatformService[]
}

export interface AggregatedEndpoint {
  endpointId: string
  tenantId: string
  userId: string
  userDisplayName: string
  userEmailAddress: string
  deviceId: string
  osPlatform: DeviceOs
  osVersion: string
  device: string
  agent: string
  appBundleId: string
  appVersion: string
  enrollmentStatus?: 'PENDING_REGISTRATION' | 'REGISTERED' | 'PENDING_DEREGISTRATION' | 'UNKNOWN'
  status?: string // TODO clarify values
  alerts?: number
  mobile: boolean
  lastOnline?: Date
  enrollmentTime?: Date
  osSecurityPatch?: string
  riskLevelStatus?: RiskLevelStatus
  emmType?: EmmConnectionType
  emmRegistrationStatus?: EmmConnectionRegistrationStatus
}

export type PlatformEndpoints = PlatformPagedView<PlatformEndpoint>
export type AggregatedEndpoints = PlatformPagedView<AggregatedEndpoint>
