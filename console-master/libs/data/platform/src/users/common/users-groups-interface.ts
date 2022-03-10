import type { PagableResponse, Response } from '@ues-data/shared-types'

import type { Group } from '../../group/common/group-types'

export default interface UsersGroupInterface {
  /**
   * Get user groups
   */
  getUserGroups(userId: string): Response<Group[]>
  /**
   * Assign groups to user
   */
  addUserToGroups(userId: string, groups: Group[]): Promise<void>

  /**
   * Unassign groups from user
   */
  removeUserFromGroup(userId: string, groupId: string): Promise<void>
}
