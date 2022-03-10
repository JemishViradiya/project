//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable sonarjs/no-duplicate-string */

import { Interaction, Matchers } from '@pact-foundation/pact'

import {
  AUTHORIZATION_TOKEN_MOCK,
  DLP_TEMPLATE_PACT_CONSUMER_NAME,
  DLP_TEMPLATE_PACT_PROVIDER_NAME,
  HTTP_STATUS_CODE_OK,
  HTTP_STATUS_CREATED,
  templateProvider,
} from '../config.pact'
import { makeTemplateUrl, TemplatesApi } from './templates'
import { mockedTemplates, templateEntitiesResponse } from './templates-mock'
import type { AssociateTemplates } from './templates-types'

jest.mock('../config.rest', () => jest.requireActual('../config.pact').mockedAxiosConfig('templateProvider'))

const TEMPLATE_MOCK = mockedTemplates[0]

describe(`${DLP_TEMPLATE_PACT_CONSUMER_NAME}-${DLP_TEMPLATE_PACT_PROVIDER_NAME} tenants pact`, () => {
  beforeAll(async () => await templateProvider.setup())

  afterAll(async () => await templateProvider.finalize())

  describe('get a templates', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a templates`)
        .uponReceiving('a request to get a templates')
        .withRequest({
          method: 'GET',
          path: makeTemplateUrl(),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(templateEntitiesResponse),
        })

      return templateProvider.addInteraction(interaction)
    })

    afterAll(() => templateProvider.verify())

    it('should get a templates', async () => {
      const response = await TemplatesApi.readAll()
      console.log('should get a templates data = ', templateEntitiesResponse)
      expect(response.data).toEqual(templateEntitiesResponse)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('get a single template', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a template ID ${TEMPLATE_MOCK.guid}`)
        .uponReceiving('a request to get a template')
        .withRequest({
          method: 'GET',
          path: makeTemplateUrl(TEMPLATE_MOCK.guid),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: Matchers.like(TEMPLATE_MOCK),
        })

      return templateProvider.addInteraction(interaction)
    })

    afterAll(() => templateProvider.verify())

    it('should get a template', async () => {
      const response = await TemplatesApi.read(TEMPLATE_MOCK.guid)

      expect(response.data).toEqual(TEMPLATE_MOCK)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('create a template', () => {
    const request = TEMPLATE_MOCK
    request.guid = null

    const expectedResponse = request
    expectedResponse.guid = '55c69d5f-55f1-4347-ad56-39a570932791'

    beforeAll(() => {
      const interaction = new Interaction()
        .given('a data for a template')
        .uponReceiving('a request to create a template')
        .withRequest({
          method: 'POST',
          path: makeTemplateUrl(),
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

      return templateProvider.addInteraction(interaction)
    })

    afterAll(() => templateProvider.verify())

    it('should create a template', async () => {
      const response = await TemplatesApi.create(request)

      expect(response.data).toEqual(request)
      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('associate templates', () => {
    const templateIds = mockedTemplates.map(template => template.guid)
    beforeAll(() => {
      const associateTemplates: AssociateTemplates = {
        add: templateIds,
      }
      const interaction = new Interaction()
        .given(`a template IDs ${templateIds}`)
        .uponReceiving('a request to associate templates')
        .withRequest({
          method: 'PATCH',
          path: makeTemplateUrl(),
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

      return templateProvider.addInteraction(interaction)
    })

    afterAll(() => templateProvider.verify())

    it('should associate templates', async () => {
      const response = await TemplatesApi.associateTemplate(templateIds)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('disassociate templates', () => {
    const templateIds = mockedTemplates.map(template => template.guid)
    beforeAll(() => {
      const disassociateTemplates: AssociateTemplates = {
        add: templateIds,
      }
      const interaction = new Interaction()
        .given(`a template IDs ${templateIds}`)
        .uponReceiving('a request to disassociate templates')
        .withRequest({
          method: 'PATCH',
          path: makeTemplateUrl(),
          headers: {
            Authorization: Matchers.like(AUTHORIZATION_TOKEN_MOCK),
          },
          body: disassociateTemplates,
        })
        .willRespondWith({
          status: HTTP_STATUS_CODE_OK,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
        })

      return templateProvider.addInteraction(interaction)
    })

    afterAll(() => templateProvider.verify())

    it('should disassociate templates', async () => {
      const response = await TemplatesApi.disassociateTemplate(templateIds)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('update a template', () => {
    const payload = {
      ...TEMPLATE_MOCK,
      name: 'Updated Template name',
      description: 'Updated Template description',
    }

    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a template with ID ${TEMPLATE_MOCK.guid}`)
        .uponReceiving('a request to update a template')
        .withRequest({
          method: 'PUT',
          path: makeTemplateUrl(TEMPLATE_MOCK.guid),
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

      return templateProvider.addInteraction(interaction)
    })

    afterAll(() => templateProvider.verify())

    it('should update a template', async () => {
      const response = await TemplatesApi.update(payload)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })

  describe('delete a template', () => {
    beforeAll(() => {
      const interaction = new Interaction()
        .given(`a template ID ${TEMPLATE_MOCK.guid}`)
        .uponReceiving('a request to delete a template')
        .withRequest({
          method: 'DELETE',
          path: makeTemplateUrl(TEMPLATE_MOCK.guid),
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

      return templateProvider.addInteraction(interaction)
    })

    afterAll(() => templateProvider.verify())

    it('should delete a template', async () => {
      const response = await TemplatesApi.remove(TEMPLATE_MOCK.guid)

      expect(response.status).toEqual(HTTP_STATUS_CODE_OK)
    })
  })
})
