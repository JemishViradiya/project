import type { Response } from '@ues-data/shared-types'

import type { ShortZoneDetails } from '.'
import type ZoneInterface from './zone-interface'
import { ZonesResponseMock } from './zones-mock.data'

class ZonesMockClass implements ZoneInterface {
  getZonesByName(zoneName: string): Response<ShortZoneDetails[]> {
    console.log('ZonesMockApi -> getZonesByName', { zoneName })
    return Promise.resolve({ data: ZonesResponseMock })
  }
  addUsersToZone(zoneId: string, userIds: string[]): Response<unknown> {
    console.log('ZonesMockApi -> addUsersToZone', { params: { zoneId, user_ids: userIds } })
    return Promise.resolve({ data: '' })
  }
  removeUsersFromZone(zoneId: string, userIds: string[]): Response<unknown> {
    console.log('ZonesMockApi -> removeUsersFromZone', { params: { zoneId, user_ids: userIds } })
    return Promise.resolve({ data: '' })
  }
}

const ZonesMockApi = new ZonesMockClass()

export { ZonesMockApi }
