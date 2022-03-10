//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { AsyncQuery } from '@ues-data/shared'
import { Permission } from '@ues-data/shared'

import { Authenticators } from './authenticators'
import { AuthenticatorsMock } from './authenticators-mock'
import type { Authenticator } from './authenticators-types'

const permissions = new Set([Permission.ECS_IDENTITY_READ])

export const queryAuthenticators: AsyncQuery<Authenticator[], void> = {
  query: async () => {
    const data = await Authenticators.getAuthenticators()
    return data.data
  },
  mockQueryFn: async () => {
    const data = await AuthenticatorsMock.getAuthenticators()
    return data.data
  },
  permissions,
}
export const queryAuthenticator: AsyncQuery<Authenticator, { id: string }> = {
  query: async ({ id }) => {
    const data = await Authenticators.getAuthenticatorById(id)
    return data.data
  },
  mockQueryFn: async ({ id }) => {
    const data = await AuthenticatorsMock.getAuthenticatorById(id)
    return data.data
  },
  permissions,
}
