//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import { axiosInstance, baseUrl } from '../config.rest'
import type ConnectorsInterface from './connectors-interface'
import type { AuthPublicKey, ConnectorConfigInfo, ConnectorCreateInfo } from './connectors-types'

export const makeConnectorEndpoint = (tenantId: string, connectorId?: string): string =>
  connectorId ? `/tenant/v1/${tenantId}/connectors/${connectorId}` : `/tenant/v1/${tenantId}/connectors`

export const makeConnectorUrl = (tenantId: string, connectorId?: string): string =>
  `${baseUrl}${makeConnectorEndpoint(tenantId, connectorId)}`

class ConnectorsClass implements ConnectorsInterface {
  create(tenantId: string, connectorConfig: Partial<ConnectorConfigInfo>): Response<ConnectorCreateInfo> {
    return axiosInstance().post(makeConnectorUrl(tenantId), connectorConfig)
  }

  read(tenantId: string, connectorId?: string): Response<Partial<ConnectorConfigInfo>[]> {
    return axiosInstance().get(makeConnectorUrl(tenantId, connectorId))
  }

  update(tenantId: string, connectorId: string, connectorConfig: Partial<ConnectorConfigInfo>): Response {
    return axiosInstance().put(makeConnectorUrl(tenantId, connectorId), connectorConfig)
  }

  remove(tenantId: string, connectorId: string): Response {
    return axiosInstance().delete(makeConnectorUrl(tenantId, connectorId))
  }

  getConnectorPublicKeys(tenantId: string, connectorId: string, keyId: string): Response<AuthPublicKey> {
    return axiosInstance().get(`${makeConnectorUrl(tenantId, connectorId)}/keys/${keyId}`)
  }
}

const Connectors = new ConnectorsClass()

export { Connectors }
