export interface PlatformPagedView<T> {
  totals: {
    pages: number
    elements: number
  }
  navigation: {
    previous: string
    next: string
  }
  count: number
  elements: T[]
}

export interface ServerSideSelectionModel {
  query?: string
  allSelected: boolean
  selected: Array<string>
}

export interface DeleteResponse {
  success: string[]
  failed?: { subStatusCode: number; message: string; id: string }[]
}
export interface PlatformUser {
  id: string
  ecoId: string
  created?: Date
  updated?: Date
  tenantId?: string
  username: string
  displayName: string
  firstName?: string
  lastName?: string
  emailAddress?: string
  dataSource?: 'active_directory' | 'cur' | 'ldap' | 'azure'
  dataSourceConnectionId?: string
  dataSourceUserId?: string
  title?: string
  department?: string
  company?: string
  alias?: string
  homePhoneNumber?: string
  mobilePhoneNumber?: string
  companyPhoneNumber?: string
  street?: string
  poBox?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  domain?: string
  adSid?: string
  suppressEmail?: boolean
  services?: Array<{
    id: string
    status: 'ASSOCIATED' | 'ASSOCIATING'
    created: Date
    updated: Date
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attributes?: Record<string, any>
    enabledFeatures?: string[]
  }>
}

export interface UserInfoAggregated {
  tenantId: string
  userId: string
  username: string
  displayName: string
  emailAddress: string
  dataSource: string
  expiry?: string
  status?: string
  devices: number
}

export interface PlatformUsers {
  elements: PlatformUser[]
}
