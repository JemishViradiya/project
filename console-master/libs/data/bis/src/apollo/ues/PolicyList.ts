import { Permission } from '@ues-data/shared-types'

import { PolicyListAddMutation, PolicyListDeleteMutation, PolicyListDetailsQuery, PolicyListUpdateMutation } from '../PolicyList'

const { update: notUsed1, ...policyListAddMutation } = PolicyListAddMutation
const { update: notUsed2, ...policyListUpdateMutation } = PolicyListUpdateMutation
const { update: notUsed3, ...policyListDeleteMutation } = PolicyListDeleteMutation

export const UESPolicyListAddMutation = {
  ...policyListAddMutation,
  displayName: 'UESPolicyListAddMutation',
}

export const UESPolicyListUpdateMutation = {
  ...policyListUpdateMutation,
  displayName: 'UESPolicyListUpdateMutation',
}

export const UESPolicyListDeleteMutation = {
  ...policyListDeleteMutation,
  displayName: 'UESPolicyListDeleteMutation',
}

export const UESPolicyDetailsQuery = {
  ...PolicyListDetailsQuery,
  permissions: new Set([Permission.BIS_RISKPROFILE_READ]),
}
