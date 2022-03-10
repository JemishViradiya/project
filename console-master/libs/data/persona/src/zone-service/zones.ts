import type { Response } from '@ues-data/shared-types'

import { axiosInstance, personaUsersBaseUrl } from '../config.rest'
import type { ShortZoneDetails } from '.'
import type ZoneInterface from './zone-interface'

class ZonesClass implements ZoneInterface {
  getZonesByName(zoneName: string): Response<ShortZoneDetails[]> {
    return axiosInstance().get(`${personaUsersBaseUrl}/zones`, { params: { zoneName } })
  }
  addUsersToZone(zoneId: string, userIds: string[]): Response<unknown> {
    return axiosInstance().put(`${personaUsersBaseUrl}/zones/${zoneId}`, { params: { user_ids: userIds } })
  }
  removeUsersFromZone(zoneId: string, userIds: string[]): Response<unknown> {
    return axiosInstance().delete(`${personaUsersBaseUrl}/zones/${zoneId}`, { params: { user_ids: userIds } })
  }
}

const ZonesApi = new ZonesClass()

export { ZonesApi }
