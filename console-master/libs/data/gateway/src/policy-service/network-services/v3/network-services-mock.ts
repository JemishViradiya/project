//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable sonarjs/no-duplicate-string */

import * as httpStatus from 'http-status-codes'
import { v4 as uuidv4 } from 'uuid'

import type { PagableResponse, Response } from '@ues-data/shared'

import { RequestError, TargetSetPortProtocol } from '../../common-types'
import type NetworkServicesInterface from './network-services-interface'
import type { NetworkServiceEntity } from './network-services-types'

export const networkServices: NetworkServiceEntity[] = [
  {
    id: 's380dea71-e423-47b5-b93c-2934a66f209c',
    name: 'Office 365',
    tenantId: 'system',
    targetSet: [
      {
        addressSet: [
          'outlook.office.com',
          'outlook1.office.com',
          'outlook2.office.com',
          'outlook3.office.com',
          'outlook4.office.com',
          'outlook5.office.com',
          '10.0.0.0/24',
          '127.0.0.1',
        ],
        portSet: [
          {
            protocol: TargetSetPortProtocol.TCP,
            min: 443,
          },
          {
            protocol: TargetSetPortProtocol.TCPorUDP,
            min: 5060,
          },
          {
            protocol: TargetSetPortProtocol.UDP,
            min: 1000,
            max: 1020,
          },
        ],
      },
    ],
  },
  {
    id: 's480dea71-g423-47b5-b93c-2934a66h209h',
    name: 'Saleforce',
    tenantId: 'system',
    targetSet: [
      {
        addressSet: [
          'saleforce.saleforce.com',
          'saleforce.saleforce1.com',
          'saleforce.saleforce2.com',
          'saleforce.saleforce3.com',
          '10.1.0.5/20',
        ],
        portSet: [
          {
            protocol: TargetSetPortProtocol.TCP,
            min: 221,
          },
          {
            protocol: TargetSetPortProtocol.UDP,
            min: 1020,
            max: 1024,
          },
        ],
      },
    ],
  },
  {
    id: 's123dea75-g483-47i5-b93u-2914a66u209t',
    name: 'WebEx',
    tenantId: 'system',
    targetSet: [
      {
        addressSet: [
          'webex.webex.com',
          'webex.webex.net',
          'webex1.webex.net',
          'webex2.webex.net',
          'webex3.webex.net',
          'webex4.webex.net',
          '10.0.0.5/15',
        ],
        portSet: [],
      },
    ],
  },
  {
    id: '123dea75-g123-47i5-b93u-2914a66u209x',
    name: 'Social media',
    tenantId: 'L75473134',
    targetSet: [
      {
        addressSet: ['facebook.com', 'instagram.com', 'whatsapp.com', 'twitter.com', 'linkedin.com', '10.0.0.1/15'],
        portSet: [],
      },
    ],
    networkServices: [{ id: 's123dea75-g483-47i5-b93u-2914a66u209t', name: 'WebEx' }],
  },
  {
    id: '123dea75-g123-47i5-b93u-8524a66u209z',
    name: 'Google',
    tenantId: 'L75473134',
    targetSet: [
      {
        addressSet: ['*.google.com', '*.google.ca', '10.0.0.1/15'],
        portSet: [],
      },
    ],
  },
  {
    id: '667dea75-g123-47i5-b34u-2125a66u989c',
    name: 'Atlassian',
    metadata: {
      description: 'Atlassian Network Service',
    },
    tenantId: 'L75473134',
    targetSet: [
      {
        addressSet: ['jirasd.rim.net', 'wikis.rim.net'],
        portSet: [
          {
            protocol: TargetSetPortProtocol.TCP,
            min: 222,
          },
          {
            protocol: TargetSetPortProtocol.TCPorUDP,
            min: 5060,
          },
          {
            protocol: TargetSetPortProtocol.UDP,
            min: 1222,
            max: 1333,
          },
        ],
      },

      {
        addressSet: ['jirasx.rim.net', 'wikisx.rim.net', 'wikitest.rim.net'],
        portSet: [
          {
            protocol: TargetSetPortProtocol.TCP,
            min: 15,
            max: 33,
          },
          {
            protocol: TargetSetPortProtocol.UDP,
            min: 1111,
            max: 1222,
          },
        ],
      },
    ],
    networkServices: [
      { id: '123dea75-g123-47i5-b93u-8524a66u209z', name: 'Google' },
      { id: '667dea75-g123-47i5-b34u-2978a66u989d', name: 'blackberrysquare' },
    ],
  },
  {
    id: '667dea75-g123-47i5-b34u-2978a66u989d',
    name: 'blackberrysquare',
    metadata: {
      description: 'Blackberrysquare Network Service',
    },
    tenantId: 'L75473134',
    targetSet: [
      {
        addressSet: ['blackberrysquare.rim.net', '10.0.0.0/20'],
        portSet: [],
      },
    ],
  },
  {
    id: '667dea75-g123-47i5-b34u-9878a66u989e',
    name: 'GIT',
    tenantId: 'L75473134',
    targetSet: [
      {
        addressSet: ['gitlab.rim.net', 'gerrit.rim.net', 'enterprise-gerrit.rim.net', '10.1.1.0/20'],
        portSet: [],
      },
    ],
    networkServices: [{ id: '123dea75-g123-47i5-b93u-8524a66u209z', name: 'Google' }],
  },
  {
    id: '667dea75-g123-47i5-b34u-9518a66u989x',
    name: 'RIMNET',
    tenantId: 'L75473134',
    targetSet: [
      {
        addressSet: [
          '*.rim.net',
          'private1.big.com',
          'private2.big.com',
          'private3.big.com',
          'private4.big.com',
          'private5.big.com',
          '10.0.0.0/10',
        ],
        portSet: [],
      },
    ],
    networkServices: [{ id: 's123dea75-g483-47i5-b93u-2914a66u209t', name: 'WebEx' }],
  },
]

