//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params, sonarjs/no-duplicate-string */

import { v4 as uuidv4 } from 'uuid'

import type { Response } from '@ues-data/shared-types'

import type ConnectorsInterface from './connectors-interface'
import type { AuthPublicKey, ConnectorConfigInfo, ConnectorCreateInfo } from './connectors-types'

const is = 'ConnectorsClass'

const NOT_ENROLLED_CONNECTOR_ID = '52087fa844b04b79b8113aa7b3a9f37a'
export const connectorsMock: ConnectorConfigInfo[] = [
  {
    connectorId: 'f1c00eda5a2b4e50acf7120f6a6896a1',
    name: 'BG Connector 1.1.1.428',
    upgradeAvailable: false,
    maintenanceRequired: false,
    privateUrl: 'https://10.0.0.165',
    authPublicKey: {
      crv: 'P-521',
      kid: 'LFV5KfccKst9Dlyxi3H3f0toObbZoQfRZEO3JMcMlq0np7cwjqJQYC4j2nBZvbiq',
      kty: 'EC',
      x: 'AAJEJ2LcJaobVoVay_Lp3t9c2nVet2Bh1TVy9c3cuMdvADR_VyEEcrlJirBQ0Q3QqSSieiyZDLlvR-jOICGb_XdZ',
      y: 'AAjb33ptfg_dnCJTDw-AUt_BUHe1E0O-oho-b6WoICeumn_aLYOW_JekYn3NDhk09-8baFuU2rNaJYaDMNJSql0_',
    },
    health: undefined,
    healthStatus: undefined,
    enrolled: {
      value: true,
    },
  },
  {
    connectorId: NOT_ENROLLED_CONNECTOR_ID,
    name: 'NA - Waterloo',
    authPublicKey: {
      kty: 'EC',
      kid: 'ikzrCrCc-ZjMKK10iyihjCOeB7wQgEMpFEsajrpatTI',
      crv: 'P-256',
      x: 'Wf16LZGpdBSSoabDFfIV  -7WVIp0kcNlxcYt_0B0te48',
      y: 'Y7K1G4BF-xqR4699eLD4O5FY1ssyUt0DtbnOnqCtyw4',
    },
    upgradeAvailable: false,
    maintenanceRequired: false,
    privateUrl: 'https://connector.private.network.waterloo',
    health: {
      health: 'GREEN',
    },
    healthStatus: [],
    enrolled: {
      value: false,
      enrollmentIncompleteReason: 'expired',
    },
  },
  {
    connectorId: '85fda455dba143aca11269c9dc151d4a',
    name: 'EU - Paris',
    authPublicKey: {
      kty: 'EC',
      kid: 'ikzrCrCc-ZjMKK10iyihjCOeB7wQgEMpFEsajrpatTI',
      crv: 'P-256',
      x: 'Wf16LZGpdBSSoabDFfIV  -7WVIp0kcNlxcYt_0B0te48',
      y: 'Y7K1G4BF-xqR4699eLD4O5FY1ssyUt0DtbnOnqCtyw4',
    },
    upgradeAvailable: false,
    maintenanceRequired: true,
    privateUrl: 'https://connector.private.network.paris',
    health: {
      health: 'RED',
    },
    healthStatus: [
      {
        ingressName: 'string',
        tunnel: true,
        DNS: true,
        testPage: 400,
      },
    ],
    enrolled: {
      value: true,
    },
  },
  {
    connectorId: '6004f778a6384a64b8ec360c16831b73',
    name: 'EU - Amsterdam',
    authPublicKey: {
      kty: 'EC',
      kid: 'ikzrCrCc-ZjMKK10iyihjCOeB7wQgEMpFEsajrpatTI',
      crv: 'P-256',
      x: 'Wf16LZGpdBSSoabDFfIV  -7WVIp0kcNlxcYt_0B0te48',
      y: 'Y7K1G4BF-xqR4699eLD4O5FY1ssyUt0DtbnOnqCtyw4',
    },
    upgradeAvailable: false,
    maintenanceRequired: false,
    privateUrl: 'https://connector.private.network.amsterdam',
    health: {
      health: 'GREEN',
    },
    healthStatus: [
      {
        ingressName: 'string',
        tunnel: true,
        DNS: true,
        testPage: 204,
      },
      {
        ingressName: 'string',
        tunnel: true,
        DNS: true,
        testPage: 301,
      },
    ],
    enrolled: {
      value: true,
    },
  },
  {
    connectorId: '851a576612c94511a0966a56ada35bb4',
    name: 'NA - Chicago',
    authPublicKey: {
      kty: 'EC',
      kid: 'ikzrCrCc-ZjMKK10iyihjCOeB7wQgEMpFEsajrpatTI',
      crv: 'P-256',
      x: 'Wf16LZGpdBSSoabDFfIV  -7WVIp0kcNlxcYt_0B0te48',
      y: 'Y7K1G4BF-xqR4699eLD4O5FY1ssyUt0DtbnOnqCtyw4',
    },
    upgradeAvailable: false,
    maintenanceRequired: true,
    privateUrl: 'https://connector.private.network.chicago',
    health: {
      health: 'GREEN',
    },
    healthStatus: [],
    enrolled: {
      value: false,
      enrollmentIncompleteReason: 'pending',
    },
  },
  {
    connectorId: '851a576612c94511a0966a56ada35b4b',
    name: 'NA - New York City',
    authPublicKey: {
      kty: 'EC',
      kid: 'ikzrCrCc-ZjMKK10iyihjCOeB7wQgEMpFEsajrpatTI',
      crv: 'P-256',
      x: 'Wf16LZGpdBSSoabDFfIV  -7WVIp0kcNlxcYt_0B0te48',
      y: 'Y7K1G4BF-xqR4699eLD4O5FY1ssyUt0DtbnOnqCtyw4',
    },
    upgradeAvailable: true,
    maintenanceRequired: false,
    privateUrl: 'https://connector.private.network.nyc',
    health: {
      health: 'GREEN',
    },
    healthStatus: [],
    enrolled: {
      value: true,
    },
  },
  {
    connectorId: '8004f678a6354c65b8gc360c16832b82',
    name: 'SA - Sao Paulo',
    authPublicKey: {
      kty: 'EC',
      kid: 'ikzrCrCc-ZjMKK10iyihjCOeB7wQgEMpFEsajrpatTI',
      crv: 'P-256',
      x: 'Wf16LZGpdBSSoabDFfIV  -7WVIp0kcNlxcYt_0B0te48',
      y: 'Y7K1G4BF-xqR4699eLD4O5FY1ssyUt0DtbnOnqCtyw4',
    },
    upgradeAvailable: false,
    maintenanceRequired: false,
    privateUrl: 'https://connector.private.network.saopaulo',
    health: {
      health: 'RED',
    },
    healthStatus: [
      {
        ingressName: 'string',
        tunnel: true,
        DNS: false,
        testPage: 0,
      },
    ],
    enrolled: {
      value: true,
    },
  },
]

