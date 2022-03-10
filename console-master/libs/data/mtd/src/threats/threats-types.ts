export enum MobileThreatEventType {
  COMPROMISED_NETWORK = 'compromisedNetwork',
  INSECURE_WIFI = 'insecureWiFi',
  MALICIOUS_APP = 'maliciousApplication',
  SIDELOADED_APP = 'sideLoadedApplication',
  RESTRICTED_APP = 'restrictedApplication',
  JAILBROKEN_ROOTED = 'jailbrokenOrRooted',
  DEVICE_ENCRYPTION = 'deviceEncryption',
  DEVICE_SCREENLOCK = 'deviceScreenlock',
  UNSUPPORTED_OS = 'unsupportedOS',
  UNSUPPORTED_MODEL = 'unsupportedModel',
  UNSUPPORTED_SECURITY_PATCH = 'securityPatch',
  IOS_INTEGRITY_FAILURE = 'iOsIntegrityFailure',
  ANDROID_SAFETYNET_FAILURE = 'androidSafetyNetFailure',
  ANDROID_HW_FAILURE = 'androidHWFailure',
  UNRESPONSIVE_AGENT = 'unresponsiveAgent',
  DEVELOPER_MODE = 'developerMode',
  UNSAFE_MESSAGE = 'unsafeMessage',
}

export enum MobileThreatEventCategory {
  NETWORK = 'network',
  APPLICATION = 'application',
  SAFE_BROWSING = 'safeBrowsing',
  DEVICE_SECURITY = 'deviceSecurity',
}

export enum MobileThreatEventState {
  NEW = 'new',
  RESOLVED = 'resolved',
  IGNORED = 'ignored',
}

export enum QueryStringParamKeys {
  GROUP_BY = 'groupBy',
  DETECTED_START = 'detectedStart',
  DETECTED_END = 'detectedEnd',
  TYPE = 'type',
  STATUS = 'status',
  NAME = 'name',
  DESCRIPTION = 'description',
  DEVICE_NAME = 'deviceName',
  USER_NAME = 'userName',
  DEVICE_ID = 'deviceId',
  ENDPOINT_ID = 'endpointId',
  ECO_ID = 'ecoId',
}

export enum GroupBy {
  none = 'none',
  detection = 'detection',
  device = 'device',
}

export enum GroupByTime {
  ONE_HOUR = '1h',
  THREE_HOURS = '3h',
  SIX_HOURS = '6h',
  TWELVE_HOURS = '12h',
  ONE_DAY = '1d',
  ONE_WEEK = '7d',
  ONE_MONTH = '30d',
}

export enum ThreatResolution {
  CURRENT = 'current',
  PREVIOUS = 'previous',
  UNRESOVED = 'unresolved',
}

const CATEGORY_EVENTTYPE_MAP = [
  {
    category: MobileThreatEventCategory.NETWORK,
    eventTypes: [MobileThreatEventType.COMPROMISED_NETWORK, MobileThreatEventType.INSECURE_WIFI],
  },
  {
    category: MobileThreatEventCategory.APPLICATION,
    eventTypes: [
      MobileThreatEventType.MALICIOUS_APP,
      MobileThreatEventType.SIDELOADED_APP /*, MobileThreatEventType.RESTRICTED_APP*/,
    ],
  },
  {
    category: MobileThreatEventCategory.DEVICE_SECURITY,
    eventTypes: [
      MobileThreatEventType.JAILBROKEN_ROOTED,
      MobileThreatEventType.DEVICE_ENCRYPTION,
      MobileThreatEventType.DEVICE_SCREENLOCK,
      MobileThreatEventType.UNSUPPORTED_OS,
      MobileThreatEventType.UNSUPPORTED_MODEL,
      MobileThreatEventType.UNSUPPORTED_SECURITY_PATCH,
      MobileThreatEventType.IOS_INTEGRITY_FAILURE,
      MobileThreatEventType.ANDROID_SAFETYNET_FAILURE,
      MobileThreatEventType.ANDROID_HW_FAILURE,
      MobileThreatEventType.UNRESPONSIVE_AGENT,
      MobileThreatEventType.DEVELOPER_MODE,
    ],
  },
  {
    category: MobileThreatEventCategory.SAFE_BROWSING,
    eventTypes: [MobileThreatEventType.UNSAFE_MESSAGE],
  },
]

