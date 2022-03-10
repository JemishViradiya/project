//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable sonarjs/no-duplicate-string, sonarjs/no-identical-functions */

import { Interaction, Matchers } from '@pact-foundation/pact'

import { ReconciliationEntityType } from '@ues-data/shared-types'

import {
  AUTHORIZATION_TOKEN_MOCK,
  BIG_CONSUMER_NAME,
  BIG_POLICY_SERVICE_PROVIDER_NAME,
  HTTP_STATUS_CODE_OK,
  policyProvider,
  TENANT_ID_MOCK,
} from '../config.pact'
import { makePoliciesEndpoint, Policies } from './policies'
import { gatewayAppPolicyMock, networkAccessControlPolicyMock } from './policies-mock'
import { PlatformAccessControlType } from './policies-types'

jest.mock('../config.rest', () => jest.requireActual('../config.pact').mockedAxiosConfig('policyProvider'))

describe(`${BIG_CONSUMER_NAME}-${BIG_POLICY_SERVICE_PROVIDER_NAME} policies pact`, () => {
  beforeAll(async () => await policyProvider.setup())

  afterAll(async () => await policyProvider.finalize())

  describe(`get a ${ReconciliationEntityType.NetworkAccessControl} policy`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a ${ReconciliationEntityType.NetworkAccessControl} policy with ID ${networkAccessControlPolicyMock[0].id} exists`)
        .uponReceiving('a request to get a policy')
        .withRequest({
          method: 'GET',
          path: makePoliciesEndpoint(TENANT_ID_MOCK, networkAccessControlPolicyMock[0].id),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(networkAccessControlPolicyMock[0]),
        })

      return policyProvider.addInteraction(interaction)
    })

    afterAll(() => policyProvider.verify())

    it('should get a policy', async () => {
      const response = await Policies.readOne(
        TENANT_ID_MOCK,
        networkAccessControlPolicyMock[0].id,
        ReconciliationEntityType.NetworkAccessControl,
      )

      expect(response.data).toEqual(networkAccessControlPolicyMock[0])
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe(`create a ${ReconciliationEntityType.NetworkAccessControl} policy`, () => {
    const payload = {
      name: 'Network Access Control 1',
      entityType: ReconciliationEntityType.NetworkAccessControl,
    }
    const expectedResponse = {
      entityId: 'e9a2b066-d37c-4890-94c0-7953e717e635',
    }

    beforeAll(() => {
      const interaction = new Interaction()
        .given(`data for a ${ReconciliationEntityType.NetworkAccessControl} policy creation`)
        .uponReceiving('a request to create a policy')
        .withRequest({
          method: 'POST',
          path: makePoliciesEndpoint(TENANT_ID_MOCK),
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

    it(`should create a ${ReconciliationEntityType.NetworkAccessControl} policy`, async () => {
      const response = await Policies.create(TENANT_ID_MOCK, payload)

      expect(response.data).toEqual(expectedResponse)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe(`update a ${ReconciliationEntityType.NetworkAccessControl} policy`, () => {
    const payload = {
      ...networkAccessControlPolicyMock[0],
      name: 'Updated Policy name',
      description: 'Updated Policy description',
      allowed: {
        fqdns: ['*.blackberry.com'],
        ipRanges: ['10.0.0.0/24'],
      },
      blocked: {
        fqdns: ['www.yahoo.com', 'www.google.com'],
        ipRanges: ['3.11.0.0/24'],
      },
    }

    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a ${ReconciliationEntityType.NetworkAccessControl} policy with ID ${networkAccessControlPolicyMock[0].id} exists`)
        .uponReceiving('a request to update a policy')
        .withRequest({
          method: 'PUT',
          path: makePoliciesEndpoint(TENANT_ID_MOCK, networkAccessControlPolicyMock[0].id),
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

    it(`should update a ${ReconciliationEntityType.NetworkAccessControl} policy`, async () => {
      const response = await Policies.update(TENANT_ID_MOCK, networkAccessControlPolicyMock[0].id, payload)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe(`delete a ${ReconciliationEntityType.NetworkAccessControl} policy`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a ${ReconciliationEntityType.NetworkAccessControl} policy with ID ${networkAccessControlPolicyMock[0].id} exists`)
        .uponReceiving('a request to delete a policy')
        .withRequest({
          method: 'DELETE',
          path: makePoliciesEndpoint(TENANT_ID_MOCK, networkAccessControlPolicyMock[0].id),
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

    it('should delete a policy', async () => {
      const response = await Policies.remove(TENANT_ID_MOCK, networkAccessControlPolicyMock[0].id)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe(`get a ${ReconciliationEntityType.GatewayApp} policy`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a ${ReconciliationEntityType.GatewayApp} policy with ID ${gatewayAppPolicyMock[0].id} exists`)
        .uponReceiving('a request to get a policy')
        .withRequest({
          method: 'GET',
          path: makePoliciesEndpoint(TENANT_ID_MOCK, gatewayAppPolicyMock[0].id),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(gatewayAppPolicyMock[0]),
        })

      return policyProvider.addInteraction(interaction)
    })

    afterAll(() => policyProvider.verify())

    it('should get a policy', async () => {
      const response = await Policies.readOne(
        TENANT_ID_MOCK,
        gatewayAppPolicyMock[0].id,
        ReconciliationEntityType.NetworkAccessControl,
      )

      expect(response.data).toEqual(gatewayAppPolicyMock[0])
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe(`create a ${ReconciliationEntityType.GatewayApp} policy`, () => {
    const payload = {
      name: 'GatewayApp Policy 1',
      entityType: ReconciliationEntityType.GatewayApp,
    }
    const expectedResponse = {
      entityId: 'e3a2b057-a31c-3431-94c0-5653e457e945',
    }

    beforeAll(() => {
      const interaction = new Interaction()
        .given(`data for a ${ReconciliationEntityType.GatewayApp} policy creation`)
        .uponReceiving('a request to create a policy')
        .withRequest({
          method: 'POST',
          path: makePoliciesEndpoint(TENANT_ID_MOCK),
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

    it(`should create a ${ReconciliationEntityType.GatewayApp} policy`, async () => {
      const response = await Policies.create(TENANT_ID_MOCK, payload)

      expect(response.data).toEqual(expectedResponse)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe(`update a ${ReconciliationEntityType.GatewayApp} policy`, () => {
    const payload = {
      ...gatewayAppPolicyMock[0],
      name: 'Updated Policy name',
      description: 'Updated Policy description',
      platforms: {
        Android: {
          perAppVpn: {
            type: PlatformAccessControlType.Exclusive,
            appIds: ['com.blackberry.foo', 'com.blackberry.bar', 'com.blackberry.big'],
          },
        },
        splitTunnelEnabled: true,
        splitIpRanges: ['17.17.0.3-17.17.0.50', '18.18.0.3-18.18.0.50'],
      },
    }

    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a ${ReconciliationEntityType.GatewayApp} policy with ID ${gatewayAppPolicyMock[0].id} exists`)
        .uponReceiving('a request to update a policy')
        .withRequest({
          method: 'PUT',
          path: makePoliciesEndpoint(TENANT_ID_MOCK, gatewayAppPolicyMock[0].id),
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

    it(`should update a ${ReconciliationEntityType.GatewayApp} policy`, async () => {
      const response = await Policies.update(TENANT_ID_MOCK, gatewayAppPolicyMock[0].id, payload)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe(`delete a ${ReconciliationEntityType.GatewayApp} policy`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a ${ReconciliationEntityType.GatewayApp} policy with ID ${gatewayAppPolicyMock[0].id} exists`)
        .uponReceiving('a request to delete a policy')
        .withRequest({
          method: 'DELETE',
          path: makePoliciesEndpoint(TENANT_ID_MOCK, gatewayAppPolicyMock[0].id),
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

    it(`should delete a ${ReconciliationEntityType.GatewayApp} policy`, async () => {
      const response = await Policies.remove(TENANT_ID_MOCK, gatewayAppPolicyMock[0].id)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('delete many policies', () => {
    const policiesIDs = ['1234', '2345', '3456']

    beforeAll(() => {
      const interaction = new Interaction()
        .given(`policies with IDs ${policiesIDs.join(' ,')} exist`)
        .uponReceiving('a request to delete many policies')
        .withRequest({
          method: 'POST',
          path: `${makePoliciesEndpoint(TENANT_ID_MOCK)}/delete`,
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Type': Matchers.like('application/json'),
          },
          body: policiesIDs,
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

    it('should delete many policies', async () => {
      const response = await Policies.removeMany(TENANT_ID_MOCK, policiesIDs)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })
})
