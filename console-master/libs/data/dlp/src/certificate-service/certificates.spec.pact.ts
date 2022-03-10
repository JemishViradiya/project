//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable sonarjs/no-duplicate-string */

import { v4 as uuidv4 } from 'uuid'

import { Interaction, Matchers } from '@pact-foundation/pact'

import {
  AUTHORIZATION_TOKEN_MOCK,
  certificateProvider,
  DLP_CERTIFICATE_PACT_CONSUMER_NAME,
  DLP_CERTIFICATE_PACT_PROVIDER_NAME,
  HTTP_STATUS_CODE_OK,
  HTTP_STATUS_CREATED,
} from '../config.pact'
import { CertificateApi, makeCertificateUrl } from './certificates'
import { certificatesResponse, mockedCertificates, uploadCertificateView } from './certificates-mock'

jest.mock('../config.rest', () => jest.requireActual('../config.pact').mockedAxiosConfig('certificateProvider'))

const CERTIFICATE_MOCK = mockedCertificates[0]

describe(`${DLP_CERTIFICATE_PACT_CONSUMER_NAME}-${DLP_CERTIFICATE_PACT_PROVIDER_NAME} tenants pact`, () => {
  beforeAll(async () => await certificateProvider.setup())

  afterAll(async () => await certificateProvider.finalize())

  describe('get certificates', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`certificates`)
        .uponReceiving('a request to get a certificates')
        .withRequest({
          method: 'GET',
          path: makeCertificateUrl(),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(certificatesResponse),
        })

      return certificateProvider.addInteraction(interaction)
    })

    afterAll(() => certificateProvider.verify())

    it('should get certiifcates', async () => {
      const response = await CertificateApi.readAll()
      console.log('should get certiifcates data = ', certificatesResponse)
      expect(response.data).toEqual(certificatesResponse)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('create a certiifcate', () => {
    const request = uploadCertificateView

    const expectedResponse = CERTIFICATE_MOCK
    expectedResponse.alias = uuidv4()

    beforeAll(() => {
      const interaction = new Interaction()
        .given('a data for a certificate')
        .uponReceiving('a request to create a certificate')
        .withRequest({
          method: 'POST',
          path: makeCertificateUrl(),
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

      return certificateProvider.addInteraction(interaction)
    })

    afterAll(() => certificateProvider.verify())

    it('should create a certiifcate', async () => {
      const response = await CertificateApi.create(request)

      expect(response.data).toEqual(expectedResponse)
      expect(response.status).toEqual(HTTP_STATUS_CREATED)
    })
  })

  describe('delete a certificate', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a certificate alias ${CERTIFICATE_MOCK.alias}`)
        .uponReceiving('a request to delete a certificate')
        .withRequest({
          method: 'DELETE',
          path: makeCertificateUrl(CERTIFICATE_MOCK.alias),
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

      return certificateProvider.addInteraction(interaction)
    })

    afterAll(() => certificateProvider.verify())

    it('should delete a certificate', async () => {
      const response = await CertificateApi.remove(CERTIFICATE_MOCK.alias)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })
})
