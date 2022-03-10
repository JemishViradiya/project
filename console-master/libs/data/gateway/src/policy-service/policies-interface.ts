//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import type { ReconciliationEntityId, ReconciliationEntityType, Response } from '@ues-data/shared'

import type { Policy } from './policies-types'

export default interface PoliciesInterface {
  /**
   * Creates a new policy for this tenant
   * @param tenantId The tenant id of the customer
   * @param data The initial policy data
   */
  create(tenantId: string, data: Policy): Response<ReconciliationEntityId>

  /**
   * Get the policy data
   * @param tenantId The tenant id of the customer
   * @param entityId The entity id
   * * @param entityType The entity type
   */
  readOne(tenantId: string, entityId: string, entityType: ReconciliationEntityType): Response<Policy>

  /**
   * Updates the policy
   * @param tenantId The tenant id of the customer
   * @param entityId The entity id
   * @param data The updated entity data
   */
  update(tenantId: string, entityId: string, data: Partial<Policy>): Response

  /**
   * Deletes the policy
   * @param tenantId The tenant id of the customer
   * @param entityId The entity id
   */
  remove(tenantId: string, entityId: string): Response

  /**
   * Deletes the policies
   * @param tenantId The tenant id of the customer
   * @param entityIds The entity ids
   */
  removeMany(tenantId: string, entityIds: string[]): Response
}
