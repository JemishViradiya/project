import type { LauncherSession as LauncherSessionData } from '@ues-data/network'

import type { AbstractUesSession, UesSessionProviderData } from '../types'

/** Session Types */

export interface LauncherSession extends AbstractUesSession, Omit<LauncherSessionData, 'scopes' | 'permissions'> {
  key: string
  scopes: Set<string>
}

export type LauncherSessionProviderData = UesSessionProviderData<LauncherSession>

/**************/
/** API Types */

export type Service = {
  name: string
  url: string
  icon: string
  id: string
}

export type Tenant = {
  id: string
  name: string
  services: Array<Service>
  isReachable?: boolean
  isCloud: boolean
}

export type GenericResponse<R> =
  | {
      type: 'success'
      value: R
    }
  | {
      type: 'error'
      value: Error
    }

export type OpaqueResponse = {
  type: 'opaque' | 'error'
}

/** GET /api/landing?userId */

export type Organization = {
  orgId: string
  orgName?: string
}

export type DisplayedOrganization = Organization & { orgUrl: string }

export type Landing = DisplayedOrganization & {
  email: string
  tenants: Array<Tenant> | null
  userId: string
  orgIcon: string
  orgs?: Array<Organization>
}

export type UserInfo = {
  email: string
  family_name?: string
  given_name?: string
  name: string
  preferred_username: string
  sub: string
  username: string
  usersource: string
  tenant: string
  orgid?: string
}
