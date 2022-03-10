import type { Workbox } from 'workbox-window'

/* eslint-disable sonarjs/no-duplicate-string */
import type { VenueSession as VenueSessionData } from '@ues-data/network'

import { fetchJson } from '../../lib/fetch'
import type { AsyncQuery } from '../../lib/statefulAsyncQuery'
import { NoPermissions, Permission } from '../../permissions/types'
import { VenueSessionUrl } from './network'
import type { VenueSession } from './types'

declare global {
  interface Window {
    workboxReady: Promise<Workbox>
  }
}

interface VenueQuery extends AsyncQuery<VenueSession, void> {
  url: string
  mockData: VenueSession
}

export const getVenueStorageAuthorization = () => {
  try {
    // or sessionStorage['venue-jwt-token']
    const token = JSON.parse(localStorage['venue-auth-token'])
    if (token) return `Bearer ${token}`
  } catch (error) {
    // ignore
  }
  return ''
}

const mockRole = {
  isCustom: false,
  name: 'administrator',
  rbac: {},
  roleId: '00000000-0000-0000-0000-000000000001',
  zoneids: [],
}

export const VenueSessionQuery: VenueQuery = {
  url: VenueSessionUrl,
  query: async function queryVenueSession(args?: void): Promise<VenueSession> {
    await window.workboxReady
    const json = await fetchJson<VenueSessionData>(VenueSessionUrl, {
      credentials: 'include',
      mode: 'same-origin',
      headers: {
        // disable token-session-check from venue jwt (UES-5845)
        // authorization: getVenueStorageAuthorization(),
      },
    })

    const {
      userIdVenue,
      tenantIdVenue,
      permissions,
      token: { role, scp },
    } = json
    const setOfPermissionString = new Set(permissions)
    const setOfPermissions = Object.entries(Permission)
      .map(([k1, k2]) => {
        return setOfPermissionString.has(k2) ? Permission[k1] : null
      })
      .filter(v => v != null)
    return {
      key: btoa(`${userIdVenue}:${tenantIdVenue}`),
      ...json,
      permissions: new Set(setOfPermissions),
      venueRbac: { role: role?.[0], scp },
    }
  },
  mockData: {
    key: btoa('ApmwUo70qa6ChqAEukLPM60=V10118177'),
    permissions: new Set<Permission>(Object.values(Permission)),
    venueRbac: {
      role: mockRole,
      scp: ['devicemanagement:read'],
    },
    userIdVenue: '43bf0cf4-f090-483d-b1c0-863b4efc52da',
    tenantIdVenue: 'b578caef-29a3-479f-ba64-8885576a88f1',
    loggedIn: true,
    shardId: 0,
    tenantDefaultsType: 0,
    tokenExpirationTime: Infinity,
    verificationTokenVenue: '',
    accessTokenVenue: '',
    token: {
      userid: '43bf0cf4-f090-483d-b1c0-863b4efc52da',
      tenantid: 'b578caef-29a3-479f-ba64-8885576a88f1',
      eecoid: 'ApmwUo70qa6ChqAEukLPM60=',
      shardid: 0,
      tenantdefaultstype: 0,
      exp: 0,
      iat: 0,
      iss: '',
      jti: '',
      nbf: 0,
      scp: ['devicemanagement:read'],
      userlogin: 'a@b.c',
      role: [mockRole],
    },
  },
  mockQueryFn: async function queryMockVenueSession(args?: void): Promise<VenueSession> {
    await window.workboxReady
    return VenueSessionQuery.mockData
  },
  permissions: NoPermissions,
}