class ConnectorsClass implements ConnectorsInterface {
  create(_tenantId: string, connectorConfig: ConnectorConfigInfo): Response<ConnectorCreateInfo> {
    console.log(`${is}: create(${[...arguments]})`)
    connectorConfig.connectorId = uuidv4()
    connectorsMock.push(connectorConfig)
    console.log(`${is}: mock added connector ${JSON.stringify(connectorConfig)}`)
    return Promise.resolve({
      data: { connectorId: connectorConfig.connectorId, serviceApiGatewayUrl: 'https://test.big.labs.blackberry.com' },
    })
  }

  read(_tenantId: string, connectorId?: string): Response<Partial<ConnectorConfigInfo> | Partial<ConnectorConfigInfo>[]> {
    if (connectorId) {
      const connector: Partial<ConnectorConfigInfo> = connectorsMock.find(connector => connector.connectorId === connectorId)
      if (!connector) {
        return Promise.reject({
          response: {
            status: 404,
          },
        })
      }
      return Promise.resolve({ data: connector })
    }
    return Promise.resolve({ data: connectorsMock })
  }

  update(_tenantId: string, connectorId: string, connectorConfig: Partial<ConnectorConfigInfo>): Response {
    console.log(`${is}: update(${[...arguments]})`)
    const index = connectorsMock.findIndex(connector => connector.connectorId === connectorId)
    if (index >= 0) {
      connectorsMock[index] = { ...connectorsMock[index], ...connectorConfig }
      return Promise.resolve({})
    }
    return Promise.resolve({})
  }

  remove(_tenantId: string, connectorId: string): Response {
    console.log(`${is}: remove(${[...arguments]})`)

    const index = connectorsMock.findIndex(connector => connector.connectorId === connectorId)

    if (index >= 0 && connectorId !== NOT_ENROLLED_CONNECTOR_ID) {
      connectorsMock.splice(index, 1)
      return Promise.resolve({})
    }

    return Promise.reject({
      response: {
        status: 400,
      },
      error: 'ConnectorNotFound',
    })
  }

  getConnectorPublicKeys(_tenantId: string, _connectorId: string, _keyId: string): Response<AuthPublicKey> {
    const ret: AuthPublicKey = {
      kty: 'kty-value',
      kid: 'kid-value',
      crv: 'crv-value',
      x: 'x-value',
      y: 'y-value',
    }
    return Promise.resolve({ data: ret })
  }
}

const ConnectorsMock = new ConnectorsClass()

export { ConnectorsMock }