export const networkServicesMock: PagableResponse<NetworkServiceEntity> = {
  totals: {
    pages: 1,
    elements: networkServices.length,
  },
  navigation: {
    next: 'next',
    previous: 'prev',
  },
  count: networkServices.length,
  elements: networkServices,
}

const networkServicesNames = networkServices.map(networkService => networkService.name)

class NetworkServicesClass implements NetworkServicesInterface {
  create(_tenantId: string, networkServiceConfig: NetworkServiceEntity): Response<{ id: string }> {
    const id = uuidv4()

    if (networkServicesNames.includes(networkServiceConfig.name)) {
      return Promise.reject({
        response: {
          status: httpStatus.BAD_REQUEST,
          data: { error: RequestError.NameAlreadyUsed },
        },
      })
    }

    return Promise.resolve({ data: { id } })
  }

  readOne(_tenantId: string, networkServiceId: string): Response<NetworkServiceEntity> {
    const networkService = networkServices.filter(item => item.id === networkServiceId)[0]
    return Promise.resolve({ data: networkService })
  }

  read(_tenantId: string): Response<PagableResponse<NetworkServiceEntity>> {
    return Promise.resolve({ data: networkServicesMock })
  }

  update(_tenantId: string, networkServiceId: string, networkServiceConfig: NetworkServiceEntity): Response {
    if (
      networkServiceId === '667dea75-g123-47i5-b34u-9518a66u989x' ||
      networkServiceId === '123dea75-g123-47i5-b93u-2914a66u209x'
    ) {
      return Promise.reject({
        response: {
          status: httpStatus.CONFLICT,
        },
      })
    }

    const networkService = networkServices.find(item => item.id === networkServiceId)

    if (networkServiceConfig.name !== networkService.name && networkServicesNames.includes(networkServiceConfig.name)) {
      return Promise.reject({
        response: {
          status: httpStatus.BAD_REQUEST,
          data: { error: RequestError.NameAlreadyUsed },
        },
      })
    }

    return Promise.resolve({})
  }

  remove(_tenantId: string, networkServiceId: string): Response {
    // Trigger the Social media and RIMNET network service to fail
    // as its in a policy.
    if (
      networkServiceId === '667dea75-g123-47i5-b34u-9518a66u989x' ||
      networkServiceId === '123dea75-g123-47i5-b93u-2914a66u209x'
    ) {
      return Promise.reject({
        response: {
          status: httpStatus.CONFLICT,
          data: {
            data: {
              committedRules: [{ name: 'Network Access Control 2', id: 'e9a2b066-d37c-4890-94c0-7953e717e6367' }],
            },
          },
        },
      })
    }

    // Trigger the Google network service to fail as its referenced by Atlassian and GIT network services
    if (networkServiceId === '123dea75-g123-47i5-b93u-8524a66u209z') {
      return Promise.reject({
        response: {
          status: 409,
          data: {
            data: {
              networkServices: [
                { name: 'Atlassian', id: '667dea75-g123-47i5-b34u-2125a66u989c' },
                { name: 'GIT', id: '667dea75-g123-47i5-b34u-9878a66u989e' },
              ],
            },
          },
        },
      })
    }

    return Promise.resolve({})
  }
}

const NetworkServicesMock = new NetworkServicesClass()

export { NetworkServicesMock }
