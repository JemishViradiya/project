//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { PagableResponse, Response } from '@ues-data/shared'

import type { NetworkServiceEntity, NetworkServicesRequestParams } from './network-services-types'

export default interface NetworkServicesInterface {
  /**
   * Creates a new network service for this tenant
   * @param tenantId The tenant id of the customer
   * @param networkServiceConfig The initial network service configuration
   */
  create(tenantId: string, networkServiceConfig: NetworkServiceEntity): Response<{ id: string }>

  /**
   * Get a network service for this tenant
   * @param tenantId The tenant id of the customer
   * @param networkServiceId The network service id
   */
  readOne(tenantId: string, networkServiceId: string): Response<NetworkServiceEntity>

  /**
   * Get all network services for this tenant
   * @param tenantId The tenant id of the customer
   * @param params The network services query params
   */
  read(tenantId: string, params?: NetworkServicesRequestParams): Response<PagableResponse<NetworkServiceEntity>>

  /**
   * Updates the network service data
   * @param tenantId The tenant id of the customer
   * @param networkServiceId The network service id
   * @param networkServiceConfig The updated network service data
   */
  update(tenantId: string, networkServiceId: string, networkServiceConfig: NetworkServiceEntity): Response

  /**
   * Deletes the network service data
   * @param tenantId The tenant id of the customer
   * @param networkServiceId The network service id
   */
  remove(tenantId: string, networkServiceId: string): Response
}
