//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable sonarjs/no-duplicate-string */

import { Interaction, Matchers } from '@pact-foundation/pact'

import {
  AUTHORIZATION_TOKEN_MOCK,
  DLP_TENANT_CONFIGS_PACT_CONSUMER_NAME,
  DLP_TENANT_CONFIGS_PACT_PROVIDER_NAME,
  HTTP_STATUS_CODE_OK,
  tenantConfigsProvider,
} from '../config.pact'
import { mockTenantConfigs } from './configs-mock'
import { CONFIG_KEY } from './configs-types'
import { makeTenantConfigsUrl, TenantConfigsApi } from './tenant-configs'

jest.mock('../config.rest', () => jest.requireActual('../config.pact').mockedAxiosConfig('tenantConfigsProvider'))

describe(`${DLP_TENANT_CONFIGS_PACT_CONSUMER_NAME}-${DLP_TENANT_CONFIGS_PACT_PROVIDER_NAME} tenants pact`, () => {
  beforeAll(async () => await tenantConfigsProvider.setup())

  afterAll(async () => await tenantConfigsProvider.finalize())

  describe('get Tenant configs', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`tenant configs`)
        .uponReceiving('a request to get all tenant configs')
        .withRequest({
          method: 'GET',
          path: makeTenantConfigsUrl(),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(mockTenantConfigs),
        })

      return tenantConfigsProvider.addInteraction(interaction)
    })

    afterAll(() => tenantConfigsProvider.verify())

    it('should get all Tenant configs', async () => {
      const response = await TenantConfigsApi.readAll()
      console.log('should get Tenant configs data = ', mockTenantConfigs)
      expect(response.data).toEqual(mockTenantConfigs)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('update Tenant configs', () => {
    const payload = {
      ...mockTenantConfigs,
      name: 'Update tenant configs',
    }

    beforeAll(() => {
      const interaction = new Interaction()
        .uponReceiving('a request to update tenant configs ')
        .withRequest({
          method: 'PATCH',
          path: makeTenantConfigsUrl(),
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

      return tenantConfigsProvider.addInteraction(interaction)
    })

    afterAll(() => tenantConfigsProvider.verify())

    it('should update tenant configs', async () => {
      const response = await TenantConfigsApi.update(payload)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })
})
