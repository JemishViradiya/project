import type { Workbox } from 'workbox-window'

/* eslint-disable sonarjs/no-duplicate-string */
import type { VtxSession as VtxSessionData } from '@ues-data/network'

import { fetchJson } from '../../lib/fetch'
import { NoPermissions, Permission } from '../../permissions/types'
import type { BaseQuery, BaseQueryArgs } from '../types'
// import { getVenueStorageAuthorization } from '../venue/query'
import { VtxPwaSessionUrl } from './network'
import type { VtxSession } from './types'

declare global {
  interface Window {
    workbox?: Workbox
    workboxReady: Promise<Workbox>
  }
}

interface VtxQuery extends BaseQuery<VtxSession> {
  mockData: VtxSession
}

export const VtxSessionQuery: VtxQuery = {
  url: VtxPwaSessionUrl,
  query: async function queryVtxSession(args?: BaseQueryArgs): Promise<VtxSession> {
    await window.workboxReady
    const json = await fetchJson<VtxSessionData>(VtxPwaSessionUrl, {
      credentials: 'include',
      mode: 'same-origin',
      headers: {
        // disable token-session-check from venue jwt (UES-5845)
        // authorization: getVenueStorageAuthorization(),
        ...(args.refresh ? { 'cache-control': 'no-cache' } : {}),
      },
    })
    const { key, userId, tenantId, scopes = [], permissions = [], venueRbac } = json
    const setOfPermissionString = new Set(permissions)
    const setOfPermissions = Object.entries(Permission)
      .map(([k1, k2]) => {
        return setOfPermissionString.has(k2) ? Permission[k1] : null
      })
      .filter(v => v != null)
    return {
      key: key || btoa(`${userId}${tenantId}`),
      ...json,
      permissions: new Set(setOfPermissions),
      scopes: new Set(scopes),
      venueRbac,
    }
  },
  mockData: {
    key: btoa('ApmwUo70qa6ChqAEukLPM60=V10118177'),
    accessToken: '',
    accessTokenVenue: '',
    permissions: new Set<Permission>(Object.values(Permission)),
    venueRbac: {
      role: {
        isCustom: false,
        name: 'administrator',
        rbac: {},
        roleId: '00000000-0000-0000-0000-000000000001',
        zoneids: [],
      },
      scp: ['devicemanagement:read'],
    },
    userId: 'ApmwUo70qa6ChqAEukLPM60=',
    userIdVenue: '43bf0cf4-f090-483d-b1c0-863b4efc52da',
    tenantId: 'V10118177',
    tenantIdVenue: 'b578caef-29a3-479f-ba64-8885576a88f1',
    clientId: '5696e4c1-1075-4302-a161-d1740bac8d1d',
    scopes: new Set<string>(),
    loggedIn: true,
    shardId: 0,
    tenantDefaultsType: 0,
    tokenExpirationTime: Infinity,
  },
  mockQueryFn: async function queryMockVenueSession(args?: BaseQueryArgs): Promise<VtxSession> {
    await window.workboxReady
    return VtxSessionQuery.mockData
  },
  permissions: NoPermissions,
}
