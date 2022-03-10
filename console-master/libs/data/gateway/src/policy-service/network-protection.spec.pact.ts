//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable sonarjs/no-duplicate-string */
import { Interaction, Matchers } from '@pact-foundation/pact'

import {
  AUTHORIZATION_TOKEN_MOCK,
  BIG_CONSUMER_NAME,
  BIG_POLICY_SERVICE_PROVIDER_NAME,
  HTTP_STATUS_CODE_OK,
  policyProvider,
  TENANT_ID_MOCK,
} from '../config.pact'
import { makeNetworkProtectionUrl, NetworkProtection } from './network-protection'
import { networkProtectionConfigMock } from './network-protection-mock'

jest.mock('../config.rest', () => jest.requireActual('../config.pact').mockedAxiosConfig('policyProvider'))

describe(`${BIG_CONSUMER_NAME}-${BIG_POLICY_SERVICE_PROVIDER_NAME} network protection pact`, () => {
  beforeAll(async () => await policyProvider.setup())

  afterAll(async () => await policyProvider.finalize())

  describe('get network protection configuration', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a network protection configuration`)
        .uponReceiving('a request to get a network protection configuration')
        .withRequest({
          method: 'GET',
          path: makeNetworkProtectionUrl(TENANT_ID_MOCK),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(networkProtectionConfigMock),
        })

      return policyProvider.addInteraction(interaction)
    })

    afterAll(() => policyProvider.verify())

    it('should get a network protection configuration', async () => {
      const response = await NetworkProtection.read(TENANT_ID_MOCK)

      expect(response.data).toEqual(networkProtectionConfigMock)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('update the network protection configuration', () => {
    const updatedNetworkProtectionConfigData = {
      ...networkProtectionConfigMock,
      intrusionProtectionEnabled: false,
    }

    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a network protection configuration`)
        .uponReceiving('a request to update the network protection configuration')
        .withRequest({
          method: 'PUT',
          path: makeNetworkProtectionUrl(TENANT_ID_MOCK),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Type': Matchers.like('application/json'),
          },
          body: updatedNetworkProtectionConfigData,
        })
        .willRespondWith({ status: HTTP_STATUS_CODE_OK })

      return policyProvider.addInteraction(interaction)
    })

    afterAll(() => policyProvider.verify())

    it('should update a network protection configuration', async () => {
      const response = await NetworkProtection.update(TENANT_ID_MOCK, updatedNetworkProtectionConfigData)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })
})
