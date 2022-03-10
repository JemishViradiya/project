//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import type { ReconciliationEntityType } from '@ues-data/shared'

export enum TlsVersions {
  UNDETERMINED = 'UNDETERMINED',
  SSLv2 = 'SSLv2',
  SSLv3 = 'SSLv3',
  TLSv1 = 'TLSv1',
  TLS11 = 'TLS 1.1',
  TLS12 = 'TLS 1.2',
  TLS13 = 'TLS 1.3',
}

export enum ReportingServiceAppProto {
  DNS = 'DNS',
  TLS = 'TLS',
  UDP = 'UDP',
}

export enum ReportingServiceInterval {
  Minute = 'Minute',
  Hour = 'Hour',
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
  Quarter = 'Quarter',
  Year = 'Year',
}

export enum ReportingServiceAlertAction {
  Allowed = 'ALLOWED',
  Blocked = 'BLOCKED',
}

export enum ReportingServiceField {
  Action = 'Action',
  Anomaly = 'Anomaly',
  AppDest = 'AppDest',
  AppName = 'AppName',
  AppProto = 'AppProto',
  BisScore = 'BisScore',
  BytesTotal = 'BytesTotal',
  Category = 'Category',
  DestinationFqdn = 'DestinationFqdn',
  DestinationPort = 'DestinationPort',
  DestinationIp = 'DestinationIp',
  DevicePlatform = 'DevicePlatform',
  DeviceModelName = 'DeviceModelName',
  EcoId = 'EcoId',
  NetworkRoute = 'NetworkRoute',
  PolicyId = 'PolicyId',
  PolicyName = 'PolicyName',
  RuleName = 'RuleName',
  SourceIp = 'SourceIp',
  TlsVersion = 'TlsVersion',
  TsStart = 'TsStart',
  TsTerm = 'TsTerm',
}

export enum ReportingServiceBucketField {
  BytesTotal = 'BytesTotal',
  Count = 'Count',
  Key = 'Key',
  MinTsStart = 'MinTsStart',
  MinTsTerm = 'MinTsTerm',
  MaxTsStart = 'MaxTsStart',
  MaxTsTerm = 'MaxTsTerm',
}

export enum ReportingServiceFilter {
  AlertAction = 'alertAction',
  AlertPolicyId = 'alertPolicyId',
  AlertPolicyName = 'alertPolicyName',
  AlertPolicyType = 'alertPolicyType',
  AlertTypes = 'alertTypes',
  Anomaly = 'anomaly',
  AppName = 'appName',
  AppProtoMatch = 'appProtoMatch',
  BytesToClient = 'bytesToClient',
  BytesToServer = 'bytesToServer',
  BytesTotal = 'bytesTotal',
  Category = 'category',
  DatapointId = 'datapointId',
  Destination = 'destination',
  DestinationPort = 'destinationPort',
  DestMatch = 'destMatch',
  EcoId = 'ecoId',
  EcoIds = 'ecoIds',
  EndpointIds = 'endpointIds',
  NetworkRoute = 'networkRoute',
  PktsToClient = 'pktsToClient',
  PktsToServer = 'pktsToServer',
  RuleNameMatch = 'ruleNameMatch',
  SourceIp = 'sourceIp',
  TlsVersion = 'tlsVersion',
  TsStart = 'tsStart',
  TsTerm = 'tsTerm',
}

export enum ReportingServiceNetworkRouteType {
  Public = 'public',
  Private = 'private',
}

export enum ReportingServiceEventType {
  Alert = 'ALERT',
  Tls = 'TLS',
  Flow = 'FLOW',
}

export enum ReportingServiceSortDirection {
  Asc = 'ASC',
  Desc = 'DESC',
}

export enum ReportingServiceAlertType {
  IpReputation = 'IpReputation',
  Signature = 'Signature',
  Protocol = 'Protocol',
  DnsTunneling = 'DnsTunneling',
}

export enum ReportingServiceAccessRequestType {
  IpRequest = 'IpRequest',
  DnsRequest = 'DnsRequest',
  SniRequest = 'SniRequest',
}

export interface ReportingServiceRange {
  from?: number | string
  to?: number | string
}

export enum ReportingServiceFilterOperator {
  Not = 'not',
  Or = 'or',
}

