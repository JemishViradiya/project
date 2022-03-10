/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Response } from '@ues-data/shared'
import { UesAxiosClient } from '@ues-data/shared'

import { policyBaseUrl } from '../../config.rest'
import type PolicyServiceInterface from './policy-service-interface'
import type { POLICY_SETTING_TYPE, PolicyDomainReference } from './policy-types'

const getPolicyDomainsRefernceUrl = (): string => `${policyBaseUrl}/setting`

class PolicyeServiceClass implements PolicyServiceInterface {
  getReference(settingType: POLICY_SETTING_TYPE): Response<PolicyDomainReference[]> {
    return UesAxiosClient().get(getPolicyDomainsRefernceUrl() + `/${settingType}`)
  }
}

const PolicyService = new PolicyeServiceClass()

export { PolicyService }
