import type { Response } from '@ues-data/shared-types'

import type DevicesInterface from './devices-interface'
import type { DeviceStatusDetails } from './devices-types'
import { DeviceEmmRegistrationStatus } from './devices-types'

export const deviceStatusDetailsMock: DeviceStatusDetails = {
  emmType: 'Intune',
  registrationStatus: DeviceEmmRegistrationStatus.Pending,
}

class DevicesClass implements DevicesInterface {
  getDeviceStatusDetails(userDeviceId: string): Response<DeviceStatusDetails> {
    return Promise.resolve({ data: deviceStatusDetailsMock })
  }
}

const DevicesMock = new DevicesClass()

export { DevicesMock }
