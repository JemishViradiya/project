//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable sonarjs/no-duplicate-string */

import { v4 as uuidv4 } from 'uuid'

import { Interaction, Matchers } from '@pact-foundation/pact'

import {
  AUTHORIZATION_TOKEN_MOCK,
  dataEntityProvider,
  DLP_DATA_ENTITY_PACT_CONSUMER_NAME,
  DLP_DATA_ENTITY_PACT_PROVIDER_NAME,
  HTTP_STATUS_CODE_OK,
  HTTP_STATUS_CREATED,
} from '../config.pact'
import { DataEntitiesApi, makeDataEntityUrl } from './data-entities'
import { dataEntitiesResponse, mockedDataEntities } from './data-entities-mock'
import type { AssociateDataEntities } from './data-entities-types'

jest.mock('../config.rest', () => jest.requireActual('../config.pact').mockedAxiosConfig('dataEntityProvider'))

const DATA_ENTITY_MOCK = mockedDataEntities[0]

describe(`${DLP_DATA_ENTITY_PACT_CONSUMER_NAME}-${DLP_DATA_ENTITY_PACT_PROVIDER_NAME} tenants pact`, () => {
  beforeAll(async () => await dataEntityProvider.setup())

  afterAll(async () => await dataEntityProvider.finalize())

  describe('create a dataEntity', () => {
    const request = DATA_ENTITY_MOCK
    request.guid = null

    const expectedResponse = request
    expectedResponse.guid = uuidv4()

    beforeAll(() => {
      const interaction = new Interaction()
        .given('a data for a dataEntity')
        .uponReceiving('a request to create a dataEntity')
        .withRequest({
          method: 'POST',
          path: makeDataEntityUrl(),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Type': Matchers.like('application/json'),
          },
          body: request,
        })
        .willRespondWith({
          status: HTTP_STATUS_CREATED,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(expectedResponse),
        })

      return dataEntityProvider.addInteraction(interaction)
    })

    afterAll(() => dataEntityProvider.verify())

    it('should create a dataEntity', async () => {
      const response = await DataEntitiesApi.create(request)

      expect(response.data).toEqual(expectedResponse)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('associate dataEntity', () => {
    const dataEntityGuids = mockedDataEntities.map(template => template.guid)
    beforeAll(() => {
      const associateTemplates: AssociateDataEntities = {
        add: dataEntityGuids,
      }
      const interaction = new Interaction()
        .given(`a dataEntity guids ${dataEntityGuids}`)
        .uponReceiving('a request to associate templates')
        .withRequest({
          method: 'PATCH',
          path: makeDataEntityUrl(),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
          body: associateTemplates,
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
        })

      return dataEntityProvider.addInteraction(interaction)
    })

    afterAll(() => dataEntityProvider.verify())

    it('should associate templates', async () => {
      const response = await DataEntitiesApi.associateDataEntity(dataEntityGuids)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('get a single dataEntity', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a dataEntity ID ${DATA_ENTITY_MOCK.guid}`)
        .uponReceiving('a request to get a dataEntity')
        .withRequest({
          method: 'GET',
          path: makeDataEntityUrl(DATA_ENTITY_MOCK.guid),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(DATA_ENTITY_MOCK),
        })

      return dataEntityProvider.addInteraction(interaction)
    })

    afterAll(() => dataEntityProvider.verify())

    it('should get a dataEntity', async () => {
      const response = await DataEntitiesApi.read(DATA_ENTITY_MOCK.guid)

      expect(response.data).toEqual(DATA_ENTITY_MOCK)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('get a dataEntities', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a dataEntities`)
        .uponReceiving('a request to get a dataEntities')
        .withRequest({
          method: 'GET',
          path: makeDataEntityUrl(),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(dataEntitiesResponse),
        })

      return dataEntityProvider.addInteraction(interaction)
    })

    afterAll(() => dataEntityProvider.verify())

    it('should get a dataEntities', async () => {
      const response = await DataEntitiesApi.readAll()
      console.log('should get a dataEntities data = ', dataEntitiesResponse)
      expect(response.data).toEqual(dataEntitiesResponse)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('get an associated dataEntities', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a dataEntities`)
        .uponReceiving('a request to get an associated dataEntities')
        .withRequest({
          method: 'GET',
          path: makeDataEntityUrl('byTenant'),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(dataEntitiesResponse),
        })

      return dataEntityProvider.addInteraction(interaction)
    })

    afterAll(() => dataEntityProvider.verify())

    it('should get an associated dataEntities', async () => {
      const response = await DataEntitiesApi.readAll()
      console.log('should get an associated dataEntities data = ', dataEntitiesResponse)
      expect(response.data).toEqual(dataEntitiesResponse)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('get a dataEntities by guids', () => {
    const dataEntityGuids: string[] = mockedDataEntities.map(element => element.guid)
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a dataEntities by guids`)
        .uponReceiving('a request to get a dataEntities by guids')
        .withRequest({
          method: 'POST',
          path: makeDataEntityUrl('byGuids'),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(dataEntitiesResponse),
        })

      return dataEntityProvider.addInteraction(interaction)
    })

    afterAll(() => dataEntityProvider.verify())

    it('should get a dataEntities', async () => {
      const response = await DataEntitiesApi.readAllByGuids(dataEntityGuids)
      console.log('should get a dataEntities data = ', dataEntitiesResponse)
      expect(response.data).toEqual(dataEntitiesResponse)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('update a dataEntity', () => {
    const payload = {
      ...DATA_ENTITY_MOCK,
      name: 'Updated DataEntity name',
      description: 'Updated DataEntity description',
    }

    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a dataEntity with ID ${DATA_ENTITY_MOCK.guid}`)
        .uponReceiving('a request to update a dataEntity')
        .withRequest({
          method: 'PUT',
          path: makeDataEntityUrl(DATA_ENTITY_MOCK.guid),
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

      return dataEntityProvider.addInteraction(interaction)
    })

    afterAll(() => dataEntityProvider.verify())

    it('should update a dataEntity', async () => {
      const response = await DataEntitiesApi.update(payload)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('delete a dataEntity', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a dataEntity ID ${DATA_ENTITY_MOCK.guid}`)
        .uponReceiving('a request to delete a dataEntity')
        .withRequest({
          method: 'DELETE',
          path: makeDataEntityUrl(DATA_ENTITY_MOCK.guid),
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

      return dataEntityProvider.addInteraction(interaction)
    })

    afterAll(() => dataEntityProvider.verify())

    it('should delete a dataEntity', async () => {
      const response = await DataEntitiesApi.remove(DATA_ENTITY_MOCK.guid)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })
})
