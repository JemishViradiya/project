export enum ServiceId {
  BIG = 'big.blackberry.com',
  BIS = 'sis.blackberry.com',
  ECM = 'com.blackberry.ecs.ecm',
  EID = 'com.blackberry.eid',
  MTD = 'com.blackberry.mtd',
  DLP = 'com.blackberry.dlp',
}

export enum ServiceStatusType {
  Associating = 'ASSOCIATING',
  Associated = 'ASSOCIATED',
  Disassociating = 'DISASSOCIATING',
  Disassociated = 'DISASSOCIATED',
  Error = 'ERROR',
}

export type Service = {
  name: ServiceId
  status: ServiceStatusType
}

export interface ServicesState {
  services?: Service[]
  overrides?: Service[]
  loaded?: boolean
  initializationPromise?: Promise<void>
}

export interface TenantServiceEntity {
  serviceId: ServiceId
  serviceStatus: ServiceStatusType
}

export const MAX_SERVICE_ID = 100
