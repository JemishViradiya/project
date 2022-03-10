//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable sonarjs/no-duplicate-string */
import { Interaction, Matchers } from '@pact-foundation/pact'

import {
  AUTHORIZATION_TOKEN_MOCK,
  BIG_CONSUMER_NAME,
  BIG_TENANT_SERVICE_PROVIDER_NAME,
  HTTP_STATUS_CODE_OK,
  TENANT_ID_MOCK,
  tenantProvider,
} from '../config.pact'
import { makeTenantConfigEndpoint, makeTenantHealthEndpoint, Tenants } from './tenants'
import { tenantConfigurationMock, tenantHealthMock } from './tenants-mock'

jest.mock('../config.rest', () => jest.requireActual('../config.pact').mockedAxiosConfig('tenantProvider'))

describe(`${BIG_CONSUMER_NAME}-${BIG_TENANT_SERVICE_PROVIDER_NAME} tenants pact`, () => {
  beforeAll(async () => await tenantProvider.setup())

  afterAll(async () => await tenantProvider.finalize())

  describe('get a tenant configuration', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a tenant`)
        .uponReceiving('a request to get the tenant configuration')
        .withRequest({
          method: 'GET',
          path: makeTenantConfigEndpoint(TENANT_ID_MOCK),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(tenantConfigurationMock),
        })

      return tenantProvider.addInteraction(interaction)
    })

    afterAll(() => tenantProvider.verify())

    it('should get a tenant configuration', async () => {
      const response = await Tenants.readConfig(TENANT_ID_MOCK)

      expect(response.data).toEqual(tenantConfigurationMock)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('update a tenant configuration', () => {
    const updatedTenantConfigurationData = {
      ...tenantConfigurationMock,
      privateDnsSuffixEnabled: false,
      healthCheckUrl: 'https://test.com',
    }

    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a tenant configuration`)
        .uponReceiving('a request to update a tenant configuration')
        .withRequest({
          method: 'PATCH',
          path: makeTenantConfigEndpoint(TENANT_ID_MOCK),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Type': Matchers.like('application/json'),
          },
          body: updatedTenantConfigurationData,
        })
        .willRespondWith({ status: HTTP_STATUS_CODE_OK })

      return tenantProvider.addInteraction(interaction)
    })

    afterAll(() => tenantProvider.verify())

    it('should update a tenant configuration', async () => {
      const response = await Tenants.updateConfig(TENANT_ID_MOCK, updatedTenantConfigurationData)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('get a tenant health', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a tenant health`)
        .uponReceiving('a request to get a tenant health')
        .withRequest({
          method: 'GET',
          path: makeTenantHealthEndpoint(TENANT_ID_MOCK),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(tenantHealthMock),
        })

      return tenantProvider.addInteraction(interaction)
    })

    afterAll(() => tenantProvider.verify())

    it('should get a tenant health', async () => {
      const response = await Tenants.readHealth(TENANT_ID_MOCK)

      expect(response.data).toEqual(tenantHealthMock)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })
})
