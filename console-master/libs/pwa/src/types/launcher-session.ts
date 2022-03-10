import type { AbstractSession } from './base'

export interface LauncherSession extends AbstractSession {
  clientId?: string
  orgId?: string
  region?: string
  scopes: string[]
}

export interface LauncherContextSession {
  userId: string
  tenantId: string
  email: string
  orgId: string
  name: string
  loggedIn: true
  tokenExpirationTime: string
  sid: string
  userInfo: string
  userSource: string
  oidcTokens: string
}

export interface LauncherContextNoSession extends Partial<Omit<LauncherContextSession, 'loggedIn'>> {
  loggedIn: false
}
