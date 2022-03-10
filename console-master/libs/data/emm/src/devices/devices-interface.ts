import type { Response } from '@ues-data/shared'

import type { DeviceStatusDetails } from './devices-types'

export default interface DevicesInterface {
  /**
   * Get Device's EMM type and registration status
   */
  getDeviceStatusDetails(userDeviceId: string): Response<DeviceStatusDetails>
}
