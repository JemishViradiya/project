//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

export enum ConnectorHealth {
  Green = 'GREEN',
  Yellow = 'YELLOW',
  Red = 'RED',
}

export type ConnectorHealthStatus = {
  connectorId?: string
  ingressName?: string
  tunnel?: boolean
  DNS?: boolean
  testPage?: number
}

export type AuthPublicKey = {
  kty: string
  kid: string
  crv: string
  x: string
  y: string
}

export enum EnrollmentIncompleteReason {
  Pending = 'pending',
  Expired = 'expired',
}

interface EnrolledType {
  value: boolean
  enrollmentIncompleteReason?: EnrollmentIncompleteReason | `${EnrollmentIncompleteReason}`
}

export type ConnectorCreateInfo = {
  connectorId: string
  serviceApiGatewayUrl: string
}

export type ConnectorConfigInfo = {
  connectorId: string
  name: string
  authPublicKey: AuthPublicKey
  newAuthPublicKey?: AuthPublicKey
  upgradeAvailable: boolean
  maintenanceRequired: boolean
  privateUrl: string
  health: { health: ConnectorHealth | `${ConnectorHealth}` }
  healthStatus: ConnectorHealthStatus[]
  enrolled: EnrolledType
}
