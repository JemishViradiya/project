//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { AsyncQuery } from '@ues-data/shared'
import { NoPermissions } from '@ues-data/shared'

import { PolicyProcessor } from './policy'
import { PolicyMock } from './policy-mock'
import type { Policy } from './policy-types'

export const queryPolicies: AsyncQuery<Policy[], void> = {
  query: async () => {
    const data = await PolicyProcessor.getPolicies()
    return data.data
  },
  mockQueryFn: async () => {
    const data = await PolicyMock.getPolicies()
    return data.data
  },
  permissions: NoPermissions,
}
export const queryPolicy: AsyncQuery<Policy, { id: string }> = {
  query: async ({ id }) => {
    const data = await PolicyProcessor.getPolicyById(id)
    return data.data
  },
  mockQueryFn: async ({ id }) => {
    const data = await PolicyMock.getPolicyById(id)
    return data.data
  },
  permissions: NoPermissions,
}
