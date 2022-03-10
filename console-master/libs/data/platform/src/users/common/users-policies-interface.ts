import type { EffectiveUsersPolicy, PagableResponse, Response } from '@ues-data/shared-types'

import type { PolicyAssignment } from './users-types'

export default interface UsersPolicyInterface {
  /**
   * Get user policies
   */
  getUserPolicies(userId: string): Response<PagableResponse<PolicyAssignment>>

  /**
   * Get user effective policy
   */
  getUserEffectivePolicy(userId: string, serviceId: string): Response<EffectiveUsersPolicy>

  /**
   * Assign policy to user
   */
  assignPolicies(userId: string, policies: PolicyAssignment[]): Promise<void>

  /**
   * Unassign policy from user
   */
  unassignPolicies(userId: string, policies: PolicyAssignment[]): Promise<void>
}
