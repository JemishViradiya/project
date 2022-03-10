//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { CREATED, NO_CONTENT, OK } from 'http-status-codes'

import { Interaction, Matchers } from '@pact-foundation/pact'

import {
  AUTHORIZATION_TOKEN_MOCK,
  exclusionProvider,
  MTD_EXCLUSION_PACT_CONSUMER_NAME,
  MTD_EXCLUSION_PACT_PROVIDER_NAME,
} from '../../../config.pact'
import {
  ApprovedDomainsApiMock,
  ApprovedIPAddressesApiMock,
  RestrictedDomainsApiMock,
  RestrictedIPAddressesApiMock,
} from '../../api/web-addresses/web-addresses-api-mock'
import {
  APPROVED_HOST_PARAM,
  APPROVED_HOST_QUERY_PARAM,
  APPROVED_IP_PARAM,
  APPROVED_IP_QUERY_PARAM,
  createPageView,
  JSON_CONTENT_TYPE,
  MOCK_DELETE_RESPONSE,
  MOCK_IMPORT_RESULT,
  RESTRICTED_HOST_PARAM,
  RESTRICTED_HOST_QUERY_PARAM,
  RESTRICTED_IP_PARAM,
  RESTRICTED_IP_QUERY_PARAM,
} from '../constants'
import { makeWebAddressesEndpoint, searchWebAddressesEndpoint, WebAddresses } from './web-addresses'

const APPROVED_IP_ADDRESSES_MOCK = createPageView(ApprovedIPAddressesApiMock.getData())
const RESTRICTED_IP_ADDRESSES_MOCK = createPageView(RestrictedIPAddressesApiMock.getData())
const APPROVED_DOMAINS_MOCK = createPageView(ApprovedDomainsApiMock.getData())
const RESTRICTED_DOMAINS_MOCK = createPageView(RestrictedDomainsApiMock.getData())

const ADDRESS_MOCK_TO_GET = APPROVED_IP_ADDRESSES_MOCK.data.elements[0]
const ADDRESS_MOCK_TO_CREATE = APPROVED_IP_ADDRESSES_MOCK.data.elements[0]
const ADDRESS_MOCK_TO_UPDATE = RESTRICTED_IP_ADDRESSES_MOCK.data.elements[0]
const ADDRESS_MOCK_TO_DELETE = APPROVED_DOMAINS_MOCK.data.elements[0]
const ADDRESS_MOCK_IDS_TO_DELETE = [RESTRICTED_DOMAINS_MOCK.data.elements[0].guid, RESTRICTED_DOMAINS_MOCK.data.elements[1].guid]

jest.mock('../../../config.rest', () => jest.requireActual('../../../config.pact').mockedAxiosConfig('exclusionProvider'))

