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
import { ApprovedApplicationsApiMock, RestrictedApplicationsApiMock } from '../../api/applications/applications-api-mock'
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
import { Applications, makeAppsEndpoint, searchAppsEndpoint } from './appications'

const APPROVED_APPS_MOCK = createPageView(ApprovedApplicationsApiMock.getData())
const RESTRICTED_APPS_MOCK = createPageView(RestrictedApplicationsApiMock.getData())

const APP_MOCK_TO_GET = APPROVED_APPS_MOCK.data.elements[0]
const APP_MOCK_TO_CREATE = APPROVED_APPS_MOCK.data.elements[1]
const APP_MOCK_TO_UPDATE = RESTRICTED_APPS_MOCK.data.elements[0]
const APP_MOCK_TO_DELETE = RESTRICTED_APPS_MOCK.data.elements[1]
const APP_MOCK_TO_PARSE = RESTRICTED_APPS_MOCK.data.elements[1]
const APP_MOCK_IDS_TO_DELETE = [APPROVED_APPS_MOCK.data.elements[0].guid, APPROVED_APPS_MOCK.data.elements[1].guid]

jest.mock('../../../config.rest', () => jest.requireActual('../../../config.pact').mockedAxiosConfig('exclusionProvider'))

describe(`${MTD_EXCLUSION_PACT_CONSUMER_NAME}-${MTD_EXCLUSION_PACT_PROVIDER_NAME} application pact`, () => {
  beforeAll(async () => await exclusionProvider.setup())

  afterAll(async () => await exclusionProvider.finalize())

  describe(`get approved applications`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`getApprovedApps`)
        .uponReceiving(`request to get approved applications`)
        .withRequest({
          method: 'GET',
          path: searchAppsEndpoint(),
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
          body: APPROVED_APPS_MOCK.data,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should get approved applications`, async () => {
      const response = await Applications.search(APPROVED_PARAM)

      expect(response.data).toEqual(APPROVED_APPS_MOCK.data)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`get restricted applications`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`getRestrictedApps`)
        .uponReceiving(`request to get restricted applications`)
        .withRequest({
          method: 'GET',
          path: searchAppsEndpoint(),
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
          body: RESTRICTED_APPS_MOCK.data,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should get restricted applications`, async () => {
      const response = await Applications.search(RESTRICTED_PARAM)

      expect(response.data).toEqual(RESTRICTED_APPS_MOCK.data)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`import applications`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`importApps`)
        .uponReceiving(`request to import applications`)
        .withRequest({
          method: 'POST',
          path: `${makeAppsEndpoint()}/import/RESTRICTED`,
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Disposition': 'form-data; filename="import-app.csv"',
          },
        })
        .willRespondWith({
          status: OK,
          body: MOCK_IMPORT_RESULT.data,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should import applications`, async () => {
      const response = await Applications.import('RESTRICTED')

      expect(response.data).toEqual(MOCK_IMPORT_RESULT.data)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`create an application`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`createApp`)
        .uponReceiving(`request to create an application`)
        .withRequest({
          method: 'POST',
          path: makeAppsEndpoint(),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Type': Matchers.like(JSON_CONTENT_TYPE),
          },
          body: APP_MOCK_TO_CREATE,
        })
        .willRespondWith({
          status: CREATED,
          body: APP_MOCK_TO_CREATE,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should create an application`, async () => {
      const response = await Applications.create(APP_MOCK_TO_CREATE)

      expect(response.data).toEqual(APP_MOCK_TO_CREATE)
      expect(response.status).toEqual(CREATED)
    })
  })

  describe(`update an application`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`updateApp`)
        .uponReceiving(`request to update an application`)
        .withRequest({
          method: 'PUT',
          path: makeAppsEndpoint(APP_MOCK_TO_UPDATE.guid),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Type': Matchers.like(JSON_CONTENT_TYPE),
          },
          body: APP_MOCK_TO_UPDATE,
        })
        .willRespondWith({
          status: OK,
          body: APP_MOCK_TO_UPDATE,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should update an application`, async () => {
      const response = await Applications.update(APP_MOCK_TO_UPDATE)

      expect(response.data).toEqual(APP_MOCK_TO_UPDATE)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`get an application`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`getApp`)
        .uponReceiving(`request to get an application`)
        .withRequest({
          method: 'GET',
          path: makeAppsEndpoint(APP_MOCK_TO_GET.guid),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: OK,
          body: APP_MOCK_TO_GET,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should get an application`, async () => {
      const response = await Applications.get(APP_MOCK_TO_GET.guid)

      expect(response.data).toEqual(APP_MOCK_TO_GET)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`delete an application`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`deleteApp`)
        .uponReceiving(`request to delete an application`)
        .withRequest({
          method: 'DELETE',
          path: makeAppsEndpoint(APP_MOCK_TO_DELETE.guid),
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

    it(`should delete an application`, async () => {
      const response = await Applications.remove(APP_MOCK_TO_DELETE.guid)

      expect(response.status).toEqual(NO_CONTENT)
    })
  })

  describe(`delete applications`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`deleteApps`)
        .uponReceiving(`request to delete applications`)
        .withRequest({
          method: 'DELETE',
          path: makeAppsEndpoint(),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Type': Matchers.like(JSON_CONTENT_TYPE),
          },
          body: APP_MOCK_IDS_TO_DELETE,
        })
        .willRespondWith({
          status: OK,
          body: MOCK_DELETE_RESPONSE,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should delete applications`, async () => {
      const response = await Applications.removeMultiple(APP_MOCK_IDS_TO_DELETE)

      expect(response.data).toEqual(MOCK_DELETE_RESPONSE)
      expect(response.status).toEqual(OK)
    })
  })

  describe(`parse file to get application`, () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`parseFileApp`)
        .uponReceiving(`request to parse file to get application`)
        .withRequest({
          method: 'POST',
          path: `${makeAppsEndpoint()}/parseFile`,
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
            'Content-Disposition': 'form-data; filename="test-app.ipa"',
          },
        })
        .willRespondWith({
          status: OK,
          body: APP_MOCK_TO_PARSE,
        })

      return exclusionProvider.addInteraction(interaction)
    })

    afterAll(() => exclusionProvider.verify())

    it(`should parse file to get application`, async () => {
      const response = await Applications.parseAppFile()

      expect(response.data).toEqual(APP_MOCK_TO_PARSE)
      expect(response.status).toEqual(OK)
    })
  })
})
