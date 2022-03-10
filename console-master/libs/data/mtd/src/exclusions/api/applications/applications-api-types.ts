export interface IAppInfo {
  guid?: string
  name: string
  tenantGuid?: string
  type?: string
  platform: string
  hash: string
  vendorName?: string
  version: string
  versionCode?: string
  description?: string
  source: string
  created?: string
  fileName?: string
}

export enum AppInfoSourceType {
  Manual = 'MANUAL',
  AppFile = 'APP_FILE',
  CertFile = 'CERT_FILE',
  Uem = 'UEM',
  System = 'SYSTEM',
}

export default void 0
