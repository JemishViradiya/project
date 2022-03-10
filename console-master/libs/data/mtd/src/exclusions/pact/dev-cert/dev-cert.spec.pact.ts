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
  ApprovedDeveloperCertificatesApiMock,
  RestrictedDeveloperCertificatesApiMock,
} from '../../api/dev-certs/dev-certs-api-mock'
import {
  APPROVED_PARAM,
  APPROVED_QUERY_PARAM,
  createPageView,
  JSON_CONTENT_TYPE,
  MOCK_DELETE_RESPONSE,
  MOCK_IMPORT_RESULT,
  RESTRICTED_PARAM,
  RESTRICTED_QUERY_PARAM,
} from '../constants'
import { DevCerts, makeDevCertsEndpoint, searchDevCertsEndpoint } from './dev-certs'

const APPROVED_CERTS_MOCK = createPageView(ApprovedDeveloperCertificatesApiMock.getData())
const RESTRICTED_CERTS_MOCK = createPageView(RestrictedDeveloperCertificatesApiMock.getData())

const DEV_CERT_MOCK_TO_GET = APPROVED_CERTS_MOCK.data.elements[0]
const DEV_CERT_MOCK_TO_CREATE = APPROVED_CERTS_MOCK.data.elements[1]
const DEV_CERT_MOCK_TO_UPDATE = RESTRICTED_CERTS_MOCK.data.elements[0]
const DEV_CERT_MOCK_TO_DELETE = RESTRICTED_CERTS_MOCK.data.elements[1]
const DEV_CERT_MOCK_TO_PARSE = RESTRICTED_CERTS_MOCK.data.elements[1]
const DEV_CERT_MOCK_IDS_TO_DELETE = [APPROVED_CERTS_MOCK.data.elements[0].guid, APPROVED_CERTS_MOCK.data.elements[1].guid]

jest.mock('../../../config.rest', () => jest.requireActual('../../../config.pact').mockedAxiosConfig('exclusionProvider'))

