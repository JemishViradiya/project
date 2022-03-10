//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import { axiosInstance, baseUrl } from '../config.rest'
import type NetworkProtectionInterface from './network-protection-interface'
import type { NetworkProtectionConfig } from './network-protection-types'

export const makeNetworkProtectionUrl = (tenantId: string): string => {
  return `${baseUrl}/policy/v3/${tenantId}/networkprotection`
}

class NetworkProtectionClass implements NetworkProtectionInterface {
  read(tenantId: string): Response<NetworkProtectionConfig> {
    return axiosInstance().get(makeNetworkProtectionUrl(tenantId))
  }

  update(tenantId: string, config: Partial<NetworkProtectionConfig>): Response<Partial<NetworkProtectionConfig>> {
    return axiosInstance().put(makeNetworkProtectionUrl(tenantId), config)
  }
}

const NetworkProtection = new NetworkProtectionClass()

export { NetworkProtection }
