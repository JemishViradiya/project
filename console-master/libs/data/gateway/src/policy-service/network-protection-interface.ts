//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import type { NetworkProtectionConfig } from './network-protection-types'

export default interface NetworkProtectionInterface {
  /**
   * Get the configuration for the Network Protection
   * @param tenantId The tenant id of the customer
   */
  read(tenantId: string): Response<NetworkProtectionConfig>

  /**
   * Update the configuration for the Network Protection
   * @param tenantId The tenant id of the customer
   * @param config The updated configuration
   */
  update(tenantId: string, config: Partial<NetworkProtectionConfig>): Response<Partial<NetworkProtectionConfig>>
}
