import type { ListRequestParams, PaginatedMeta, StatisticsTimeInterval } from '../types'

export enum PersonaScoreChartInterval {
  Last30Days = 'LAST30DAYS',
  Last24Hours = 'LAST24HRS',
}

export enum PersonaSeverity {
  INFO = 'INFO',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum PersonaAlertType {
  FAILED_MFA = 'FAILED_MFA',
  USER_FAILED_LOGON = 'USER_FAILED_LOGON',
  FORCED_MFA = 'FORCED_MFA',
  MALICIOUS_RULE_HIT = 'MALICIOUS_RULE_HIT',
  USER_NEW_DEVICE_LOGON = 'USER_NEW_DEVICE_LOGON',
  USER_TRUST_SCORE_THRESHOLD_CROSSED = 'USER_TRUST_SCORE_THRESHOLD_CROSSED',
}

export enum PersonaAlertStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEWED = 'REVIEWED',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
}

export enum PersonaScoreType {
  TRUSTSCORE = 'TRUSTSCORE',
  META = 'META',
  KEYBOARD = 'KEYBOARD',
  MOUSE = 'MOUSE',
  CONDUCT = 'CONDUCT',
  NETWORK = 'NETWORK',
  LOGON = 'LOGON',
}

export interface AlertDetails {
  id: string
  userId: string
  deviceId: string
  userName: string
  domainName: string
  userZoneName: string
  deviceName: string
  ipAddress: string
  timestamp: string
  eventId: number
  severity: PersonaSeverity
  status: PersonaAlertStatus
  trustScore: number
  lowestTrustScore: number
}

export interface AlertListItem {
  alertId: string
  userId: string
  deviceId: string
  userName: string
  domainName: string
  deviceName: string
  eventId: number
  severity: string
  status: string
  trustScore: number
  timestamp: string
}

export interface AlertCommentItem {
  id: string
  content: string
  created: string
  ownerId: string
  ownerName: string
}

export interface AlertListResponse {
  data: AlertListItem[]
  meta?: PaginatedMeta
}

export interface GetAlertListParams extends ListRequestParams {
  userId?: string
}

export interface GetPersonaScoreLogParams {
  fromTime: string
  toTime: string
  userId: string
  deviceId: string
  scoreType: PersonaScoreType
}

export interface PersonaScoreLogItem {
  timestamp: string
  score?: number
  scoreType?: PersonaScoreType
  deviceId?: string
  userId?: string
}

export interface GetAlertsWithTrustScoreParams {
  fromTime: string
  toTime: string
  userId: string
  deviceId: string
  sort: string
}

export interface PersonaAlertWithTrustScoreItem {
  id: string
  timestamp: string
  eventId: number
  severity: number
  trustScore: number
}

export interface AddAlertCommentParams {
  alertId: string
  ownerId: string
  ownerName: string
  content: string
}

export interface GetTenantAlertsCountForAlertTypeParams {
  fromTime: string
  toTime: string
  interval: StatisticsTimeInterval
  alertableType: number
}

export interface UpdateAlertStatusParams {
  id: string
  status: string
  userEmail: string
}
