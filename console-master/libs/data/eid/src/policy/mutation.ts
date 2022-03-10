//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { AsyncMutation } from '@ues-data/shared'

import { PolicyProcessor } from './policy'
import { PolicyMock } from './policy-mock'
import type { Policy } from './policy-types'

export const mutateCreatePolicy: AsyncMutation<typeof Policy, { policy: Policy }> = {
  mutation: async ({ policy }) => {
    const data = await PolicyProcessor.createPolicy(policy)
    return data.data
  },
  mockMutationFn: async ({ policy }): Promise<Policy> => {
    const data = await PolicyMock.createPolicy(policy)
    return data.data
  },
  mockOverrideId: 'UES.MockOverride.eidCreatePolicy.Enabled',
}

export const mutateUpdatePolicy: AsyncMutation<typeof Policy, { id: string; policy: Policy }> = {
  mutation: async ({ id, policy }) => {
    const data = await PolicyProcessor.updatePolicy(id, policy)
    return data.data
  },
  mockMutationFn: async ({ id, policy }): Promise<Policy> => {
    const data = await PolicyMock.updatePolicy(id, policy)
    return data.data
  },
  mockOverrideId: 'UES.MockOverride.eidUpdatePolicy.Enabled',
}

export const mutateDeletePolicy: AsyncMutation<unknown, { id: string }> = {
  mutation: async ({ id }) => {
    const data = await PolicyProcessor.deletePolicy(id)
    if (data) {
      data['id'] = id
    }
    return data
  },
  mockMutationFn: async ({ id }) => {
    const data = await PolicyMock.deletePolicy(id)
    return data.data
  },
  mockOverrideId: 'UES.MockOverride.eidDeletePolicy.Enabled',
}
