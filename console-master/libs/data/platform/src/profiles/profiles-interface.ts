import type { Response } from '@ues-data/shared'

import type { ActivationProfile } from './profiles-types'

export default interface ActivationProfilesInterface {
  /**
   * Creates a new policy for this tenant
   * @param connectorConfig The initial policy data
   */
  create(data: ActivationProfile): Response<ActivationProfile>

  /**
   * Get the policy data
   * @param entityId The entity id
   */
  readOne(entityId: string): Response<ActivationProfile>

  /**
   * Updates the policy
   * @param entityId The entity id
   * @param data The updated entity data
   */
  update(entityId: string, data: Partial<ActivationProfile>): Response<ActivationProfile>

  /**
   * Deletes the policy
   * @param entityId The entity id
   */
  remove(entityId: string): Promise<void>

  /**
   * Deletes multiple policies
   * @param entityIds Profile ids
   */
  removeMultiple(entityIds: string[]): Promise<void>
}
