//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable sonarjs/no-duplicate-string */

import { BAD_REQUEST, CONFLICT } from 'http-status-codes'
import { v4 as uuidv4 } from 'uuid'

import type { Response } from '@ues-data/shared-types'

import { RequestError } from '../../common-types'
import type NetworkServicesInterface from './network-services-interface'
import type { NetworkServiceEntity } from './network-services-types'

export const networkServicesMock: NetworkServiceEntity[] = [
  {
    id: 's380dea71-e423-47b5-b93c-2934a66f209c',
    name: 'Office 365',
    tenantId: 'system',
    fqdns: [
      'outlook.office.com',
      'outlook1.office.com',
      'outlook2.office.com',
      'outlook3.office.com',
      'outlook4.office.com',
      'outlook5.office.com',
    ],
    ipRanges: ['10.0.0.0/24', '127.0.0.1'],
  },
  {
    id: 's480dea71-g423-47b5-b93c-2934a66h209h',
    name: 'Saleforce',
    tenantId: 'system',
    fqdns: ['saleforce.saleforce.com', 'saleforce.saleforce1.com', 'saleforce.saleforce2.com', 'saleforce.saleforce3.com'],
    ipRanges: ['10.1.0.5/20'],
  },
  {
    id: 's123dea75-g483-47i5-b93u-2914a66u209t',
    name: 'WebEx',
    tenantId: 'system',
    fqdns: ['webex.webex.com', 'webex.webex.net', 'webex1.webex.net', 'webex2.webex.net', 'webex3.webex.net', 'webex4.webex.net'],
    ipRanges: ['10.0.0.5/15'],
  },
  {
    id: '123dea75-g123-47i5-b93u-2914a66u209x',
    name: 'Social media',
    tenantId: 'L75473134',
    fqdns: ['facebook.com', 'instagram.com', 'whatsapp.com', 'twitter.com', 'linkedin.com'],
    ipRanges: ['10.0.0.1/15'],
  },
  {
    id: '123dea75-g123-47i5-b93u-8524a66u209z',
    name: 'Google',
    tenantId: 'L75473134',
    fqdns: ['*.google.com', '*.google.ca'],
    ipRanges: ['10.0.0.1/15'],
  },
  {
    id: '667dea75-g123-47i5-b34u-2125a66u989c',
    name: 'Atlassian',
    tenantId: 'L75473134',
    fqdns: ['jirasd.rim.net', 'wikis.rim.net'],
    ipRanges: [],
  },
  {
    id: '667dea75-g123-47i5-b34u-2978a66u989d',
    name: 'blackberrysquare',
    tenantId: 'L75473134',
    fqdns: ['blackberrysquare.rim.net'],
    ipRanges: ['10.0.0.0/20'],
  },
  {
    id: '667dea75-g123-47i5-b34u-9878a66u989e',
    name: 'GIT',
    tenantId: 'L75473134',
    fqdns: ['gitlab.rim.net', 'gerrit.rim.net', 'enterprise-gerrit.rim.net'],
    ipRanges: ['10.1.1.0/20'],
  },
  {
    id: '667dea75-g123-47i5-b34u-9518a66u989x',
    name: 'RIMNET',
    tenantId: 'L75473134',
    fqdns: ['*.rim.net', 'private1.big.com', 'private2.big.com', 'private3.big.com', 'private4.big.com', 'private5.big.com'],
    ipRanges: ['10.0.0.0/10'],
  },
]

const networkServicesNames = networkServicesMock.map(networkService => networkService.name)

class NetworkServicesClass implements NetworkServicesInterface {
  create(_tenantId: string, networkServiceConfig: NetworkServiceEntity): Response<{ id: string }> {
    const id = uuidv4()

    if (networkServicesNames.includes(networkServiceConfig.name)) {
      return Promise.reject({
        response: {
          status: BAD_REQUEST,
          data: { error: RequestError.NameAlreadyUsed },
        },
      })
    }

    return Promise.resolve({ data: { id } })
  }

  read(_tenantId: string, networkServiceId?: string): Response<NetworkServiceEntity | NetworkServiceEntity[]> {
    if (networkServiceId) {
      const networkService = networkServicesMock.filter(item => item.id === networkServiceId)
      return Promise.resolve({ data: networkService })
    }

    return Promise.resolve({ data: networkServicesMock })
  }

  update(_tenantId: string, networkServiceId: string, networkServiceConfig: NetworkServiceEntity): Response {
    const networkService = networkServicesMock.find(item => item.id === networkServiceId)

    if (networkServiceConfig.name !== networkService.name && networkServicesNames.includes(networkServiceConfig.name)) {
      return Promise.reject({
        response: {
          status: BAD_REQUEST,
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
          status: CONFLICT,
          data: {
            data: [{ name: 'Network Access Control 2', id: 'e9a2b066-d37c-4890-94c0-7953e717e6367' }],
          },
        },
      })
    }
    return Promise.resolve({})
  }
}

const NetworkServicesMock = new NetworkServicesClass()

export { NetworkServicesMock }
