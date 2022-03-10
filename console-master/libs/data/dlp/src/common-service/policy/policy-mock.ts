/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { Response } from '@ues-data/shared'

import type PolicyServiceInterface from './policy-service-interface'
import type { POLICY_SETTING_TYPE, PolicyDomainReference } from './policy-types'

export const policyReferences = (settingType: string): PolicyDomainReference[] => [
  {
    reference: 'blackberry.com',
    usedInPolicies: ['1234', '5678'],
  },
  {
    reference: 'gitlab.rim.net',
    usedInPolicies: ['1w234', '56w78'],
  },
]

class PolicyServiceClass implements PolicyServiceInterface {
  getReference(settingType: POLICY_SETTING_TYPE): Response<PolicyDomainReference[]> {
    return Promise.resolve({ data: policyReferences(settingType) })
  }
}

const PolicyServiceClassMock = new PolicyServiceClass()

export { PolicyServiceClassMock }
