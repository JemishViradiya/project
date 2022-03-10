//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.
import type { Response } from '@ues-data/shared'
import { UesAxiosClient } from '@ues-data/shared'

import type BcnInterface from './bcn-interface'
import type { BcnConfigSettings, BCNConnection } from './bcn-types'

const makeUrl = (): string => `/platform/v1/bcnenrol`

class BcnClass implements BcnInterface {
  getInstances(): Response<BCNConnection[]> {
    return UesAxiosClient().get(makeUrl() + `/instances`)
  }
  deleteInstance(id: string): Promise<void> {
    return UesAxiosClient().delete(makeUrl() + `/instances/${id}`)
  }
  getActivation(): Response<string> {
    return UesAxiosClient().get(makeUrl() + '/activation', {
      responseType: 'blob',
      headers: {
        accept: 'text/plain',
      },
    })
  }
  saveConfig(config: any): Response<BcnConfigSettings> {
    return UesAxiosClient().put(makeUrl() + `/config`, config)
  }
  getSettings(settingsNames: string[]): Response<BcnConfigSettings> {
    return UesAxiosClient().post(makeUrl() + `/config`, settingsNames)
  }
}

const Bcn = new BcnClass()

export { Bcn }
