//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable sonarjs/no-duplicate-string */

import { v4 as uuidv4 } from 'uuid'

import { Interaction, Matchers } from '@pact-foundation/pact'

import {
  AUTHORIZATION_TOKEN_MOCK,
  DLP_BROWSER_DOMAIN_PACT_CONSUMER_NAME,
  DLP_BROWSER_DOMAIN_PACT_PROVIDER_NAME,
  domainProvider,
  HTTP_STATUS_CODE_OK,
  HTTP_STATUS_CREATED,
} from '../config.pact'
import { BrowserDomainApi, makeBrowserDomainUrl } from './domains'
import { browserDomainEntitiesResponse, mockedBrowserDomains, mockedValidationStatusForDomain } from './domains-mock'

jest.mock('../config.rest', () => jest.requireActual('../config.pact').mockedAxiosConfig('domainProvider'))

const DOMAIN_MOCK = mockedBrowserDomains[0]

describe(`${DLP_BROWSER_DOMAIN_PACT_CONSUMER_NAME}-${DLP_BROWSER_DOMAIN_PACT_PROVIDER_NAME} tenants pact`, () => {
  beforeAll(async () => await domainProvider.setup())

  afterAll(async () => await domainProvider.finalize())

  describe('get a browserDomains', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a browserDomains`)
        .uponReceiving('a request to get a browserDomains')
        .withRequest({
          method: 'GET',
          path: makeBrowserDomainUrl(),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(browserDomainEntitiesResponse),
        })

      return domainProvider.addInteraction(interaction)
    })

    afterAll(() => domainProvider.verify())

    it('should get a browserDomains', async () => {
      const response = await BrowserDomainApi.readAll()
      console.log('should get a browserDomains data = ', browserDomainEntitiesResponse)
      expect(response.data).toEqual(browserDomainEntitiesResponse)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('get a single browserDomain', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a browserDomain guid ${DOMAIN_MOCK.guid}`)
        .uponReceiving('a request to get a browserDomain')
        .withRequest({
          method: 'GET',
          path: makeBrowserDomainUrl(DOMAIN_MOCK.guid),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(DOMAIN_MOCK),
        })

      return domainProvider.addInteraction(interaction)
    })

    afterAll(() => domainProvider.verify())

    it('should get a browserDomain', async () => {
      const response = await BrowserDomainApi.read(DOMAIN_MOCK.guid)

      expect(response.data).toEqual(DOMAIN_MOCK)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('create a browserDomain', () => {
    const request = DOMAIN_MOCK
    request.guid = null

    const expectedResponse = request
    expectedResponse.guid = uuidv4()

    beforeAll(() => {
      const interaction = new Interaction()
        .given('a data for a browserDomain')
        .uponReceiving('a request to create a browserDomain')
        .withRequest({
          method: 'POST',
          path: makeBrowserDomainUrl(),
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

      return domainProvider.addInteraction(interaction)
    })

    afterAll(() => domainProvider.verify())

    it('should create a browserDomain', async () => {
      const response = await BrowserDomainApi.create(request)

      expect(response.data).toEqual(expectedResponse)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('update a browserDomain', () => {
    const payload = {
      ...DOMAIN_MOCK,
      name: 'Updated BrowserDomain name',
      description: 'Updated BrowserDomain description',
      certThumbprint: '253F9BDD7AE4CA617B6953A003F1D3F3F9649FBFD185BF363F3928CBB80B1246',
    }

    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a browserDomain with guid ${DOMAIN_MOCK.guid}`)
        .uponReceiving('a request to update a browserDomain')
        .withRequest({
          method: 'PUT',
          path: makeBrowserDomainUrl(DOMAIN_MOCK.guid),
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
          body: Matchers.like({
            ...DOMAIN_MOCK,
            payload,
          }),
        })

      return domainProvider.addInteraction(interaction)
    })

    afterAll(() => domainProvider.verify())

    it('should update a browserDomain', async () => {
      const response = await BrowserDomainApi.update(DOMAIN_MOCK.guid, payload)

      expect(response.data).toEqual({
        ...DOMAIN_MOCK,
        payload,
      })
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('delete a browserDomain', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a browserDomain guid ${DOMAIN_MOCK.guid}`)
        .uponReceiving('a request to delete a browserDomain')
        .withRequest({
          method: 'DELETE',
          path: makeBrowserDomainUrl(DOMAIN_MOCK.guid),
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

      return domainProvider.addInteraction(interaction)
    })

    afterAll(() => domainProvider.verify())

    it('should delete a browserDomain', async () => {
      const response = await BrowserDomainApi.remove(DOMAIN_MOCK.guid)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('validate BrowserDomain name', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a BrowserDomain name ${DOMAIN_MOCK.domain}`)
        .uponReceiving('a request to validate BrowserDomain name')
        .withRequest({
          method: 'GET',
          path: makeBrowserDomainUrl(DOMAIN_MOCK.domain),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(mockedValidationStatusForDomain(DOMAIN_MOCK.domain)),
        })

      return domainProvider.addInteraction(interaction)
    })

    afterAll(() => domainProvider.verify())

    it('should validate BrowserDomain', async () => {
      const response = await BrowserDomainApi.validate(DOMAIN_MOCK.domain)

      expect(response.data).toEqual(DOMAIN_MOCK)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })
})
