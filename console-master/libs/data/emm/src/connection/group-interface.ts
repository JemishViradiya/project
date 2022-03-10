import type { Response } from '@ues-data/shared'

import type { GroupResponse } from './connection-types'

interface GroupInterface {
  /**
   * Get all groups
   */
  getGroups(emmType: string, searchQuery: string): Response<GroupResponse>
}

export default GroupInterface
