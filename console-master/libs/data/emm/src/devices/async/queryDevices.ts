import type { AsyncQuery } from '@ues-data/shared'
import { Permission } from '@ues-data/shared'

import { Devices } from '../devices'
import { DevicesMock } from '../devices-mock'
import type { DeviceStatusDetails } from '../devices-types'

export const queryDeviceStatusDetails: AsyncQuery<DeviceStatusDetails, { userDeviceId: string }> = {
  query: async ({ userDeviceId }) => {
    if (userDeviceId) {
      const data = await Devices.getDeviceStatusDetails(userDeviceId)
      return data.data
    } else {
      return undefined
    }
  },
  mockQueryFn: async ({ userDeviceId }) => {
    if (userDeviceId) {
      const data = await DevicesMock.getDeviceStatusDetails(userDeviceId)

      return data.data
    } else {
      return undefined
    }
  },
  permissions: new Set([Permission.ECS_DEVICES_READ]),
}
