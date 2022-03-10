import type { PagableResponse, Response } from '@ues-data/shared-types'

import type { Group, GroupUser, ProfileGroupAssignment } from './group-types'

export default interface GroupsInterface {
  getGroups(query?: string, sortBy?: string, offset?: number, max?: number): Response<PagableResponse<Group>>
  /**
   * Remove group by id
   * @param id group id
   */
  remove(id: string): Promise<void>

  /**
   * Create group
   * @param group data
   */
  create(group: Group): Response<Group>

  /**
   * Update group
   * @param group data
   */
  update(group: Group): Response<Group>

  /**
   * Assign policies to group
   * @param groupId
   * @param assignments
   */
  assignPolicies(groupId: string, assignments: ProfileGroupAssignment[])

  /**
   * Unassign policies to group
   * @param groupId
   * @param assignments
   */
  unassignPolicies(groupId: string, assignments: ProfileGroupAssignment[])

  /**
   * Get assigned users
   * @param groupId
   */
  getGroupUsers(
    groupId: string,
    query?: string,
    sortBy?: string,
    offset?: number,
    max?: number,
  ): Response<PagableResponse<GroupUser>>

  /**
   * Add users to group
   * @param groupId
   * @param users
   */
  addUsers(groupId: string, users: GroupUser[])

  /**
   * Remove users from group
   * @param groupId
   * @param users
   */
  removeUsers(groupId: string, users: GroupUser[])
}