describe(`${MTD_EXCLUSION_PACT_CONSUMER_NAME}-${MTD_EXCLUSION_PACT_PROVIDER_NAME} web-address pact`, () => {
  beforeAll(async () => await exclusionProvider.setup())

  afterAll(async () => await exclusionProvider.finalize())

  describe(`get approved IP addresses`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`getApprovedIpAddresses`)
        .uponReceiving(`request to get approved IP addresses`)
        .withRequest({
          method: 'GET',
          path: searchWebAddressesEndpoint(),
          query: APPROVED_IP_QUERY_PARAM,
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: OK,
          headers: {
            'Content-Type': JSON_CONTENT_TYPE,
          },
          body: APPROVED_IP_ADDRESSES_MOCK.data,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should get approved IP addresses`, async () => {
      const response = await WebAddresses.search(APPROVED_IP_PARAM)

      expect(response.data).toEqual(APPROVED_IP_ADDRESSES_MOCK.data)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`get restricted IP addresses`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`getRestrictedIpAddresses`)
        .uponReceiving(`request to get restricted IP addresses`)
        .withRequest({
          method: 'GET',
          path: searchWebAddressesEndpoint(),
          query: RESTRICTED_IP_QUERY_PARAM,
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: OK,
          headers: {
            'Content-Type': JSON_CONTENT_TYPE,
          },
          body: RESTRICTED_IP_ADDRESSES_MOCK.data,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should get restricted IP addresses`, async () => {
      const response = await WebAddresses.search(RESTRICTED_IP_PARAM)

      expect(response.data).toEqual(RESTRICTED_IP_ADDRESSES_MOCK.data)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`get approved domains`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`getApprovedDomains`)
        .uponReceiving(`request to get approved domains`)
        .withRequest({
          method: 'GET',
          path: searchWebAddressesEndpoint(),
          query: APPROVED_HOST_QUERY_PARAM,
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: OK,
          headers: {
            'Content-Type': JSON_CONTENT_TYPE,
          },
          body: APPROVED_DOMAINS_MOCK.data,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should get approved domains`, async () => {
      const response = await WebAddresses.search(APPROVED_HOST_PARAM)

      expect(response.data).toEqual(APPROVED_DOMAINS_MOCK.data)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`get restricted domains`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`getRestrictedDomains`)
        .uponReceiving(`request to get restricted domains`)
        .withRequest({
          method: 'GET',
          path: searchWebAddressesEndpoint(),
          query: RESTRICTED_HOST_QUERY_PARAM,
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: OK,
          headers: {
            'Content-Type': JSON_CONTENT_TYPE,
          },
          body: RESTRICTED_DOMAINS_MOCK.data,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should get restricted domains`, async () => {
      const response = await WebAddresses.search(RESTRICTED_HOST_PARAM)

      expect(response.data).toEqual(RESTRICTED_DOMAINS_MOCK.data)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`import web addresses`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`importWebAddresses`)
        .uponReceiving(`request to import web addresses`)
        .withRequest({
          method: 'POST',
          path: `${makeWebAddressesEndpoint()}/import/HOST/RESTRICTED`,
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Disposition': 'form-data; filename="import-addresses.csv"',
          },
        })
        .willRespondWith({
          status: OK,
          body: MOCK_IMPORT_RESULT.data,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should import web addresses`, async () => {
      const response = await WebAddresses.import('HOST', 'RESTRICTED')

      expect(response.data).toEqual(MOCK_IMPORT_RESULT.data)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`create a web address`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`createWebAddress`)
        .uponReceiving(`request to create a web address`)
        .withRequest({
          method: 'POST',
          path: makeWebAddressesEndpoint(),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Type': Matchers.like(JSON_CONTENT_TYPE),
          },
          body: ADDRESS_MOCK_TO_CREATE,
        })
        .willRespondWith({
          status: CREATED,
          body: ADDRESS_MOCK_TO_CREATE,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should create a web address`, async () => {
      const response = await WebAddresses.create(ADDRESS_MOCK_TO_CREATE)

      expect(response.data).toEqual(ADDRESS_MOCK_TO_CREATE)
      expect(response.status).toEqual(CREATED)
    })
  })

  describe(`update a web address`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`updateWebAddress`)
        .uponReceiving(`request to update a web address`)
        .withRequest({
          method: 'PUT',
          path: makeWebAddressesEndpoint(ADDRESS_MOCK_TO_UPDATE.guid),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Type': Matchers.like(JSON_CONTENT_TYPE),
          },
          body: ADDRESS_MOCK_TO_UPDATE,
        })
        .willRespondWith({
          status: OK,
          body: ADDRESS_MOCK_TO_UPDATE,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should update a web address`, async () => {
      const response = await WebAddresses.update(ADDRESS_MOCK_TO_UPDATE)

      expect(response.data).toEqual(ADDRESS_MOCK_TO_UPDATE)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`get a web address`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`getWebAddress`)
        .uponReceiving(`request to get a web address`)
        .withRequest({
          method: 'GET',
          path: makeWebAddressesEndpoint(ADDRESS_MOCK_TO_GET.guid),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: OK,
          body: ADDRESS_MOCK_TO_GET,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should get a web address`, async () => {
      const response = await WebAddresses.get(ADDRESS_MOCK_TO_GET.guid)

      expect(response.data).toEqual(ADDRESS_MOCK_TO_GET)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`delete a web address`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`deleteWebAddress`)
        .uponReceiving(`request to delete a web address`)
        .withRequest({
          method: 'DELETE',
          path: makeWebAddressesEndpoint(ADDRESS_MOCK_TO_DELETE.guid),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: NO_CONTENT,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should delete a web address`, async () => {
      const response = await WebAddresses.remove(ADDRESS_MOCK_TO_DELETE.guid)

      expect(response.status).toEqual(NO_CONTENT)
    })
  })

  describe(`delete web addresses`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`deleteWebAddresses`)
        .uponReceiving(`request to delete web addresses`)
        .withRequest({
          method: 'DELETE',
          path: makeWebAddressesEndpoint(),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Type': Matchers.like(JSON_CONTENT_TYPE),
          },
          body: ADDRESS_MOCK_IDS_TO_DELETE,
        })
        .willRespondWith({
          status: OK,
          body: MOCK_DELETE_RESPONSE,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should delete web addresses`, async () => {
      const response = await WebAddresses.removeMultiple(ADDRESS_MOCK_IDS_TO_DELETE)

      expect(response.data).toEqual(MOCK_DELETE_RESPONSE)
      expect(response.status).toEqual(OK)
    })
  })
})
