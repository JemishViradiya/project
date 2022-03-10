export interface IDeveloperCertificate {
  guid?: string
  name: string
  tenantGuid?: string
  type: string
  platform: string
  identifier: string
  subject?: string
  issuer?: string
  description?: string
  source: string
  created?: string
  fileName?: string
}

export enum DeveloperCertificateSourceType {
  Manual = 'MANUAL',
  AppFile = 'APP_FILE',
  CertFile = 'CERT_FILE',
  Uem = 'UEM',
  System = 'SYSTEM',
}

export default void 0
