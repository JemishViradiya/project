//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params */
/* eslint-disable sonarjs/no-duplicate-string */

import type { Response } from '@ues-data/shared'

import type BcnInterface from './bcn-interface'
import type { BcnConfigSettings, BCNConnection } from './bcn-types'

export const bcnInstanceMock: BCNConnection = {
  instanceId: 'c6bf06c9-88dd-482f-b35d-07ccc88b77b1',
  tenantId: 'V73324241',
  displayName: 'Test BCN',
  activationDate: '2021-03-30T17:15:24.824+00:00',
  version: '1',
  capabilities: [],
  services: [
    {
      serviceID: 'c6bf06c9-88dd-492f-b35d-07ccc88b77b1',
      instanceId: 'c6bf06c9-88dd-482f-b35d-07ccc88b77b1',
      version: '1',
      name: 'BCN test service',
      paused: false,
      health: undefined,
      ha: undefined,
      connections: [],
    },
  ],
}

const configSettingsMock = {
  globalSettings: {
    'common.logging.file.maximum.size.mb': '500',
    'common.logging.syslog.port': '3101',
    'common.logging.file.compress.enabled': 'false',
    'common.logging.syslog.host': 'stratos.bcp.bblabs.rim.net',
    'common.logging.level': 'INFO',
    'common.logging.file.maximum.age.days': '0',
    'common.logging.file.enabled': 'true',
    'common.logging.syslog.enabled': 'false',
  },
  tenantLevelSettings: {
    'common.logging.file.maximum.size.mb': '500',
    'common.logging.syslog.port': '3101',
    'common.logging.file.compress.enabled': 'false',
    'common.logging.syslog.host': 'stratos.bcp.bblabs.rim.net',
    'common.logging.level': 'INFO',
    'common.logging.file.maximum.age.days': '0',
    'common.logging.file.enabled': 'true',
    'common.logging.syslog.enabled': 'false',
  },
  instanceLevelSettings: { fileCompressionEnabled: 'true' },
}

class BcnClass implements BcnInterface {
  getInstances(): Response<BCNConnection[]> {
    return Promise.resolve({ data: [bcnInstanceMock] })
  }
  deleteInstance(id: string): Promise<void> {
    return Promise.resolve()
  }
  getActivation(): Response<string> {
    return Promise.resolve({ data: 'not a real activation' })
  }
  saveConfig(config: any): Response<BcnConfigSettings> {
    return Promise.resolve({ data: configSettingsMock })
  }
  getSettings(settingsNames: string[]): Response<BcnConfigSettings> {
    return Promise.resolve({ data: configSettingsMock })
  }
}

const BcnMock = new BcnClass()

export { BcnMock }
