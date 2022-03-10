import type { AsyncMutation } from '@ues-data/shared'

import { Authenticators } from './authenticators'
import { AuthenticatorsMock } from './authenticators-mock'
import type { Authenticator } from './authenticators-types'

export const mutateCreateAuthenticator: AsyncMutation<typeof Authenticator, { authenticator: Authenticator }> = {
  mutation: async ({ authenticator }) => {
    const data = await Authenticators.createAuthenticator(authenticator)

    return data.data
  },
  mockMutationFn: async ({ authenticator }): Promise<Authenticator> => {
    const data = await AuthenticatorsMock.createAuthenticator(authenticator)
    return data.data
  },
}

export const mutateUpdateAuthenticator: AsyncMutation<typeof Authenticator, { id: string; authenticator: Authenticator }> = {
  mutation: async ({ id, authenticator }) => {
    const data = await Authenticators.updateAuthenticator(id, authenticator)

    return data.data
  },
  mockMutationFn: async ({ id, authenticator }): Promise<Authenticator> => {
    const data = await AuthenticatorsMock.updateAuthenticator(id, authenticator)
    return data.data
  },
}

export const mutateDeleteAuthenticator: AsyncMutation<unknown, { id: string }> = {
  mutation: async ({ id }) => {
    const data = await Authenticators.deleteAuthenticator(id)
    return data.data
  },
  mockMutationFn: async ({ id }) => {
    const data = await AuthenticatorsMock.deleteAuthenticator(id)
    return data.data
  },
}
