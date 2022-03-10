//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { Interaction, Matchers } from '@pact-foundation/pact'

import { HTTP_STATUS_CODE_OK, JSON_CONTENT_TYPE } from '@ues-data/shared-pact'

import { bffGridProvider, PLATFORM_BFFGRID_PACT_CONSUMER_NAME, PLATFORM_BFFGRID_PACT_PROVIDER_NAME } from '../../config.pact'
import { baseUrl } from '../../config.rest'
import { devicesMock, Users, usersMock } from '../common'

const bffGridBaseUrl = `${baseUrl}/v1/bffgrid`

const TENANT_ID = 'L16683744'
const USER_ID = 'QXBsV0N5WjJ6d1dZUmtIYVcvWWRnQjA9'
const USER_IDS = [USER_ID, 'QXBsV0N5WjJ6d1dZUmtIYVcvWWRnQjA3', 'QXBsV0N5WjJ6d1dZUmtIYVcvWWRnQjA1']
const SERVER_SELECTION_USER_REQUEST_PAYLOAD = {
  query: null,
  allSelected: false,
  selected: USER_IDS,
}
const SERVER_SELECTION_REQUEST_RESPONSE = { totalCount: 1, failedCount: 2 }
const DELETE_USERS_REQUEST_RESPONSE = { success: USER_IDS }
const ENDPOINT_ID = 'e131630d-2b87-49f7-93c9-ff54ff85ab51'
const ENDPOINT_IDS = [ENDPOINT_ID, 'e131630d-2b87-49f7-93c9-ff54ff85ab56', 'e131630d-2b87-49f7-93c9-ff54ff85ab57']
const SERVER_SELECTION_ENDPOINT_REQUEST_PAYLOAD = {
  query: null,
  allSelected: false,
  selected: ENDPOINT_IDS,
}

jest.mock('../../config.rest', () => jest.requireActual('../../config.pact').mockedBffGridAxiosConfig('bffGridProvider'))

describe(`${PLATFORM_BFFGRID_PACT_CONSUMER_NAME}-${PLATFORM_BFFGRID_PACT_PROVIDER_NAME} bffgrid pact`, () => {
  beforeAll(async () => await bffGridProvider.setup())
  afterAll(async () => await bffGridProvider.finalize())

  // Pact to get list of users
  describe('get bffgrid users', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a tenant with ID ${TENANT_ID} does exist`)
        .uponReceiving('request to get bffgrid users')
        .withRequest({
          method: 'GET',
          path: bffGridBaseUrl + '/users',
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like(JSON_CONTENT_TYPE),
          },
          body: Matchers.like(usersMock),
        })

      return bffGridProvider.addInteraction(interaction)
    })

    afterAll(() => bffGridProvider.verify())

    it('should return a list of users', async () => {
      const response = await Users.getBffGridUsers(null, null, null, null)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
      expect(response.data).toEqual(usersMock)
    })
  })

  // Pact for resending invitation for < 100 users
  describe('post resend invitations', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a user with ID ${USER_ID} does exist`)
        .uponReceiving('request to resend invitation')
        .withRequest({
          method: 'POST',
          path: bffGridBaseUrl + '/resendInvitation',
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like(JSON_CONTENT_TYPE),
          },
          body: Matchers.like(SERVER_SELECTION_REQUEST_RESPONSE),
        })

      return bffGridProvider.addInteraction(interaction)
    })

    afterAll(() => bffGridProvider.verify())

    it('should return a count of total and failed users actioned on', async () => {
      const response = await Users.resendInvitationExt(SERVER_SELECTION_USER_REQUEST_PAYLOAD)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
      expect(response.data).toEqual(SERVER_SELECTION_REQUEST_RESPONSE)
    })
  })

  // Pact for expiring passcodes of < 100 users
  describe('post expiring passcodes', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a user with ID ${USER_ID} does exist`)
        .uponReceiving('request to expire passcodes')
        .withRequest({
          method: 'POST',
          path: bffGridBaseUrl + '/passwordExpiry',
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like(JSON_CONTENT_TYPE),
          },
          body: Matchers.like(SERVER_SELECTION_REQUEST_RESPONSE),
        })

      return bffGridProvider.addInteraction(interaction)
    })

    afterAll(() => bffGridProvider.verify())

    it('should return a count of total and failed users actioned on', async () => {
      const response = await Users.expireUsersPasscodes(SERVER_SELECTION_USER_REQUEST_PAYLOAD)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
      expect(response.data).toEqual(SERVER_SELECTION_REQUEST_RESPONSE)
    })
  })

  // Pact for deleting < 100 users
  describe('post deleting users', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a user with ID ${USER_ID} does exist`)
        .uponReceiving('request to delete users')
        .withRequest({
          method: 'DELETE',
          path: bffGridBaseUrl + '/deleteUsers',
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like(JSON_CONTENT_TYPE),
          },
          body: Matchers.like(DELETE_USERS_REQUEST_RESPONSE),
        })

      return bffGridProvider.addInteraction(interaction)
    })

    afterAll(() => bffGridProvider.verify())

    it('should return a list of ids succesfully deleted', async () => {
      const response = await Users.deleteUsers(SERVER_SELECTION_USER_REQUEST_PAYLOAD)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
      expect(response.data).toEqual(DELETE_USERS_REQUEST_RESPONSE)
    })
  })

  // Pact to get list of endpoints
  describe('get bffgrid endpoints', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a tenant with ID ${TENANT_ID} does exist`)
        .uponReceiving('request to get bffgrid endpoints')
        .withRequest({
          method: 'GET',
          path: bffGridBaseUrl + '/endpoints',
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like(JSON_CONTENT_TYPE),
          },
          body: Matchers.like(devicesMock),
        })

      return bffGridProvider.addInteraction(interaction)
    })

    afterAll(() => bffGridProvider.verify())

    it('should return a list of users', async () => {
      const response = await Users.getBffGridDevices(null, null, null, null)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
      expect(response.data).toEqual(devicesMock)
    })
  })

  // Pact for deleting < 100 endpoints
  describe('post deleting endpoints', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a endpoint with ID ${ENDPOINT_ID} does exist`)
        .uponReceiving('request to delete users')
        .withRequest({
          method: 'DELETE',
          path: bffGridBaseUrl + '/deleteEndpoints',
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like(JSON_CONTENT_TYPE),
          },
          body: Matchers.like(SERVER_SELECTION_REQUEST_RESPONSE),
        })

      return bffGridProvider.addInteraction(interaction)
    })

    afterAll(() => bffGridProvider.verify())

    it('should return a count of total deletes and failed deletes', async () => {
      const response = await Users.deleteDevices(SERVER_SELECTION_ENDPOINT_REQUEST_PAYLOAD)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
      expect(response.data).toEqual(SERVER_SELECTION_REQUEST_RESPONSE)
    })
  })
})
