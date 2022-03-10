//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { AsyncQuery } from '@ues-data/shared'
import { Permission } from '@ues-data/shared'

import { AuthorizedSoftwareProcessor } from './authorized-software'
import { AuthorizedSoftwareMock } from './authorized-software-mock'
import type { AuthorizedSoftware } from './authorized-software-types'

const permissions = new Set([Permission.ECS_IDENTITY_READ])

export const queryAuthorizedSoftwares: AsyncQuery<AuthorizedSoftware[], void> = {
  query: async () => {
    const data = await AuthorizedSoftwareProcessor.getAuthorizedSoftwares()
    return data.data
  },
  mockQueryFn: async () => {
    const data = await AuthorizedSoftwareMock.getAuthorizedSoftwares()
    return data.data
  },
  permissions,
}
export const queryAuthorizedSoftware: AsyncQuery<AuthorizedSoftware, { id: string }> = {
  query: async ({ id }) => {
    const data = await AuthorizedSoftwareProcessor.getAuthorizedSoftwareById(id)
    return data.data
  },
  mockQueryFn: async ({ id }) => {
    const data = await AuthorizedSoftwareMock.getAuthorizedSoftwareById(id)
    return data.data
  },
  permissions,
}