export function CATEGORY_TYPES(category: MobileThreatEventCategory): MobileThreatEventType[] {
  const categoryEntry = CATEGORY_EVENTTYPE_MAP.find(entry => entry.category === category)
  return categoryEntry ? categoryEntry.eventTypes : []
}

export function TYPE_CATEGORY(eventType: MobileThreatEventType): MobileThreatEventCategory {
  const eventTypeEntry = CATEGORY_EVENTTYPE_MAP.find(entry => entry.eventTypes.includes(eventType))
  return eventTypeEntry ? eventTypeEntry.category : null
}

const GROUPBYTIME_MAP = [
  { hours: 1, groupByTime: GroupByTime.ONE_HOUR },
  { hours: 3, groupByTime: GroupByTime.THREE_HOURS },
  { hours: 6, groupByTime: GroupByTime.SIX_HOURS },
  { hours: 12, groupByTime: GroupByTime.TWELVE_HOURS },
  { hours: 24, groupByTime: GroupByTime.ONE_DAY },
  { hours: 168, groupByTime: GroupByTime.ONE_WEEK },
  { hours: 720, groupByTime: GroupByTime.ONE_MONTH },
]

export function GROUPBY_HOURS(groupByTime: GroupByTime): number {
  return GROUPBYTIME_MAP.find(item => item.groupByTime === groupByTime).hours
}

export function HOURS_GROUPBY(hours: number): GroupByTime {
  return GROUPBYTIME_MAP.find(item => item.hours === hours).groupByTime
}

export interface MobileThreatEventTypeData {
  eventType: MobileThreatEventType
  value?: any
}

export interface GroupByCategoryMobileThreatData {
  category: MobileThreatEventCategory
  values: MobileThreatEventTypeData[]
}

export function GROUPBY_CATEGORY(data: MobileThreatEventTypeData[]): GroupByCategoryMobileThreatData[] {
  const result = []
  for (const entry of data) {
    const category = TYPE_CATEGORY(entry.eventType)
    const index = result.map(item => item.category).indexOf(category)
    if (index > -1) {
      result[index].values.push(entry)
    } else {
      result.push({ category: category, values: [entry] })
    }
  }

  return result
}

export type QueryId = MobileThreatEventCategory | MobileThreatEventType | ThreatResolution | 'all'

export interface MobileThreatEventQuery {
  queryId: QueryId
  startDateTime: string
  endDateTime: string
  eventTypes: MobileThreatEventType[]
  eventStates: MobileThreatEventState[]
  groupByTime?: GroupByTime
  cursor?: string
}

export interface MobileThreatEventQueryData {
  queries: MobileThreatEventQuery[]
  limit: number
}

export interface MobileThreatEventQueryEntry {
  query: MobileThreatEventQuery
  limit: number
}

export interface MobileThreatEventCount {
  queryId: QueryId
  count: number
}

export interface MobileThreatEventSeriesEntry {
  count: number
  startDateTime: string
  endDateTime?: string
}

export interface MobileThreatEventSeries {
  queryId: QueryId
  series: MobileThreatEventSeriesEntry[]
  cursor?: string
}

export interface MobileThreatEventDetail {
  eventDetail: string
  count: number
}

export interface MobileThreatDeviceDetail {
  deviceId: string
  userDisplayName: string
  deviceModelName: string
  count: number
  endpointIds: string[]
}

export interface EndpointCounts {
  endpointCount: number
  deviceCount: number
}

export interface EcsEntityResponse {
  totals: {
    elements: number
  }
}

export interface EnabledDeviceCount {
  mtdDeviceCount: number
  ecsDeviceCount: number
}