describe(`${MTD_EXCLUSION_PACT_CONSUMER_NAME}-${MTD_EXCLUSION_PACT_PROVIDER_NAME} dev-cert pact`, () => {
  beforeAll(async () => await exclusionProvider.setup())

  afterAll(async () => await exclusionProvider.finalize())

  describe(`get approved developer certificates`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`getApprovedDevCerts`)
        .uponReceiving(`request to get approved developer certificates`)
        .withRequest({
          method: 'GET',
          path: searchDevCertsEndpoint(),
          query: APPROVED_QUERY_PARAM,
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: OK,
          headers: {
            'Content-Type': JSON_CONTENT_TYPE,
          },
          body: APPROVED_CERTS_MOCK.data,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should get approved developer certificates`, async () => {
      const response = await DevCerts.search(APPROVED_PARAM)

      expect(response.data).toEqual(APPROVED_CERTS_MOCK.data)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`get restricted developer certificates`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`getRestrictedDevCerts`)
        .uponReceiving(`request to get restricted developer certificates`)
        .withRequest({
          method: 'GET',
          path: searchDevCertsEndpoint(),
          query: RESTRICTED_QUERY_PARAM,
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: OK,
          headers: {
            'Content-Type': JSON_CONTENT_TYPE,
          },
          body: RESTRICTED_CERTS_MOCK.data,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should get restricted developer certificates`, async () => {
      const response = await DevCerts.search(RESTRICTED_PARAM)

      expect(response.data).toEqual(RESTRICTED_CERTS_MOCK.data)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`import developer certificates`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`importDevCerts`)
        .uponReceiving(`request to import developer certificates`)
        .withRequest({
          method: 'POST',
          path: `${makeDevCertsEndpoint()}/import/RESTRICTED`,
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Disposition': 'form-data; filename="import-certificate.csv"',
          },
        })
        .willRespondWith({
          status: OK,
          body: MOCK_IMPORT_RESULT.data,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should import developer certificates`, async () => {
      const response = await DevCerts.import('RESTRICTED')

      expect(response.data).toEqual(MOCK_IMPORT_RESULT.data)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`create a developer certificate`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`createDevCert`)
        .uponReceiving(`request to create a developer certificate`)
        .withRequest({
          method: 'POST',
          path: makeDevCertsEndpoint(),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Type': Matchers.like(JSON_CONTENT_TYPE),
          },
          body: DEV_CERT_MOCK_TO_CREATE,
        })
        .willRespondWith({
          status: CREATED,
          body: DEV_CERT_MOCK_TO_CREATE,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should create a developer certificate`, async () => {
      const response = await DevCerts.create(DEV_CERT_MOCK_TO_CREATE)

      expect(response.data).toEqual(DEV_CERT_MOCK_TO_CREATE)
      expect(response.status).toEqual(CREATED)
    })
  })

  describe(`update a developer certificate`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`updateDevCert`)
        .uponReceiving(`request to update a developer certificate`)
        .withRequest({
          method: 'PUT',
          path: makeDevCertsEndpoint(DEV_CERT_MOCK_TO_UPDATE.guid),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Type': Matchers.like(JSON_CONTENT_TYPE),
          },
          body: DEV_CERT_MOCK_TO_UPDATE,
        })
        .willRespondWith({
          status: OK,
          body: DEV_CERT_MOCK_TO_UPDATE,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should update a developer certificate`, async () => {
      const response = await DevCerts.update(DEV_CERT_MOCK_TO_UPDATE)

      expect(response.data).toEqual(DEV_CERT_MOCK_TO_UPDATE)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`get a developer certificate`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`getDevCert`)
        .uponReceiving(`request to get a developer certificate`)
        .withRequest({
          method: 'GET',
          path: makeDevCertsEndpoint(DEV_CERT_MOCK_TO_GET.guid),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: OK,
          body: DEV_CERT_MOCK_TO_GET,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should get a developer certificate`, async () => {
      const response = await DevCerts.get(DEV_CERT_MOCK_TO_GET.guid)

      expect(response.data).toEqual(DEV_CERT_MOCK_TO_GET)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`delete a developer certificate`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`deleteDevCert`)
        .uponReceiving(`request to delete a developer certificate`)
        .withRequest({
          method: 'DELETE',
          path: makeDevCertsEndpoint(DEV_CERT_MOCK_TO_DELETE.guid),
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

    it(`should delete a developer certificate`, async () => {
      const response = await DevCerts.remove(DEV_CERT_MOCK_TO_DELETE.guid)

      expect(response.status).toEqual(NO_CONTENT)
    })
  })

  describe(`delete developer certificates`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`deleteDevCerts`)
        .uponReceiving(`request to delete developer certificates`)
        .withRequest({
          method: 'DELETE',
          path: makeDevCertsEndpoint(),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Type': Matchers.like(JSON_CONTENT_TYPE),
          },
          body: DEV_CERT_MOCK_IDS_TO_DELETE,
        })
        .willRespondWith({
          status: OK,
          body: MOCK_DELETE_RESPONSE,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should delete developer certificates`, async () => {
      const response = await DevCerts.removeMultiple(DEV_CERT_MOCK_IDS_TO_DELETE)

      expect(response.data).toEqual(MOCK_DELETE_RESPONSE)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`parse file to get developer certificate`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`parseFileDevCert`)
        .uponReceiving(`request to parse file to get developer certificate`)
        .withRequest({
          method: 'POST',
          path: `${makeDevCertsEndpoint()}/parseFile`,
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Disposition': 'form-data; filename="test-app.ipa"',
          },
        })
        .willRespondWith({
          status: OK,
          body: DEV_CERT_MOCK_TO_PARSE,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should parse file to get developer certificate`, async () => {
      const response = await DevCerts.parseAppFile()

      expect(response.data).toEqual(DEV_CERT_MOCK_TO_PARSE)
      expect(response.status).toEqual(OK)
    })
  })
})