export enum ReportingServiceMatch {
  Contains = 'Contains',
  EndsWith = 'EndsWith',
  Equals = 'Equals',
  StartsWith = 'StartsWith',
}

export interface ReportingServiceFieldMatch {
  str: string
  match: ReportingServiceMatch
}

export interface ReportingServiceQueryFilters {
  [ReportingServiceFilter.AlertAction]?: ReportingServiceAlertAction
  [ReportingServiceFilter.AlertPolicyId]?: string
  [ReportingServiceFilter.AlertPolicyName]?: string
  [ReportingServiceFilter.AlertPolicyType]?: ReconciliationEntityType
  [ReportingServiceFilter.AlertTypes]?: ReportingServiceAlertType[]
  [ReportingServiceFilter.Anomaly]?: boolean
  [ReportingServiceFilter.AppName]?: string
  [ReportingServiceFilter.AppProtoMatch]?: ReportingServiceFieldMatch
  [ReportingServiceFilter.BytesToClient]?: ReportingServiceRange
  [ReportingServiceFilter.BytesToServer]?: ReportingServiceRange
  [ReportingServiceFilter.BytesTotal]?: ReportingServiceRange
  [ReportingServiceFilter.Category]?: number
  [ReportingServiceFilter.DatapointId]?: string
  [ReportingServiceFilter.Destination]?: string
  [ReportingServiceFilter.DestinationPort]?: ReportingServiceRange
  [ReportingServiceFilter.DestMatch]?: ReportingServiceFieldMatch
  [ReportingServiceFilter.EcoId]?: string
  [ReportingServiceFilter.EcoIds]?: string[]
  [ReportingServiceFilter.EndpointIds]?: string[]
  [ReportingServiceFilter.NetworkRoute]?: ReportingServiceNetworkRouteType
  [ReportingServiceFilter.PktsToClient]?: ReportingServiceRange
  [ReportingServiceFilter.PktsToServer]?: ReportingServiceRange
  [ReportingServiceFilter.RuleNameMatch]?: ReportingServiceFieldMatch
  [ReportingServiceFilter.SourceIp]?: string
  [ReportingServiceFilter.TlsVersion]?: string
  [ReportingServiceFilter.TsStart]?: ReportingServiceRange
  [ReportingServiceFilter.TsTerm]?: ReportingServiceRange

  [ReportingServiceFilterOperator.Or]?: ReportingServiceQueryFilters[]
  [ReportingServiceFilterOperator.Not]?: ReportingServiceQueryFilters
}

export interface ReportingServiceQueryVariables {
  field?: ReportingServiceField
  fieldCounters?: ReportingServiceField[]
  filter?: ReportingServiceQueryFilters
  fromDate?: string
  interval?: ReportingServiceInterval
  fromRecord?: number
  maxRecords?: number
  tenantId: string
  toDate?: string
  connectors?: string[]
  sort?: {
    bucketOrder?: ReportingServiceBucketField
    field?: ReportingServiceField
    order: ReportingServiceSortDirection
  }[]
}

export interface ReportingServiceCount {
  // key property stands for uniq identifier for field it can be ecoId, appName, timestamp etc.
  key: string
  count?: number
}

export interface ReportingServiceTrafficEntity {
  pkts_toserver?: number
  pkts_toclient?: number
  bytes_toclient?: number
  bytes_toserver?: number
  bytes_total?: number
}
export interface ReportingServiceFieldCount {
  field?: ReportingServiceField | `${ReportingServiceField}`
  count?: number
}

export interface ReportingServiceBucket extends ReportingServiceCount {
  traffic?: ReportingServiceTrafficEntity
  fieldCounts?: ReportingServiceFieldCount[]
  allowed?: number
  blocked?: number
  minTsStart?: string
  minTsTerm?: string
  maxTsStart?: string
  maxTsTerm?: string
}

export interface ReportingServiceUserInfo {
  ecoId?: string
  userName?: string
  displayName?: string
  firstName?: string
  lastName?: string
  email?: string
}
export interface ReportingServiceTraffic {
  //key stands for timestamp
  key?: string
  traffic: ReportingServiceTrafficEntity
}

export interface ReportingServiceDestinationsEntity {
  dest: string
  bytes: number
  connections: number
  users: number
}

