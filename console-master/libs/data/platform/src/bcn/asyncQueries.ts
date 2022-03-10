import type { AsyncMutation } from '@ues-data/shared'

import { BCNCreatePermissions, BCNUpdatePermissions } from '../shared/permissions'
import { Bcn, BcnMock } from './common'

export const generateBcnActivation: AsyncMutation<Blob, void> = {
  mutation: async () => {
    const { data } = await Bcn.getActivation()
    return new Blob([data])
  },
  mockMutationFn: () => {
    return new Blob(['some mock data'])
  },
  permissions: BCNCreatePermissions,
}

export const saveBcnConfig: AsyncMutation<void, any> = {
  mutation: async ({ newSettings }) => {
    await Bcn.saveConfig(newSettings)
  },
  mockMutationFn: async ({ newSettings }) => {
    await BcnMock.saveConfig(newSettings)
  },
  permissions: BCNUpdatePermissions,
}
