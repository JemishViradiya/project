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
import { DASHBOARD_WIDGET_MAX_RECORDS_COUNT } from '../../config'
import type { ReportingServiceQueryVariables } from '../../types'
import { tlsVersionsMock } from './mock'
import { queryTLSVersionsGql } from './query'

const COMPONENT_NAME = 'dashboard/tls-versions-widget'

describe(`${BIG_CONSUMER_NAME}-${BIG_REPORTING_SERVICE_PROVIDER_NAME} ${COMPONENT_NAME} pact`, () => {
  beforeAll(async () => await reportingProvider.setup())

  afterAll(async () => await reportingProvider.finalize())

  describe(`get ${COMPONENT_NAME} data`, () => {
    const operationVariables: ReportingServiceQueryVariables = {
      maxRecords: DASHBOARD_WIDGET_MAX_RECORDS_COUNT,
      tenantId: TENANT_ID_MOCK,
      fromDate: '1502864593000',
      toDate: '1802864593000',
    }

    beforeAll(() => {
      const interaction = new GraphQLInteraction()
        .uponReceiving(`request to get ${COMPONENT_NAME} data`)
        .withRequest({ path: BIG_REPORTING_BASE_URL, method: 'POST' })
        .withOperation('queryTLSVersions')
        .withQuery(print(queryTLSVersionsGql))
        .withVariables(operationVariables)
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': Matchers.like('application/json'),
          },
          body: { data: Matchers.like(tlsVersionsMock) },
        })

      return reportingProvider.addInteraction(interaction)
    })

    afterAll(() => reportingProvider.verify())

    it(`should get ${COMPONENT_NAME} data`, async () => {
      const response = await reportingConsumer.query({
        query: queryTLSVersionsGql,
        variables: operationVariables,
      })

      expect(response.data).toEqual(tlsVersionsMock)
    })
  })
})
