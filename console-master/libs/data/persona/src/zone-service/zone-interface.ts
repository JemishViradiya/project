import type { Response } from '@ues-data/shared-types'

import type { ShortZoneDetails } from './zones-types'

export default interface ZoneInterface {
  /**
   * Get zones by zone name
   * @param  {string} zoneName
   */
  getZonesByName(zoneName: string): Response<ShortZoneDetails[]>

  /**
   * Add users to specific zone
   * @param  {string} zoneId
   * @param  {string[]} userIds
   */
  addUsersToZone(zoneId: string, userIds: string[]): Response

  /**
   * Delete users from specific zone
   * @param  {string} zoneId
   * @param  {string[]} userIds
   */
  removeUsersFromZone(zoneId: string, userIds: string[]): Response
}
