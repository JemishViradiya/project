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
import { ReportingServiceInterval, ReportingServiceNetworkRouteType } from '../../types'
import { networkAccessTrafficSummaryMock } from './mock'
import { queryNetworkAccessTrafficSummaryGql } from './query'

const SUPPORTED_POLICY_TYPES = [ReportingServiceNetworkRouteType.Private, ReportingServiceNetworkRouteType.Public]
const COMPONENT_NAME = 'dashboard/network-access-widget'

const defaultOperationVariables = {
  tenantId: TENANT_ID_MOCK,
  interval: ReportingServiceInterval.Week,
  fromDate: '1502864593000',
  toDate: '1802864593000',
}

const componentType = 'queryNetworkAccessTrafficSummaryGql'
const operationName = 'queryNetworkAccessTraffic'
const query = queryNetworkAccessTrafficSummaryGql

describe(`${BIG_CONSUMER_NAME}-${BIG_REPORTING_SERVICE_PROVIDER_NAME} ${COMPONENT_NAME} pact`, () => {
  beforeAll(async () => await reportingProvider.setup())

  afterAll(async () => await reportingProvider.finalize())

  SUPPORTED_POLICY_TYPES.forEach(networkRoute => {
    const operationVariables = {
      ...defaultOperationVariables,
      filter: { networkRoute },
    }
    const expectedResponse = networkAccessTrafficSummaryMock[networkRoute][operationVariables.interval]

    describe(`get ${COMPONENT_NAME} data with a ${networkRoute} network route type, for ${componentType} with ${operationVariables.interval} frequency`, () => {
      beforeAll(() => {
        const interaction = new GraphQLInteraction()
          .uponReceiving(
            `request to get ${COMPONENT_NAME} data with a ${networkRoute} network route type, for ${componentType} with ${operationVariables.interval} frequency`,
          )
          .withRequest({ path: BIG_REPORTING_BASE_URL, method: 'POST' })
          .withOperation(operationName)
          .withQuery(print(query))
          .withVariables(operationVariables)
          .willRespondWith({
            status: 200,
            headers: {
              'Content-Type': Matchers.like('application/json'),
            },
            body: { data: Matchers.like(expectedResponse) },
          })

        return reportingProvider.addInteraction(interaction)
      })

      afterAll(() => reportingProvider.verify())

      it(`should get ${COMPONENT_NAME} data with a ${networkRoute} network route, for ${componentType} with ${operationVariables.interval} frequency`, async () => {
        const response = await reportingConsumer.query({ query, variables: operationVariables })

        expect(response.data).toEqual(expectedResponse)
      })
    })
  })
})
