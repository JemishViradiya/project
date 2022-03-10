//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { BAD_REQUEST } from 'http-status-codes'

import { Interaction, Matchers } from '@pact-foundation/pact'

import { JSON_CONTENT_TYPE } from '@ues-data/shared-pact'

import { directoryProvider, PLATFORM_DIRECTORY_PACT_CONSUMER_NAME, PLATFORM_DIRECTORY_PACT_PROVIDER_NAME } from '../config.pact'
import { Directory, makeDirectoryInstanceUrl } from './directory'

const DIRECTORY_ID = 'e1a2d33d-360f-48b1-b765-8875cf53efd5-test'
const notFoundMessage = `the instance with id [${DIRECTORY_ID}] not found`
const notFoundSubStatusCode = 110

jest.mock('../config.rest', () => jest.requireActual('../config.pact').mockedAxiosConfig('directoryProvider'))

describe(`${PLATFORM_DIRECTORY_PACT_CONSUMER_NAME}-${PLATFORM_DIRECTORY_PACT_PROVIDER_NAME} directory pact`, () => {
  beforeAll(async () => await directoryProvider.setup())
  afterAll(async () => await directoryProvider.finalize())

  describe('get directory connection', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`directory with ID ${DIRECTORY_ID} does not exist`)
        .uponReceiving('request to get directory connection')
        .withRequest({
          method: 'GET',
          path: makeDirectoryInstanceUrl(DIRECTORY_ID),
        })
        .willRespondWith({
          status: BAD_REQUEST,
          headers: {
            'Content-Type': Matchers.like(JSON_CONTENT_TYPE),
          },
          body: {
            subStatusCode: notFoundSubStatusCode,
            message: notFoundMessage,
          },
        })

      return directoryProvider.addInteraction(interaction)
    })

    afterAll(() => directoryProvider.verify())

    it('should return not found subStatusCode and message', async () => {
      try {
        await Directory.getDirectoryInstance(DIRECTORY_ID)
      } catch ({ response }) {
        expect(response.status).toEqual(BAD_REQUEST)
        expect(response.data).toEqual({
          subStatusCode: notFoundSubStatusCode,
          message: notFoundMessage,
        })
      }
    })
  })
})
