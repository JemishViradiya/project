export type SyncType = 'USERS_AND_GROUPS' | 'GROUPS_ONBOARDING' | 'GROUPS_DLG' | 'USER_ATTRIBUTES'
export type SyncIterations = 'INTERVAL' | 'DAILY' | 'ONCE'

export interface DirectoryUser {
  country: string
  displayName: string
  state: string
  dataSourceUserId: string
  firstName: string
  lastName: string
  emailAddress: string
  title: string
  department: string
  company: string
  street: string
  poBox: string
  city: string
  postalCode: string
  dataSourceConnectionId: string
  accountForestDataSourceDn: string
  domain: string
  picture: string
  dataSource: string
  username: string
  mobilePhoneNumber: string
  companyPhoneNumber: string
  homePhoneNumber: string
  directoryuserdn: string
  directoryuserpn: string
}
export const DirectoryUser = void 0
export interface DirectoryInstanceSyncSchedule {
  runOnWednesday?: boolean
  runOnMonday?: boolean
  runOnTuesday?: boolean
  runOnSaturday?: boolean
  runOnThursday?: boolean
  runOnSunday?: boolean
  type?: SyncType
  runOnFriday?: boolean
  iterations?: SyncIterations
  startTimeOfDay?: number | Date
  endTimeOfDay?: number | Date
  callbackFreq?: number
  schedulerId?: number
  status?: string
}
export const DirectoryInstanceSyncSchedule = void 0
export interface DirectoryInstance {
  id: string
  id_tenant?: string
  directory_group?: string
  directorySyncSchedules: DirectoryInstanceSyncSchedule[]
  azureDirectoryClientKey?: string
  syncEnableOffboarding: boolean
  azureDirectoryDomain?: string
  syncForce: boolean
  type: string
  azureDirectory?: boolean
  syncMaxChanges: number
  syncEnableOffboardingProtection: boolean
  instanceOnlineStatus: boolean
  syncMaxNesting: number
  name: string
  azureDirectoryClientId?: string
  syncEnableOnboarding: boolean
  instanceEnabledStatus?: boolean
  zedDirectory?: boolean
}
export const DirectoryInstance = void 0
export interface DirectoryGroup {
  name: string
  dataSourceConnectionId: string
  directorySourceName: string
  groupDistinguishedName: string
  dataSourceGroupId: string
}

export interface SyncState {
  syncId: string
  directoryInstanceId: string
  syncType: SyncType
  isPreview: boolean
  isScheduled: boolean
  syncState: 'CANCELED' | 'FAILED' | 'RUNNING' | 'SUCCEEDED'
  syncStart: string
  syncEnd: string
  directoryInstanceConfiguration: string
}
