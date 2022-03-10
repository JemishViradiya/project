//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable sonarjs/no-duplicate-string */

import { v4 as uuidv4 } from 'uuid'

import { Interaction, Matchers } from '@pact-foundation/pact'

import {
  AUTHORIZATION_TOKEN_MOCK,
  DLP_POLICY_PACT_CONSUMER_NAME,
  DLP_POLICY_PACT_PROVIDER_NAME,
  HTTP_STATUS_CODE_OK,
  HTTP_STATUS_CREATED,
  policyProvider,
} from '../config.pact'
import { makePolicyUrl, PoliciesApi } from './policies'
import { mockedPolicies, policyByGuidsResponse, policyEntitiesResponse, policyValue } from './policies-mock'
import { POLICY_TYPE } from './policies-types'

jest.mock('../config.rest', () => jest.requireActual('../config.pact').mockedAxiosConfig('policyProvider'))

const POLICY_MOCK = mockedPolicies[0]

describe(`${DLP_POLICY_PACT_CONSUMER_NAME}-${DLP_POLICY_PACT_PROVIDER_NAME} tenants pact`, () => {
  beforeAll(async () => await policyProvider.setup())

  afterAll(async () => await policyProvider.finalize())

  describe('get a policies', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a policies`)
        .uponReceiving('a request to get a policies')
        .withRequest({
          method: 'GET',
          path: makePolicyUrl('policies/DLP'),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(policyEntitiesResponse),
        })

      return policyProvider.addInteraction(interaction)
    })

    afterAll(() => policyProvider.verify())

    it('should get a CONTENT policies', async () => {
      const response = await PoliciesApi.readAll(POLICY_TYPE.CONTENT)
      console.log('should get a policies data = ', policyEntitiesResponse)
      expect(response.data).toEqual(policyEntitiesResponse)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })

    it('should get a MOBILE policies', async () => {
      const response = await PoliciesApi.readAll(POLICY_TYPE.MOBILE)
      console.log('should get a policies data = ', policyEntitiesResponse)
      expect(response.data).toEqual(policyEntitiesResponse)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('get a policies by guids', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a policies by guids`)
        .uponReceiving('a request to get a policies by guids')
        .withRequest({
          method: 'GET',
          path: makePolicyUrl('policies/byGuids'),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(policyByGuidsResponse),
        })

      return policyProvider.addInteraction(interaction)
    })

    afterAll(() => policyProvider.verify())

    it('should get a policies by guids', async () => {
      const response = await PoliciesApi.readAllByGuids([])
      console.log('should get a policies data = ', policyEntitiesResponse)
      expect(response.data).toEqual(policyEntitiesResponse)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('get a single policy', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a policy ID ${POLICY_MOCK.policyId}`)
        .uponReceiving('a request to get a policy')
        .withRequest({
          method: 'GET',
          path: makePolicyUrl(POLICY_MOCK.policyId),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(POLICY_MOCK),
        })

      return policyProvider.addInteraction(interaction)
    })

    afterAll(() => policyProvider.verify())

    it('should get a policy', async () => {
      const response = await PoliciesApi.read(POLICY_MOCK.policyId)

      expect(response.data).toEqual(POLICY_MOCK)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('create a policy', () => {
    const request = POLICY_MOCK
    request.policyId = null

    const expectedResponse = request
    expectedResponse.policyId = uuidv4()

    beforeAll(() => {
      const interaction = new Interaction()
        .given('a data for a policy')
        .uponReceiving('a request to create a policy')
        .withRequest({
          method: 'POST',
          path: makePolicyUrl(),
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

      return policyProvider.addInteraction(interaction)
    })

    afterAll(() => policyProvider.verify())

    it('should create a policy', async () => {
      const response = await PoliciesApi.create(request)

      expect(response.data).toEqual(request)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('update a policy', () => {
    const payload = {
      ...POLICY_MOCK,
      name: 'Updated Policy name',
      description: 'Updated Policy description',
    }

    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a policy with ID ${POLICY_MOCK.policyId}`)
        .uponReceiving('a request to update a policy')
        .withRequest({
          method: 'PUT',
          path: makePolicyUrl(POLICY_MOCK.policyId),
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

      return policyProvider.addInteraction(interaction)
    })

    afterAll(() => policyProvider.verify())

    it('should update a policy', async () => {
      const response = await PoliciesApi.update(payload)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('delete a policy', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a policy ID ${POLICY_MOCK.policyId}`)
        .uponReceiving('a request to delete a policy')
        .withRequest({
          method: 'DELETE',
          path: makePolicyUrl(POLICY_MOCK.policyId),
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

      return policyProvider.addInteraction(interaction)
    })

    afterAll(() => policyProvider.verify())

    it('should delete a policy', async () => {
      const response = await PoliciesApi.remove(POLICY_MOCK.policyId)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('get a policy setting definition', () => {
    const type = POLICY_TYPE.CONTENT
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a policy type ${type}}`)
        .uponReceiving('a request to get a policy setting definition')
        .withRequest({
          method: 'GET',
          path: makePolicyUrl(`definition/${type}`),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(policyValue),
        })

      return policyProvider.addInteraction(interaction)
    })

    afterAll(() => policyProvider.verify())

    it('should get a policy setting definition', async () => {
      const response = await PoliciesApi.getPolicySettingDefinition(type)
      console.log('should get a policy setting definition = ', policyValue)
      expect(response.data).toEqual(policyValue)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })
  //TODO: Get tenant settings used in policy
})
