import { UesAxiosClient } from '@ues-data/shared'
import type { Response } from '@ues-data/shared-types'

import type DevicesInterface from './devices-interface'
import type { DeviceStatusDetails } from './devices-types'

class DevicesClass implements DevicesInterface {
  getDeviceStatusDetails(userDeviceId: string): Response<DeviceStatusDetails> {
    return UesAxiosClient().get(`/platform/v1/emm/devices/status/` + encodeURIComponent(userDeviceId))
  }
}

export const Devices = new DevicesClass()
