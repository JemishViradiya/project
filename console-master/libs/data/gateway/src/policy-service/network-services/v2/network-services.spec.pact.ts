//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable sonarjs/no-duplicate-string */

import { Interaction, Matchers } from '@pact-foundation/pact'

import {
  AUTHORIZATION_TOKEN_MOCK,
  BIG_CONSUMER_NAME,
  BIG_POLICY_SERVICE_PROVIDER_NAME,
  HTTP_STATUS_CODE_OK,
  policyProvider,
  TENANT_ID_MOCK,
} from '../../../config.pact'
import { makeNetworkServicesEndpoint, NetworkServices } from './network-services'
import { networkServicesMock } from './network-services-mock'

export const NETWORK_SERVICE_MOCK = networkServicesMock[0]

jest.mock('../../../config.rest', () => jest.requireActual('../../../config.pact').mockedAxiosConfig('policyProvider'))

describe(`${BIG_CONSUMER_NAME}-${BIG_POLICY_SERVICE_PROVIDER_NAME} network services pact`, () => {
  beforeAll(async () => await policyProvider.setup())

  afterAll(async () => await policyProvider.finalize())

  describe('get a list of network services', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a list of network services exists`)
        .uponReceiving('a request to get a list of network services')
        .withRequest({
          method: 'GET',
          path: makeNetworkServicesEndpoint(TENANT_ID_MOCK),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(networkServicesMock),
        })

      return policyProvider.addInteraction(interaction)
    })

    afterAll(() => policyProvider.verify())

    it('should get a list of network services', async () => {
      const response = await NetworkServices.read(TENANT_ID_MOCK)

      expect(response.data).toEqual(networkServicesMock)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('get a network service', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a network service with ID ${NETWORK_SERVICE_MOCK.id} exists`)
        .uponReceiving('a request to get a network service')
        .withRequest({
          method: 'GET',
          path: makeNetworkServicesEndpoint(TENANT_ID_MOCK, NETWORK_SERVICE_MOCK.id),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(NETWORK_SERVICE_MOCK),
        })

      return policyProvider.addInteraction(interaction)
    })

    afterAll(() => policyProvider.verify())

    it('should get a network service', async () => {
      const response = await NetworkServices.read(TENANT_ID_MOCK, NETWORK_SERVICE_MOCK.id)

      expect(response.data).toEqual(NETWORK_SERVICE_MOCK)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('create a network service', () => {
    const payload = {
      name: 'Created Policy name',
    }
    const expectedResponse = {
      id: 'e9a2b066-d37c-4890-94c0-7953e717e635',
    }

    beforeAll(() => {
      const interaction = new Interaction()
        .given(`data for a network service creation`)
        .uponReceiving('a request to create a network service')
        .withRequest({
          method: 'POST',
          path: makeNetworkServicesEndpoint(TENANT_ID_MOCK),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Type': Matchers.like('application/json'),
          },
          body: payload,
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(expectedResponse),
        })

      return policyProvider.addInteraction(interaction)
    })

    afterAll(() => policyProvider.verify())

    it('should create a network service', async () => {
      const response = await NetworkServices.create(TENANT_ID_MOCK, payload)

      expect(response.data).toEqual(expectedResponse)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('update a network service', () => {
    const payload = {
      ...NETWORK_SERVICE_MOCK,
      name: 'New Network Service mock',
    }

    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a network service with ID ${NETWORK_SERVICE_MOCK.id} exists`)
        .uponReceiving('a request to update a network service')
        .withRequest({
          method: 'PUT',
          path: makeNetworkServicesEndpoint(TENANT_ID_MOCK, NETWORK_SERVICE_MOCK.id),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Type': Matchers.like('application/json'),
          },
          body: payload,
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
        })

      return policyProvider.addInteraction(interaction)
    })

    afterAll(() => policyProvider.verify())

    it('should update a network service', async () => {
      const response = await NetworkServices.update(TENANT_ID_MOCK, NETWORK_SERVICE_MOCK.id, payload)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('delete a network service', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a network service with ID ${NETWORK_SERVICE_MOCK.id} exists`)
        .uponReceiving('a request to delete a network service')
        .withRequest({
          method: 'DELETE',
          path: makeNetworkServicesEndpoint(TENANT_ID_MOCK, NETWORK_SERVICE_MOCK.id),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
        })

      return policyProvider.addInteraction(interaction)
    })

    afterAll(() => policyProvider.verify())

    it('should delete a network service', async () => {
      const response = await NetworkServices.remove(TENANT_ID_MOCK, NETWORK_SERVICE_MOCK.id)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })
})
