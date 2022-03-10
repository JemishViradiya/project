//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params, sonarjs/no-duplicate-string */

import type { Response } from '@ues-data/shared'

import type NetworkProtectionInterface from './network-protection-interface'
import type { NetworkProtectionConfig } from './network-protection-types'

const is = 'NetworkProtectionMock'

export const networkProtectionConfigMock: NetworkProtectionConfig = {
  intrusionProtectionEnabled: true,
  ipRep: {
    enabled: true,
    threshold: 'low',
  },
}

class NetworkProtectionClass implements NetworkProtectionInterface {
  read(_tenantId: string): Response<NetworkProtectionConfig> {
    console.log(`${is}: read(${[...arguments]})`)
    return Promise.resolve({ data: networkProtectionConfigMock })
  }

  update(_tenantId: string, data: Partial<NetworkProtectionConfig>): Response<Partial<NetworkProtectionConfig>> {
    console.log(`${is}: update(${[...arguments]})`)
    return Promise.resolve({ data })
  }
}

const NetworkProtectionMock = new NetworkProtectionClass()

export { NetworkProtectionMock }
