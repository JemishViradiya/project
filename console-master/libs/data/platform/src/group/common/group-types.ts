import type { ReconciliationEntity, ReconciliationEntityDefinition } from '@ues-data/shared'

export interface Group {
  id?: string
  name: string
  description?: string
  dataSourceConnectionId?: string
  dataSourceName?: string
  dataSourceGroupId?: string
  isDirectoryGroup?: boolean
  isNestingEnabled?: boolean
  isOnboardingEnabled?: boolean
  relationships?: { users: { count: number } }
}

export interface ProfileGroupAssignment {
  serviceId: string
  entityId: string
}

export interface GroupUser {
  id: string
  ecoId: string
  username: string
  displayName: string
  emailAddress: string
}

export interface PolicyTypeWithEntities extends ReconciliationEntityDefinition {
  policies: ReconciliationEntity[]
}
