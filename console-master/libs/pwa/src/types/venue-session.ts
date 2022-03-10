import type { AbstractSession } from '../types/base'

export interface Role {
  isCustom: boolean
  name: string
  rbac: Record<string, unknown>
  roleId: string
  zoneids: string[]
}

export interface VenueToken {
  tenantid: string
  userlogin: string
  userid: string
  ghostusername?: string
  tenantdefaultstype: number
  shardid: number
  scp: string[]
  role: Role[]
  jti: string
  iat: number
  nbf: number
  exp: number
  iss: string
  eecoid: string | null
}

export interface VenueSession extends Omit<AbstractSession, 'userId' | 'tenantId' | 'accessToken' | 'idToken'> {
  userId?: string
  userIdVenue: string
  tenantIdVenue: string
  shardId: number
  tenantDefaultsType: number
  accessTokenVenue: string
  verificationTokenVenue: string
  token: VenueToken
}

export interface VenueRbac {
  role: Role
  scp: string[]
}
