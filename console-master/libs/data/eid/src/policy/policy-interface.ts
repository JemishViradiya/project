//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared-types'

import type { Policy } from './policy-types'

// ToDo: Actually document interface
export default interface PolicyInterface {
  /**
   * Creates a Policy
   * @param policy The new policy
   */
  createPolicy(policy: Policy): Response<Policy>

  /**
   * Get all policies
   */
  getPolicies(): Response<Array<Policy>>

  getPolicyById(id: string): Response<Policy>
  updatePolicy(id: string, policy: Policy): Response<Policy>
  deletePolicy(id: string): Response<Record<string, unknown>>
}