export interface ReportingServiceAlertInfoMitre {
  tacticId: string
  tacticName: string
  techniqueId: string
  techniqueName: string
}

export interface ReportingServiceDnsTunneling {
  nameServer: string
  score: string
}

export interface ReportingServiceAlertInfo {
  alertType: ReportingServiceAlertType
  timeStamp?: string
  signature?: string
  category?: string
  mitre?: ReportingServiceAlertInfoMitre
  dnsTunneling?: ReportingServiceDnsTunneling
}

export interface ReportingServiceRuleInfo {
  requestType?: ReportingServiceAccessRequestType
  ruleId?: string
  ruleName?: string
  action?: ReportingServiceAlertAction
  timeStamp?: string
  risk?: number
}

export interface ReportingServiceTunnelEvent extends ReportingServiceUserInfo, ReportingServiceTrafficEntity {
  action?: ReportingServiceAlertAction | `${ReportingServiceAlertAction}`
  alerts?: ReportingServiceAlertInfo[]
  rules?: ReportingServiceRuleInfo[]
  anomaly?: boolean
  appName?: string
  appProto?: string
  bisScore?: number
  datapointId?: string
  destinationFqdn?: string
  destinationIp?: string
  destinationPort?: number
  dnsId?: number
  rrType?: string
  rrName?: string
  category?: number
  subCategory?: number
  policyId?: string
  policyName?: string
  policyType?: string
  proto?: string
  sourceIp?: string
  sourcePort?: number
  timeStamp?: string
  destination?: string
  networkRoute?: ReportingServiceNetworkRouteType | `${ReportingServiceNetworkRouteType}`
  flowId?: number
  endpointId?: string
  tsStart?: string
  tsTerm?: string
  appDest?: string
  subject?: string
  issuerdn?: string
  serial?: string
  sni?: string
  version?: string
  notafter?: string
  notbefore?: string
  server_alpn?: string[]
  client_alpn?: string[]
  deviceInfo?: {
    deviceId: string
    deviceModelName: string
    manufacturer: string
    osVersion: string
    platform: string
  }
}

export enum EgressHealthConnectorState {
  Online = 'Online',
  Offline = 'Offline',
}

export enum EgressHealthConnectorErrorType {
  InvalidToken = 'InvalidToken',
  TokenExpired = 'TokenExpired',
  InvalidRequest = 'InvalidRequest',
  InvalidUser = 'InvalidUser',
  InvalidIp = 'InvalidIp',
  InvalidConnector = 'InvalidConnector',
  InternalServerError = 'InternalServerError',
  ServerBusy = 'ServerBusy',
  OperationTimedOut = 'OperationTimedOut',
  UnknownError = 'UnknownError',
}

export interface EgressHealthConnectorStates {
  state: EgressHealthConnectorState | `${EgressHealthConnectorState}`
  ip?: string
  errType?: EgressHealthConnectorErrorType | `${EgressHealthConnectorErrorType}`
  startTimeStamp: string
  endTimeStamp: string
}

export interface EgressHealthConnectorEvent {
  id: string
  name?: string
  states: EgressHealthConnectorStates[]
}

export interface ReportingServiceResponse<TDataModel> {
  tenant: TDataModel
}

export interface ReportingServicePagination {
  totalHits?: number
  aggLimit?: number
  eventsLimit?: number
}

export interface ReportingServiceTunnelAggData extends ReportingServicePagination {
  field?: ReportingServiceField | `${ReportingServiceField}`
  buckets?: ReportingServiceBucket[]
  userInfo?: ReportingServiceUserInfo[]
}

interface ReportingServiceTunnelEventsData extends ReportingServicePagination {
  events: ReportingServiceTunnelEvent[]
}

export type ReportingServiceTunnelAggResponse = ReportingServiceResponse<{
  tunnelAgg?: ReportingServiceTunnelAggData
}>

export type ReportingServiceTunnelEventsResponse = ReportingServiceResponse<{
  tunnelEvents?: ReportingServiceTunnelEventsData
}>

export type ReportingServiceTunnelTimeAggResponse = ReportingServiceResponse<{
  tunnelTimeAgg?: ReportingServiceBucket[]
}>
