export interface Connections {
  type: string
  activationType: string
  enableSetRiskLevel: boolean
  configuration: unknown
}

export interface Group {
  id: string
  displayName: string
}

export interface GroupResponse {
  pageHint: string
  groups: Group[]
}

export interface Error {
  subStatusCode: number
  message: unknown
  documentationUrl: string
}

export interface MultiStatus {
  status: number
  error: Error
}

export interface MultiStatusResponse {
  responses: MultiStatus[]
}

export interface Result {
  status: number
  error: Error
  request: unknown
  unConsentedConnectionDetails: ForbiddenResponse
}

export interface MultiStatusResult {
  results: Result[]
}

export interface UEMTenantList {
  uemTenantId: string
  isCloud: boolean
  version: string
  uemDisplayName: string
  tenantType: string
}

export interface UEMTenants {
  organizationId: string
  uemTenants: Array<UEMTenantList>
}

export interface PublicKeyInfo {
  type: string
  key: string
}

export interface ForbiddenResponse {
  connectionConfiguration: unknown
  clientId: string
  consentUrl: string
  redirectUrl: string
  publicKeyInfo: PublicKeyInfo
}

interface AppConfigSetting {
  configurationKey: string
  valueType: string
  configurationValue: string
}
export interface AppConfigPolicy {
  devicePlatform: string
  appConfigdisplayName: string
  description: string
  managedApp: {
    appName: string
    appId: string
  }
  configSettings: Array<AppConfigSetting>
  groups: {
    includedGroups: Array<string>
    excludedGroups: Array<string>
  }
  authCode: string
}

export interface AppConfigRequest {
  appConfigurationPolicyInformation: Array<AppConfigPolicy>
}
