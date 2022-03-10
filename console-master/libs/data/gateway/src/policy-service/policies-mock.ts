//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params, sonarjs/no-duplicate-string */

import { BAD_REQUEST } from 'http-status-codes'
import { v4 as uuidv4 } from 'uuid'

import type { ReconciliationEntityId, Response } from '@ues-data/shared-types'
import { ReconciliationEntityType } from '@ues-data/shared-types'

import { RequestError } from './common-types'
import type PoliciesInterface from './policies-interface'
import type { Policy } from './policies-types'
import {
  AuthorizedAppInterfaceModeType,
  IncomingConnectionsType,
  OtherUserModeType,
  PlatformAccessControlType,
  UnauthorizedAppInterfaceModeType,
} from './policies-types'

const is = 'PoliciesClass'

export const networkAccessControlPolicyMock: Policy[] = [
  {
    id: '9906e78b-4ccc-4080-8b6c-fd2367c45d02',
    name: 'Network Access Control 1',
    entityType: ReconciliationEntityType.NetworkAccessControl,
    description: 'Network Access Control Policy',
    created: 1587671599732,
    modified: 1587671599732,
    allowed: {
      networkServices: [
        {
          id: 's380dea71-e423-47b5-b93c-2934a66f209c',
          name: 'Office 365',
        },
        {
          id: 's480dea71-g423-47b5-b93c-2934a66h209h',
          name: 'Saleforce',
        },
      ],
      fqdns: ['*.blackberry.com', 'www.google.ca'],
      ipRanges: ['10.0.0.0/24', '10.10.0.10', '10.100.0.1-10.100.0.25'],
    },
    blocked: {
      networkServices: [{ name: 'WebEx', id: 's123dea75-g483-47i5-b93u-2914a66u209t' }],
      fqdns: ['www.yahoo.com', 'www.cnn.com'],
      ipRanges: ['3.10.0.0/24'],
    },
  },
  {
    id: '11981ec4-f154-435a-9df9-11da7b966f7f',
    name: 'Network Access Control 2',
    entityType: ReconciliationEntityType.NetworkAccessControl,
    description: 'Network Access Control Policy',
    created: 1587671599732,
    modified: 1587671599732,
    allowed: {
      networkServices: [
        {
          id: 's380dea71-e423-47b5-b93c-2934a66f209c',
          name: 'Office 365',
        },
      ],
      fqdns: ['*.blackberry.com', 'www.google.ca'],
      ipRanges: ['10.0.0.0/24', '10.10.0.10', '10.100.0.1-10.100.0.25'],
    },
    blocked: {
      networkServices: [{ name: 'WebEx', id: 's123dea75-g483-47i5-b93u-2914a66u209t' }],
      fqdns: ['www.yahoo.com', 'www.cnn.com'],
      ipRanges: ['3.10.0.0/24'],
    },
  },
  {
    id: '74fadb2f-efb7-4ab1-a0f4-c4d0ad7cfc68',
    name: 'Network Access Control 3',
    entityType: ReconciliationEntityType.NetworkAccessControl,
    description: 'Network Access Control Policy',
    created: 1587671599732,
    modified: 1587671599732,
    allowed: {
      networkServices: [],
      fqdns: ['*.blackberry.com', 'www.google.ca'],
      ipRanges: ['10.0.0.0/24', '10.10.0.10', '10.100.0.1-10.100.0.25'],
    },
    blocked: {
      networkServices: [{ name: 'Google', id: '123dea75-g123-47i5-b93u-8524a66u209z' }],
      fqdns: ['www.yahoo.com', 'www.cnn.com'],
      ipRanges: ['3.10.0.0/24'],
    },
  },
  {
    id: 'c4216e55-f9b4-4af8-915b-dbcf1671b16c',
    name: 'Network Access Control 4',
    entityType: ReconciliationEntityType.NetworkAccessControl,
    description: 'Network Access Control Policy',
    created: 1587671599732,
    modified: 1587671599732,
    allowed: {
      networkServices: [
        {
          id: '667dea75-g123-47i5-b34u-2125a66u989c',
          name: 'Atlassian',
        },
        {
          id: 's480dea71-g423-47b5-b93c-2934a66h209h',
          name: 'Saleforce',
        },
      ],
      fqdns: [],
      ipRanges: ['10.0.0.0/24', '10.10.0.10', '10.100.0.1-10.100.0.25'],
    },
    blocked: {
      networkServices: [{ name: 'Test name', id: 'b278fd68-1122-4db2-9558-2172dee4d876' }],
      fqdns: ['www.yahoo.com', 'www.cnn.com'],
      ipRanges: ['3.10.0.0/24'],
    },
  },
]

const policiesNames = networkAccessControlPolicyMock.map(policy => policy.name)
const mobileAppIds = Array.from({ length: 3 }).map((_, index) =>
  index % 2 === 0 ? `com.google${index + 1}.gmail` : `com.blackberry${index + 1}.bbm`,
)

