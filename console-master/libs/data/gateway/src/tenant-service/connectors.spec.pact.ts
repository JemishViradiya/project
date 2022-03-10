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
import { Connectors, makeConnectorEndpoint } from './connectors'
import { connectorsMock } from './connectors-mock'

jest.mock('../config.rest', () => jest.requireActual('../config.pact').mockedAxiosConfig('tenantProvider'))

const CONNECTOR_MOCK = connectorsMock[0]
const DELETE_CONNECTOR_HTTP_STATUS_CODE_OK = 204

describe(`${BIG_CONSUMER_NAME}-${BIG_TENANT_SERVICE_PROVIDER_NAME} tenants pact`, () => {
  beforeAll(async () => await tenantProvider.setup())

  afterAll(async () => await tenantProvider.finalize())

  describe('get a connectors', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a list of connectors`)
        .uponReceiving('a request to get a list of connectors')
        .withRequest({
          method: 'GET',
          path: makeConnectorEndpoint(TENANT_ID_MOCK),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(connectorsMock),
        })

      return tenantProvider.addInteraction(interaction)
    })

    afterAll(() => tenantProvider.verify())

    it('should get a connectors', async () => {
      const response = await Connectors.read(TENANT_ID_MOCK)

      expect(response.data).toEqual(connectorsMock)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('get a single connector', () => {
    const { connectorId } = CONNECTOR_MOCK

    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a connector ID ${connectorId}`)
        .uponReceiving('a request to get a connector')
        .withRequest({
          method: 'GET',
          path: makeConnectorEndpoint(TENANT_ID_MOCK, connectorId),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(CONNECTOR_MOCK),
        })

      return tenantProvider.addInteraction(interaction)
    })

    afterAll(() => tenantProvider.verify())

    it('should get a connector', async () => {
      const response = await Connectors.read(TENANT_ID_MOCK, connectorId)

      expect(response.data).toEqual(CONNECTOR_MOCK)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('create a connector', () => {
    const expectedResponse = {
      connectorId: CONNECTOR_MOCK.connectorId,
    }

    beforeAll(() => {
      const interaction = new Interaction()
        .given('a data for a connector')
        .uponReceiving('a request to create a connector')
        .withRequest({
          method: 'POST',
          path: makeConnectorEndpoint(TENANT_ID_MOCK),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Type': Matchers.like('application/json'),
          },
          body: CONNECTOR_MOCK,
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(expectedResponse),
        })

      return tenantProvider.addInteraction(interaction)
    })

    afterAll(() => tenantProvider.verify())

    it('should create a connector', async () => {
      const response = await Connectors.create(TENANT_ID_MOCK, CONNECTOR_MOCK)

      expect(response.data).toEqual(expectedResponse)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('update a connector', () => {
    const { connectorId } = CONNECTOR_MOCK

    const payload = {
      ...CONNECTOR_MOCK,
      name: 'Updated Connector name',
      privateUrl: 'https://updated.url.com',
      maintenanceRequired: true,
    }

    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a connector with ID ${connectorId}`)
        .uponReceiving('a request to update a connector')
        .withRequest({
          method: 'PUT',
          path: makeConnectorEndpoint(TENANT_ID_MOCK, connectorId),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Type': Matchers.like('application/json'),
          },
          body: payload,
        })
        .willRespondWith({ status: HTTP_STATUS_CODE_OK })

      return tenantProvider.addInteraction(interaction)
    })

    afterAll(() => tenantProvider.verify())

    it('should update a connector', async () => {
      const response = await Connectors.update(TENANT_ID_MOCK, connectorId, payload)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('delete a connector', () => {
    const { connectorId } = CONNECTOR_MOCK

    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a connector ID ${connectorId}`)
        .uponReceiving('a request to delete a connector')
        .withRequest({
          method: 'DELETE',
          path: makeConnectorEndpoint(TENANT_ID_MOCK, connectorId),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: DELETE_CONNECTOR_HTTP_STATUS_CODE_OK,
        })

      return tenantProvider.addInteraction(interaction)
    })

    afterAll(() => tenantProvider.verify())

    it('should delete a connector', async () => {
      const response = await Connectors.remove(TENANT_ID_MOCK, connectorId)

      expect(response.status).toEqual(DELETE_CONNECTOR_HTTP_STATUS_CODE_OK)
    })
  })

  describe('get a connector public keys', () => {
    const { connectorId } = CONNECTOR_MOCK
    const keyId = 'keyId'

    const expectedResponse = {
      kty: 'kty-value',
      kid: 'kid-value',
      crv: 'crv-value',
      x: 'x-value',
      y: 'y-value',
    }

    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a connector with ID ${connectorId} and keyId ${keyId}`)
        .uponReceiving('a request to get a connector public keys')
        .withRequest({
          method: 'GET',
          path: `${makeConnectorEndpoint(TENANT_ID_MOCK, connectorId)}/keys/${keyId}`,
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(expectedResponse),
        })

      return tenantProvider.addInteraction(interaction)
    })

    afterAll(() => tenantProvider.verify())

    it('should get a connector public keys', async () => {
      const response = await Connectors.getConnectorPublicKeys(TENANT_ID_MOCK, connectorId, keyId)

      expect(response.data).toEqual(expectedResponse)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })
})
