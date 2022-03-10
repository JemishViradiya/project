import type { AbstractSession } from './base'

export interface VtxSession extends AbstractSession {
  userIdVenue: string
  tenantIdVenue: string
  shardId: number
  tenantDefaultsType: number
  clientId: string
  scopes: string[]
  accessTokenVenue: string
}
