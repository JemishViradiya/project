import type { Workbox } from 'workbox-window'

/* eslint-disable sonarjs/no-duplicate-string */
import type { SmgrSession as SmgrSessionData } from '@ues-data/network'

import { fetchJson } from '../../lib/fetch'
import { NoPermissions, Permission } from '../../permissions/types'
import type { BaseQuery, BaseQueryArgs } from '../types'
import { SessionMgrPwaUrl } from './network'
import type { SmgrSession } from './types'

declare global {
  interface Window {
    workbox?: Workbox
    workboxReady: Promise<Workbox>
  }
}

interface SessionMgrQueryInterface extends BaseQuery<SmgrSession> {
  mockData: SmgrSession
}

export const SessionMgrQuery: SessionMgrQueryInterface = {
  url: SessionMgrPwaUrl,
  query: async function querySession(args?: BaseQueryArgs): Promise<SmgrSession> {
    await window.workboxReady
    const json = await fetchJson<SmgrSessionData>(SessionMgrPwaUrl, {
      credentials: 'include',
      mode: 'same-origin',
      headers: {
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
    tenantId: 'V10118177',
    clientId: '5696e4c1-1075-4302-a161-d1740bac8d1d',
    scopes: new Set<string>(),
    loggedIn: true,
    tokenExpirationTime: Infinity,
    idToken: '',
  },
  mockQueryFn: async function queryMockSession(args?: BaseQueryArgs): Promise<SmgrSession> {
    await window.workboxReady
    return SessionMgrQuery.mockData
  },
  permissions: NoPermissions,
}
