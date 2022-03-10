import type {
  AsyncMutation,
  AsyncQuery,
  EffectiveUsersPolicy,
  PagableResponse,
  ReconciliationEntity,
  ReconciliationEntityDefinition,
} from '@ues-data/shared'
import { FeatureName, FeaturizationApi, NoPermissions } from '@ues-data/shared'

import { Reconciliation, ReconciliationMock } from '../../reco'
import { UserReadPermissions, UserUpdatePermissions } from '../../shared/permissions'
import type { PolicyAssignment } from '../common'
import { UsersPolicy, UsersPolicyMock } from '../common'

// Get policies assigned directly to user
export const queryUserPolicies: AsyncQuery<PolicyAssignment[], { userId: string }> = {
  query: async ({ userId }) => {
    if (userId) {
      const data = await UsersPolicy.getUserPolicies(userId)
      return data.data.elements
    } else {
      return undefined
    }
  },
  mockQueryFn: async ({ userId }) => {
    if (userId) {
      const data = await UsersPolicyMock.getUserPolicies(userId)

      return data.data.elements
    } else {
      return undefined
    }
  },
  permissions: UserReadPermissions,
}

export const queryUsersEffectivePolicy: AsyncQuery<EffectiveUsersPolicy> = {
  query: async ({ userId, serviceId }) => {
    if (userId && serviceId) {
      const data = await UsersPolicy.getUserEffectivePolicy(userId, serviceId)
      return data.data
    } else {
      return undefined
    }
  },
  mockQueryFn: async ({ userId, serviceId }) => {
    if (userId && serviceId) {
      const data = await UsersPolicyMock.getUserEffectivePolicy(userId, serviceId)
      return data.data
    } else {
      return undefined
    }
  },
  permissions: UserReadPermissions,
}

export const queryAllPolicies: AsyncQuery<PagableResponse<ReconciliationEntity>, void> = {
  query: async () => {
    const data = await Reconciliation.getEntities()
    return data.data
  },
  mockQueryFn: async () => {
    const data = FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode)
      ? await Reconciliation.getEntities()
      : await ReconciliationMock.getEntities()
    return data.data
  },
  permissions: NoPermissions,
}

export const queryPoliciesDefinitions: AsyncQuery<ReconciliationEntityDefinition[], void> = {
  query: async () => {
    const data = await Reconciliation.getDefinitions()
    return data.data?.elements
  },
  mockQueryFn: async () => {
    const data = FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode)
      ? await Reconciliation.getDefinitions()
      : await ReconciliationMock.getDefinitions()
    return data.data?.elements
  },
  permissions: NoPermissions,
}

export const unassignUserPolicy: AsyncMutation<any, { userId: string; policy: PolicyAssignment }> = {
  mutation: async ({ userId, policy }) => {
    await UsersPolicy.unassignPolicies(userId, [policy])
  },
  mockMutationFn: async ({ userId, policy }) => {
    await UsersPolicyMock.unassignPolicies(userId, [policy])
  },
  permissions: UserUpdatePermissions,
}

export const assignUserPolicies: AsyncMutation<any, { userId: string; policies: PolicyAssignment[] }> = {
  mutation: async ({ userId, policies }) => {
    await UsersPolicy.assignPolicies(userId, policies)
  },
  mockMutationFn: async ({ userId, policies }) => {
    await UsersPolicyMock.assignPolicies(userId, policies)
  },
  permissions: UserUpdatePermissions,
}
