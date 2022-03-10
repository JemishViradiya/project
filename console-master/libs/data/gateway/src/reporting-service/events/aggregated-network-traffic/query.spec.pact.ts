// //******************************************************************************
// // Copyright 2020 BlackBerry. All Rights Reserved.

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
import { aggregatedNetworkTrafficMock } from './mock'
import { queryAggregatedNetworkTrafficGql } from './query'

const COMPONENT_NAME = 'events/aggregated-network-traffic'

const COMPONENT_TEST_CASES = [
  {
    componentType: `aggregated network traffic by ${ReportingServiceField.EcoId}`,
    query: queryAggregatedNetworkTrafficGql,
    mockData: aggregatedNetworkTrafficMock[ReportingServiceField.EcoId],
    defaultOperationVariables: {
      field: ReportingServiceField.EcoId,
      filter: { tsTerm: { from: '1502864593000', to: '1802864593000' } },
      fromRecord: 0,
      maxRecords: 100,
      tenantId: TENANT_ID_MOCK,
    },
    operationName: 'queryAggregatedNetworkTraffic',
  },
  {
    componentType: `aggregated network traffic by ${ReportingServiceField.AppDest}`,
    query: queryAggregatedNetworkTrafficGql,
    mockData: aggregatedNetworkTrafficMock[ReportingServiceField.AppDest],
    defaultOperationVariables: {
      field: ReportingServiceField.AppDest,
      fieldCounters: [ReportingServiceField.EcoId],
      filter: { tsTerm: { from: '1502864593000', to: '1802864593000' } },
      fromRecord: 0,
      maxRecords: 100,
      tenantId: TENANT_ID_MOCK,
    },
    operationName: 'queryAggregatedNetworkTraffic',
  },
]

describe(`${BIG_CONSUMER_NAME}-${BIG_REPORTING_SERVICE_PROVIDER_NAME} ${COMPONENT_NAME} pact`, () => {
  beforeAll(async () => await reportingProvider.setup())

  afterAll(async () => await reportingProvider.finalize())

  COMPONENT_TEST_CASES.forEach(({ componentType, query, mockData, defaultOperationVariables, operationName }) => {
    describe(`get ${componentType} data`, () => {
      beforeAll(() => {
        const interaction = new GraphQLInteraction()
          .uponReceiving(`request to get ${componentType} data`)
          .withRequest({ path: BIG_REPORTING_BASE_URL, method: 'POST' })
          .withOperation(operationName)
          .withQuery(print(query))
          .withVariables(defaultOperationVariables)
          .willRespondWith({
            status: 200,
            headers: {
              'Content-Type': Matchers.like('application/json'),
            },
            body: { data: Matchers.like(mockData) },
          })

        return reportingProvider.addInteraction(interaction)
      })

      afterAll(() => reportingProvider.verify())

      it(`should get ${componentType} data`, async () => {
        const response = await reportingConsumer.query({ query, variables: defaultOperationVariables })

        expect(response.data).toEqual(mockData)
      })
    })
  })
})
