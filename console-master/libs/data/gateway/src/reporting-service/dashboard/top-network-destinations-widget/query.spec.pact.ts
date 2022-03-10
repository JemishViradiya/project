//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

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
import { DASHBOARD_WIDGET_MAX_RECORDS_COUNT } from '../../config'
import type { ReportingServiceQueryVariables } from '../../types'
import { ReportingServiceBucketField, ReportingServiceNetworkRouteType, ReportingServiceSortDirection } from '../../types'
import { topNetworkDestinationsMock } from './mock'
import { queryTopNetworkDestinationsGql } from './query'

const COMPONENT_NAME = 'dashboard/top-network-destinations-widget'
const SUPPORTED_POLICY_TYPES = [ReportingServiceNetworkRouteType.Private, ReportingServiceNetworkRouteType.Public]

describe(`${BIG_CONSUMER_NAME}-${BIG_REPORTING_SERVICE_PROVIDER_NAME} ${COMPONENT_NAME} pact`, () => {
  beforeAll(async () => await reportingProvider.setup())

  afterAll(async () => await reportingProvider.finalize())

  SUPPORTED_POLICY_TYPES.forEach(networkRoute =>
    describe(`get ${COMPONENT_NAME} data with a ${networkRoute} network route`, () => {
      const operationVariables: ReportingServiceQueryVariables = {
        tenantId: TENANT_ID_MOCK,
        maxRecords: DASHBOARD_WIDGET_MAX_RECORDS_COUNT,
        sort: [{ bucketOrder: ReportingServiceBucketField.Count, order: ReportingServiceSortDirection.Desc }],
        fromDate: '1502864593000',
        toDate: '1802864593000',
        filter: { networkRoute },
      }
      const expectedResponse = topNetworkDestinationsMock[networkRoute]

      beforeAll(() => {
        const interaction = new GraphQLInteraction()
          .uponReceiving(`request to get ${COMPONENT_NAME} data with a ${networkRoute} network route`)
          .withRequest({ path: BIG_REPORTING_BASE_URL, method: 'POST' })
          .withOperation('queryTopNetworkDestinations')
          .withQuery(print(queryTopNetworkDestinationsGql))
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

      it(`should get ${COMPONENT_NAME} data with a ${networkRoute} network route`, async () => {
        const response = await reportingConsumer.query({
          query: queryTopNetworkDestinationsGql,
          variables: operationVariables,
        })

        expect(response.data).toEqual(expectedResponse)
      })
    }),
  )
})
