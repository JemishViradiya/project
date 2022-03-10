import type { Workbox } from 'workbox-window'

/* eslint-disable sonarjs/no-duplicate-string */
import type { LauncherSession as LauncherSessionData } from '@ues-data/network'

import { fetchJson } from '../../lib/fetch'
import type { AsyncQuery } from '../../lib/statefulAsyncQuery'
import { NoPermissions, Permission } from '../../permissions/types'
import type { BaseQuery, BaseQueryArgs } from '../types'
import { LauncherPwaSessionUrl, PORTAL_URL } from './network'
import checkTenantsReachability from './TenantReachability'
import type { Landing, LauncherSession, UserInfo } from './types'

declare global {
  interface Window {
    workboxReady: Promise<Workbox>
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const selectContext = (json: LauncherSessionData): LauncherSession => {
  const { userId, tenantId, scopes = [], permissions = [], venueRbac } = json
  const setOfPermissionString = new Set(permissions)
  const setOfPermissions = Object.entries(Permission)
    .map(([k1, k2]) => {
      return setOfPermissionString.has(k2) ? Permission[k1] : null
    })
    .filter(v => v != null)

  // const { access_token = undefined, scope = '', entitlements = '' } = oidcTokens ? JSON.parse(oidcTokens) : {}
  return {
    key: btoa(`${userId}${tenantId}`),
    ...json,
    scopes: new Set<string>(scopes),
    permissions: new Set<Permission>(setOfPermissions),
    venueRbac,
  }
}

export const LauncherSessionQuery: BaseQuery<LauncherSession> & { mockData: LauncherSession } = {
  url: LauncherPwaSessionUrl,
  query: async function queryConsoleContext(args?: BaseQueryArgs): Promise<LauncherSession> {
    await window.workboxReady
    const json = await fetchJson<LauncherSessionData>(LauncherPwaSessionUrl, {
      credentials: 'include',
      mode: 'cors',
    })
    return selectContext(json)
  },
  mockData: {
    key: btoa('ApmwUo70qa6ChqAEukLPM60=V10118177'),
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
    loggedIn: true,
    tokenExpirationTime: new Date('2021-01-05T19:03:30.000+00:00').valueOf(),
    scopes: new Set<string>(),
    accessToken:
      'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkNJMHVaWE53dWV2UzQyS2ZMejN1clJRblpCQVdLV3RyVGpyeWxhMkQ4UDAifQ.eyJ0ZW5hbnQiOiJ2MTAxMTgxNzciLCJqdGkiOiJ5bjF1fm0xRlpCRHV6OEFJcEdBbzQiLCJzdWIiOiJBcG13VW83MHFhNkNocUFFdWtMUE02MD0iLCJpc3MiOiJodHRwczovL2lkcC1kZXYuZXZhbC5ibGFja2JlcnJ5LmNvbS9vcCIsImlhdCI6MTYwOTg2NjIxMCwiZXhwIjoxNjA5ODY5ODEwLCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIHVzZXJzb3VyY2UgVUVTOlJvbGUuUmVhZFdyaXRlLlRlbmFudCIsImF1ZCI6WyJodHRwczovL3N0YWdpbmcuY3MubGFicy5ibGFja2JlcnJ5LmNvbSJdLCJhenAiOiJjZjRkOGIxYy1kMGE1LTQxNzEtODcxZi0yZjE1ZTZmODk0NmYiLCJjbGllbnRfaWQiOiJjZjRkOGIxYy1kMGE1LTQxNzEtODcxZi0yZjE1ZTZmODk0NmYifQ.vmYQaPNqZfZzBGPxQsOAV3KqLfmyJZcr1Zs_h-iJPYo7mBbZuFrSZiJJfLcmWK1xaSUY_cMcowfXAWAtfKUY0g',
    idToken:
      'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkNJMHVaWE53dWV2UzQyS2ZMejN1clJRblpCQVdLV3RyVGpyeWxhMkQ4UDAifQ.eyJzdWIiOiJBcG13VW83MHFhNkNocUFFdWtMUE02MD0iLCJ0ZW5hbnQiOiJ2MTAxMTgxNzciLCJub25jZSI6InNxX2FGeVRleXA1UUlHNmUwVEstdTYzOFYtSHk2a29pcUFHRWp3ZURQMlEiLCJhdF9oYXNoIjoiNEZZYjJPU2FVOF9HTzk3U29kd2xMZyIsInNpZCI6ImQ4ZGQ0MDlmLTNiZDktNGFmOC1hZTU3LTczMWFmZjUzNjI1ZiIsImF1ZCI6ImNmNGQ4YjFjLWQwYTUtNDE3MS04NzFmLTJmMTVlNmY4OTQ2ZiIsImV4cCI6MTYwOTg3MzQxMCwiaWF0IjoxNjA5ODY2MjEwLCJpc3MiOiJodHRwczovL2lkcC1kZXYuZXZhbC5ibGFja2JlcnJ5LmNvbS9vcCJ9.g-h91F5gAFfe__pwEwA5VGPKrg9gUHGjBQU-w2gxatQaahZQFKjCGrvBgiWf3buTMpSCxuQg8IO4Az-i4ka4Hw',
  },
  mockQueryFn: async function queryMockConsoleContext(args?: BaseQueryArgs): Promise<LauncherSession> {
    await window.workboxReady
    return LauncherSessionQuery.mockData
  },
  permissions: NoPermissions,
}

export const LauncherMyUserQuery: AsyncQuery<UserInfo, void> = {
  query: async function queryConsoleContext(args?: void): Promise<UserInfo> {
    await window.workboxReady
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { userInfo = undefined } = await fetchJson<LauncherSession>(LauncherPwaSessionUrl, {
        credentials: 'include',
        mode: 'no-cors',
      })
      if (!userInfo) {
        throw new Error('Not Found')
      }
      return JSON.parse(userInfo) as UserInfo
    } catch (error) {
      if (error.message === 'Not Found' || error.code === 404) {
        return null as UserInfo
      }
      throw error
    }
  },
  mockQueryFn: async function queryMockConsoleContext(args?: void): Promise<UserInfo> {
    await window.workboxReady
    return {
      sub: 'ApmwUo70qa6ChqAEukLPM60=',
      name: 'uesdev@ahem.sw.rim.net',
      usersource: 'CUR',
      preferred_username: 'uesdev@ahem.sw.rim.net',
      given_name: 'Ues',
      family_name: 'Developer',
      tenant: 'v10118177',
      email: 'uesdev@ahem.sw.rim.net',
      orgid: '6264511993',
      username: 'uesdev@ahem.sw.rim.net',
    }
  },
  permissions: NoPermissions,
}

export const LauncherLandingQuery = {
  query: async function queryConsoleLandingInfo({ userId }: { userId: string }): Promise<Landing> {
    const info = await fetchJson<Landing>(`${PORTAL_URL}/api/console/landing?userId=${encodeURI(userId)}`, {
      credentials: 'include',
      mode: 'cors',
    })
    const { tenants = [] } = info
    await checkTenantsReachability(tenants)
    return info
  },
  mockQueryFn: async function queryMockConsoleLandingInfo({ userId }: { userId: string }): Promise<Landing> {
    return {
      email: 'uesdev@ahem.sw.rim.net',
      tenants: [],
      userId: 'ApmwUo70qa6ChqAEukLPM60=',
      orgId: '6264511993',
      orgUrl: '',
      orgIcon: '',
      orgs: [],
    }
  },
}
