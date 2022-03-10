//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import type ConnectionInterface from './connection-interface'
import type { AppConfigRequest, Connections, MultiStatusResponse, UEMTenants } from './connection-types'

export const connectionListMock = [
  {
    type: 'INTUNE',
    activationType: 'MDM',
    enableSetRiskLevel: true,
    configuration: {
      aadTenantId: '000000-0000-0000-0000-00000000',
    },
  },
  {
    type: 'UEM',
    activationType: 'MDM',
    enableSetRiskLevel: true,
    configuration: {
      uemTenantId: 'L00000000',
      state: 'AUTHORIZED',
    },
  },
]

export const asyncINTUNEConnectionMock = {
  type: 'INTUNE',
  activationType: 'MDM',
  enableSetRiskLevel: true,
  configuration: {
    aadTenantId: '000000-0000-0000-0000-00000000',
  },
}
export const asyncUEMConnectionMock = {
  type: 'UEM',
  activationType: 'MDM',
  enableSetRiskLevel: true,
  configuration: {
    uemTenantId: 'L00000000',
    state: 'ERROR',
  },
}

export const uemTenantList = {
  organizationId: 'testOrgId',
  uemTenants: [
    {
      uemTenantId: 'testUemTenantId',
      isCloud: true,
      version: '1.0.0',
      uemDisplayName: 'test_uem',
      tenantType: 'UEM',
    },
    {
      uemTenantId: 'testUemTenantId1',
      isCloud: true,
      version: '1.0.0',
      uemDisplayName: 'test_uem1',
      tenantType: 'UEM',
    },
  ],
}

class ConnectionClass implements ConnectionInterface {
  getConnections(): Response<unknown> {
    return Promise.resolve({ data: connectionListMock, status: 200 })
  }

  addConnections(newConnections: Connections[]): Response<MultiStatusResponse> {
    return Promise.resolve({ status: 201 })
  }
  removeConnection(type: string, force: boolean): Response<unknown> {
    return Promise.resolve({ status: 204 })
  }
  getUEMTenants(): Response<UEMTenants> {
    return Promise.resolve({ data: uemTenantList, status: 200 })
  }

  addAppConfig(request: AppConfigRequest, type: string): Response<MultiStatusResponse> {
    return Promise.resolve({ status: 200 })
  }

  getConnectionsAsync(type: string): Response<Connections> {
    switch (type) {
      case 'INTUNE':
        return Promise.resolve({ data: asyncINTUNEConnectionMock, status: 200 })
      case 'UEM':
        return Promise.resolve({ data: asyncUEMConnectionMock, status: 200 })
    }
  }
}

const ConnectionMock = new ConnectionClass()

export { ConnectionMock }
