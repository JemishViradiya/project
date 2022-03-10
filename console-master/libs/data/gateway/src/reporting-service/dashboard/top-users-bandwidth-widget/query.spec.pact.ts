// //******************************************************************************
// // Copyright 2021 BlackBerry. All Rights Reserved.

import { print } from 'graphql/language/printer'

import { GraphQLInteraction, Matchers } from '@pact-foundation/pact'

import {
  BIG_CONSUMER_NAME,
  BIG_REPORTING_BASE_URL,
  BIG_REPORTING_SERVICE_PROVIDER_NAME,
  reportingConsumer,
  reportingProvider,
  TENANT_ID_MOCK,
} from '../../../config.pact'
import { ReportingServiceField } from '../../types'
import { aggregatedTopUsersBandwidthMock } from './mock'
import { queryTopUsersBandwidthGql } from './query'

const COMPONENT_NAME = 'dashboard/users-bandwidth-widget'

const mockVariables = {
  tenantId: TENANT_ID_MOCK,
  fromDate: '1502864593000',
  toDate: '1802864593000',
  maxRecords: 10,
}

describe(`${BIG_CONSUMER_NAME}-${BIG_REPORTING_SERVICE_PROVIDER_NAME} ${COMPONENT_NAME} pact`, () => {
  beforeAll(async () => await reportingProvider.setup())

  afterAll(async () => await reportingProvider.finalize())

  describe(`get aggregated network traffic by ${ReportingServiceField.EcoId} data`, () => {
    beforeAll(() => {
      const interaction = new GraphQLInteraction()
        .uponReceiving(`request to get aggregated network traffic by ${ReportingServiceField.EcoId} data`)
        .withRequest({ path: BIG_REPORTING_BASE_URL, method: 'POST' })
        .withOperation('queryTopUsersBandwidth')
        .withQuery(print(queryTopUsersBandwidthGql))
        .withVariables(mockVariables)
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: { data: Matchers.like(aggregatedTopUsersBandwidthMock) },
        })
      return reportingProvider.addInteraction(interaction)
    })

    afterAll(() => {
      return reportingProvider.verify()
    })

    it(`should get aggregated network traffic by ${ReportingServiceField.EcoId} data`, async () => {
      const response = await reportingConsumer.query({
        query: queryTopUsersBandwidthGql,
        variables: mockVariables,
      })
      expect(response.data).toEqual(aggregatedTopUsersBandwidthMock)
    })
  })
})
