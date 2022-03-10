//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import type { AuthPublicKey, ConnectorConfigInfo, ConnectorCreateInfo } from './connectors-types'

export default interface ConnectorsInterface {
  /**
   * Creates a new connector for this tenant
   * @param tenantId The tenant id of the customer
   * @param connectorConfig The initial connector configuration
   */
  create(tenantId: string, connectorConfig: ConnectorConfigInfo): Response<ConnectorCreateInfo>

  /**
   * Get the connector data recorded by the Tenant Config Service
   * @param tenantId The tenant id of the customer
   * @param id The connector id
   */
  read(tenantId: string, id?: string): Response<Partial<ConnectorConfigInfo> | Partial<ConnectorConfigInfo>[]>

  /**
   * Updates the connector data in the Tenant Config Service
   * @param tenantId The tenant id of the customer
   * @param id The connector id
   * @param connectorConfig The updated connector data
   */
  update(tenantId: string, id: string, connectorConfig: Partial<ConnectorConfigInfo>): Response

  /**
   * Deletes the connector data in the Tenant Config Service
   * @param tenantId The tenant id of the customer
   * @param id The connector id
   */
  remove(tenantId: string, id: string): Response

  /**
   * Get the connector public key identified by this key id.
   *
   * During the key rolling stage the connector can have 2 valid public keys, the
   * current one and a new, pending key. When the pending new key is used for a
   * non - key roll request, it becomes the current key. The Egress Connector
   * Registration Service will call this API, signalling that the new key is
   * valid.
   *
   * The Tenant Config Service will remove the old key, while the pending key
   * becomes the current key.
   *
   * @param tenantId The tenant id of the customer
   * @param id The connector id
   * @param keyId The public key id
   */
  getConnectorPublicKeys(tenantId: string, id: string, keyId: string): Response<AuthPublicKey>
}
