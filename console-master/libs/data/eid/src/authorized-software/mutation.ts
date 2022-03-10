//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { AsyncMutation } from '@ues-data/shared'

import { AuthorizedSoftwareProcessor } from './authorized-software'
import { AuthorizedSoftwareMock } from './authorized-software-mock'
import type { AuthorizedSoftware } from './authorized-software-types'

export const mutateCreateAuthorizedSoftware: AsyncMutation<typeof AuthorizedSoftware, { template: AuthorizedSoftware }> = {
  mutation: async ({ template }) => {
    const data = await AuthorizedSoftwareProcessor.createAuthorizedSoftware(template)

    return data.data
  },
  mockMutationFn: async ({ template }): Promise<AuthorizedSoftware> => {
    const data = await AuthorizedSoftwareMock.createAuthorizedSoftware(template)
    return data.data
  },
}

export const mutateUpdateAuthorizedSoftware: AsyncMutation<
  typeof AuthorizedSoftware,
  { id: string; template: AuthorizedSoftware }
> = {
  mutation: async ({ id, template }) => {
    const data = await AuthorizedSoftwareProcessor.updateAuthorizedSoftware(id, template)

    return data.data
  },
  mockMutationFn: async ({ id, template }): Promise<AuthorizedSoftware> => {
    const data = await AuthorizedSoftwareMock.updateAuthorizedSoftware(id, template)
    return data.data
  },
}

export const mutateDeleteAuthorizedSoftware: AsyncMutation<unknown, { id: string }> = {
  mutation: async ({ id }) => {
    const data = await AuthorizedSoftwareProcessor.deleteAuthorizedSoftware(id)

    return data.data
  },
  mockMutationFn: async ({ id }) => {
    const data = await AuthorizedSoftwareMock.deleteAuthorizedSoftware(id)
    return data.data
  },
}
