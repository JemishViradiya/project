/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Response } from '@ues-data/shared'

import type { POLICY_SETTING_TYPE, PolicyDomainReference } from './policy-types'

interface PolicyServiceInterface {
  getReference(settingType: POLICY_SETTING_TYPE): Response<PolicyDomainReference[]>
}

export default PolicyServiceInterface
