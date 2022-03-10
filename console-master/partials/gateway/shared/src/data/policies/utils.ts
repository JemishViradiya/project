//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import { merge } from 'lodash-es'

import type { Policy } from '@ues-data/gateway'

import { DEFAULT_LOCAL_POLICY_DATA } from '../../config'

export const makePolicyPayload = (localPolicyData: Policy): Policy => {
  const policy: Policy = merge({}, DEFAULT_LOCAL_POLICY_DATA[localPolicyData.entityType], localPolicyData)

  if (policy.platforms?.Windows?.perAppVpn?.type) {
    policy.platforms.Windows.perAppVpn = {
      ...policy.platforms.Windows.perAppVpn,
      appIds: policy.platforms.Windows.perAppVpn.appIds || [],
      paths: policy.platforms.Windows.perAppVpn.paths || [],
    }
  }

  return policy
}
