//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

export interface ReconciliationQueryParams {
  max?: number
  offset?: number
  query?: Partial<ReconciliationEntity>
  sortBy?: string
}

export interface ReconciliationEntityId {
  entityId: string
}

export enum ReconciliationEntityType {
  BisPolicy = 'BisPolicy',
  BISActionPolicy = 'BisActionPolicy',
  BISDetectionPolicy = 'BisDetectionPolicy',
  EID = 'policy',
  ENROLLMENT = 'ENROLLMENT',
  GatewayApp = 'GatewayApp',
  MTD = 'MTD',
  NetworkAccessControl = 'NetworkAccessControl',
}

export interface ReconciliationEntity {
  serviceId: string
  entityType: ReconciliationEntityType | `${ReconciliationEntityType}`
  entityId: string
  name: string
  description: string
  rank: number
  created?: string
  updated?: string
}

export interface ReconciliationEntityDefinition {
  serviceId: string
  tenantId: string
  entityType: string
  reconciliationType: 'RANKING' | 'CUMULATIVE'
  permissionPrefix?: string
  created?: string
}

export interface RecoEntityRankView {
  entityId: string
  rank: number
}
export interface UsersAndGroupsAssignment {
  userIds: string[]
  groupIds: string[]
}

export interface EffectiveEntityDetails {
  appliedVia: string
  description: string
  entityId: string
  name: string
}
export interface EffectiveEntities {
  entityIds: string[]
  entityType: string
  details: EffectiveEntityDetails[]
}
export interface EffectiveUsersPolicy {
  effectiveEntities: EffectiveEntities[]
  serviceId: string
  userId: string
}
