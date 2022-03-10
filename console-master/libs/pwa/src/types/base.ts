import type { VenueRbac } from './venue-session'

export interface AbstractSession {
  loggedIn: boolean
  userId: string
  actor?: string
  tenantId: string
  permissions: string[]
  venueRbac: VenueRbac
  tokenExpirationTime: number
  accessToken: string
  accessTokenVenue?: string
  idToken?: string
  email?: string
  key: string
  error?: Error & { status?: number }
}

export interface EidJwtToken {
  tenant: string
  jti: string
  sub: string
  iss: string
  iat: number
  exp: number
  scope: string
  entitlements: string[]
  aud: string[]
  azp: string
  client_id: string
  act?: { format: string; email: string }
}

export const EXCHANGE_STATE_REQUEST = 'exchange-state-request'
export const EXCHANGE_STATE_RESPONSE = 'exchange-state-response'
export const EXCHANGE_STATE_COMPLETED = 'exchange-state-completed'
