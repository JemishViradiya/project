//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'
import { UesAxiosClient } from '@ues-data/shared'

import type ConnectionInterface from './connection-interface'
import type { AppConfigRequest, Connections, MultiStatusResponse, UEMTenants } from './connection-types'

const connectionUri = (): string => `/platform/v1/emm/types`

class ConnectionClass implements ConnectionInterface {
  getConnections(): Response<unknown> {
    return UesAxiosClient().get(connectionUri())
  }

  addConnections(newConnections: Connections[]): Response<MultiStatusResponse> {
    return UesAxiosClient().post(connectionUri(), newConnections)
  }
  removeConnection(type: string, force: boolean): Response<unknown> {
    return UesAxiosClient().delete(connectionUri() + '/' + type + (force ? `?force=${force}` : ''))
  }
  getUEMTenants(): Response<UEMTenants> {
    return UesAxiosClient().get(connectionUri() + '/uem/tenants')
  }
  addAppConfig(appConfigRequest: AppConfigRequest, type: string): Response<MultiStatusResponse> {
    return UesAxiosClient().post(connectionUri() + '/' + type + '/appConfig', appConfigRequest)
  }
  getConnectionsAsync(type: string): Response<Connections> {
    return UesAxiosClient().get(connectionUri() + '/' + type)
  }
}

const Connection = new ConnectionClass()
export { Connection }
