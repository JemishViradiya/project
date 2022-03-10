//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.
import { UesAxiosClient } from '@ues-data/shared'
import type { EffectiveUsersPolicy, PagableResponse, Response } from '@ues-data/shared-types'

import type UsersPolicyInterface from './users-policies-interface'
import type { PolicyAssignment } from './users-types'

class UsersPolicyClass implements UsersPolicyInterface {
  getUserPolicies(userId: string): Response<PagableResponse<PolicyAssignment>> {
    return UesAxiosClient().get(`/platform/v1/reconciliation/assignments/users/${userId}`)
  }
  getUserEffectivePolicy(userId: string, serviceId: string): Response<EffectiveUsersPolicy> {
    return UesAxiosClient().get(`/platform/v1/reconciliation/effective/services/${serviceId}/users/${userId}`, {
      params: { extendedDetails: true },
    })
  }
  assignPolicies(userId: string, policies: PolicyAssignment[]): Promise<void> {
    return UesAxiosClient().post(`/platform/v1/reconciliation/assignments/users/${userId}`, policies)
  }
  unassignPolicies(userId: string, policies: PolicyAssignment[]): Promise<void> {
    return UesAxiosClient().delete(`/platform/v1/reconciliation/assignments/users/${userId}`, { data: policies })
  }
}

export const UsersPolicy = new UsersPolicyClass()
