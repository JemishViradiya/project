//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { PagableResponse, Response } from '@ues-data/shared-types'

import type { PageableSortableQueryParams } from '../types'
import type { Policy, POLICY_TYPE, PolicyValue } from './policies-types'

export default interface PoliciesInterface {
  /**
   * Creates a new policy for this tenant
   * @param policy The initial policy
   */
  create(policy: Policy): Response<Partial<Policy> | Policy>

  /**
   * Get the policy data
   * @param policyId The policy id
   */
  read(policyId: string): Response<Partial<Policy> | Policy>

  /**
   * Get all policies by POLICY_TYPE
   */
  readAll(
    policyType: POLICY_TYPE,
    params?: PageableSortableQueryParams<Policy>,
  ): Response<Partial<PagableResponse<Policy>> | PagableResponse<Policy>>

  /**
   * Get pageable policies by guids
   * @param guidList The policies guids
   */
  readAllByGuids(
    guidList: string[],
    params?: PageableSortableQueryParams<Policy>,
  ): Response<Partial<PagableResponse<Policy>> | PagableResponse<Policy>>

  /**
   * Updates the policy data in the Tenant Service
   * @param policy The updated policy data
   */
  update(policy: Partial<Policy>): Response<Partial<Policy> | Policy>

  /**
   * Deletes the policy data in the Tenant Service
   * @param policyId The policy id
   */
  remove(policyId: string): Response

  /**
   * Gets policy setting definition for policy type
   * @param type The policy type
   */
  getPolicySettingDefinition(type: POLICY_TYPE): Response<PolicyValue | Partial<PolicyValue>>

  /**
   * Gets default policy for policy type
   * @param type The policy type
   */
  getDefaultPolicy(type: POLICY_TYPE): Response<string>

  /**
   * Sets default policy for policy type
   * @param type The policy type
   * @param policyId The policy id
   */
  setDefaultPolicy(type: POLICY_TYPE, policyId: string): Response
}
