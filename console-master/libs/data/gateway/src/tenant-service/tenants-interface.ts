//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import type { TenantConfiguration, TenantHealthEntity } from './tenants-types'

export default interface TenantsInterface {
  /**
   * Get the configuration for a BIG tenant
   * @param tenantId The tenant id of the customer
   */
  readConfig(tenantId: string): Response<TenantConfiguration>

  /**
   * Update the configuration for a BIG tenant
   * @param tenantId The tenant id of the customer
   * @param config The updated configuration for the BIG tenant
   */
  updateConfig(tenantId: string, config: Partial<TenantConfiguration>): Response<Partial<TenantConfiguration>>

  /**
   * Get the aggregated health status of the tenant
   * @param tenantId The tenant id of the customer
   * @returns Aggregated health status of the tenant
   */
  readHealth(tenantId: string): Response<TenantHealthEntity>
}
