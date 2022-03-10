import type { Response } from '@ues-data/shared'

import type { BcnConfigSettings, BCNConnection } from './bcn-types'

interface BcnInterface {
  getInstances(): Response<BCNConnection[]>

  deleteInstance(id: string): Promise<void>

  getActivation(): Response<string>

  saveConfig(config: any): Response<BcnConfigSettings>

  getSettings(settingsNames: string[]): Response<BcnConfigSettings>
}

const BcnInterface = void 0

export default BcnInterface