export const gatewayAppPolicyMock: Policy[] = [
  {
    id: '9906e78b-4ccc-4080-8b6c-fd2367c45d02',
    name: 'Per App Policy 1',
    created: 1587671599732,
    modified: 1587671599732,
    entityType: ReconciliationEntityType.GatewayApp,
    description: 'Test per app vpn policy',
    platforms: {
      Android: {
        perAppVpn: {
          type: PlatformAccessControlType.Inclusive,
          appIds: mobileAppIds,
        },
      },
      Windows: {
        protectRequired: false,
        otherUserMode: OtherUserModeType.Conditional,
        perAppVpn: {
          type: PlatformAccessControlType.Exclusive,
          paths: ['C:\\customFolder', '%SystemDrive%\\target\\file.exe', '%AppData%\\appName\\app.exe'],
          appIds: mobileAppIds,
        },
        unauthorizedAppInterfaceMode: UnauthorizedAppInterfaceModeType.Block,
      },
      macOS: {
        protectRequired: true,
      },
    },
    splitTunnelEnabled: true,
    splitIpRanges: ['17.0.0.0/24', '17.17.0.3-17.17.0.50'],
  },
  {
    id: '11981ec4-f154-435a-9df9-11da7b966f7f',
    name: 'Per App Policy 2',
    created: 1587671599732,
    modified: 1587671599732,
    entityType: ReconciliationEntityType.GatewayApp,
    description: 'Test per app vpn policy',
    platforms: {
      Android: {
        perAppVpn: {
          type: PlatformAccessControlType.Inclusive,
          appIds: mobileAppIds,
        },
      },
      Windows: {
        authorizedAppInterfaceMode: AuthorizedAppInterfaceModeType.ForceTunnel,
        incomingConnections: IncomingConnectionsType.Allow,
        protectRequired: true,
      },
    },
    splitTunnelEnabled: false,
    splitIpRanges: ['17.0.0.0/24', '17.17.0.3-17.17.0.50'],
  },
  {
    id: '74fadb2f-efb7-4ab1-a0f4-c4d0ad7cfc68',
    name: 'Per App Policy 3',
    created: 1587671599732,
    modified: 1587671599732,
    entityType: ReconciliationEntityType.GatewayApp,
    description: 'Test per app vpn policy',
    platforms: {
      Android: {
        perAppVpn: {
          type: PlatformAccessControlType.Inclusive,
          appIds: mobileAppIds,
        },
      },
      Windows: {
        authorizedAppInterfaceMode: AuthorizedAppInterfaceModeType.AnyInterface,
        incomingConnections: IncomingConnectionsType.Block,
        protectRequired: true,
      },
    },
    splitTunnelEnabled: true,
    splitIpRanges: ['17.0.0.0/24', '17.17.0.3-17.17.0.50'],
  },
  {
    id: 'c4216e55-f9b4-4af8-915b-dbcf1671b16c',
    name: 'Per App Policy 4',
    created: 1587671599732,
    modified: 1587671599732,
    entityType: ReconciliationEntityType.GatewayApp,
    description: 'Test per app vpn policy',
    platforms: {
      Android: {
        perAppVpn: {
          type: PlatformAccessControlType.Exclusive,
          appIds: mobileAppIds,
        },
      },
      Windows: {
        authorizedAppInterfaceMode: AuthorizedAppInterfaceModeType.ForceTunnel,
        incomingConnections: IncomingConnectionsType.Block,
        protectRequired: false,
      },
    },
    splitTunnelEnabled: true,
    splitIpRanges: ['17.0.0.0/24', '17.17.0.3-17.17.0.50'],
  },
]

const getPolicyMock = (entityId: string, entityType: ReconciliationEntityType) => {
  switch (entityType) {
    case ReconciliationEntityType.GatewayApp:
      return gatewayAppPolicyMock.find(policy => policy.id === entityId)
    case ReconciliationEntityType.NetworkAccessControl:
      return networkAccessControlPolicyMock.find(policy => policy.id === entityId)
    default:
      return networkAccessControlPolicyMock[0]
  }
}

class PoliciesClass implements PoliciesInterface {
  create(_tenantId: string, data: Policy): Response<ReconciliationEntityId> {
    console.log(`${is}: create(${[...arguments]})`)

    const entityId = uuidv4()

    if (policiesNames.includes(data.name)) {
      return Promise.reject({
        response: {
          status: BAD_REQUEST,
          data: { error: RequestError.NameAlreadyUsed },
        },
      })
    }

    return Promise.resolve({ data: { entityId } })
  }

  readOne(_tenantId: string, entityId: string, entityType: ReconciliationEntityType): Response<Policy> {
    console.log(`${is}: readOne(${[...arguments]})`)

    return Promise.resolve({ data: getPolicyMock(entityId, entityType) })
  }

  update(_tenantId: string, entityId: string, data: Policy): Response {
    console.log(`${is}: update(${[...arguments]})`)

    const policy = networkAccessControlPolicyMock.find(item => item.id === entityId)

    if (data.name !== policy.name && policiesNames.includes(data.name)) {
      return Promise.reject({
        response: {
          status: BAD_REQUEST,
          data: { error: RequestError.NameAlreadyUsed },
        },
      })
    }

    return Promise.resolve({})
  }

  remove(_tenantId: string, _entityId: string): Response {
    console.log(`${is}: remove(${[...arguments]})`)

    return Promise.resolve({})
  }

  removeMany(_tenantId: string, _entityIds: string[]): Response {
    console.log(`${is}: removeMany(${[...arguments]})`)

    return Promise.resolve({})
  }
}

const PoliciesMock = new PoliciesClass()

export { PoliciesMock }
