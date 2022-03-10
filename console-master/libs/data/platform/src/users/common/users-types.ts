export interface User {
  id: string
  ecoId: string
  username: string
  displayName: string
  emailAddress: string
  firstName?: string
  lastName?: string
  tenantId?: string
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
  isAdminOnly?: boolean
}

export interface UserDevice {
  guid: string
  tenantId: string
  userId: string
  deviceInfo: {
    deviceId: string
    extDeviceId: string
    platform: string
    osVersion: string
    securityPatch: string
    deviceModelName: string
    deviceModelAlias: string
    manufacturer: string
  }
  appBundleId: string
  appVersion: string
  entitlementId: string
  created: string
  modified: string
  expires: string
  services?: Array<{
    serviceId: string
    status: 'ASSOCIATED' | 'DISASSOCIATED'
  }>
}

export interface PolicyAssignment {
  id?: number
  userId?: string
  entityId: string
  serviceId: string
  assigned?: boolean
  effective?: boolean
  override?: boolean
}
