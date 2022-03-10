// //******************************************************************************
// // Copyright 2020 BlackBerry. All Rights Reserved.

import { print } from 'graphql/language/printer'

import { GraphQLInteraction, Matchers } from '@pact-foundation/pact'

import { ReconciliationEntityType } from '@ues-data/shared-types'

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
import { ReportingServiceFilter } from '../../types'
import { appliedPoliciesMock } from './mock'
import { queryAppliedPoliciesGql } from './query'

const COMPONENT_NAME = 'dashboard/applied-policies-widget'
const SUPPORTED_POLICY_TYPES = [ReconciliationEntityType.NetworkAccessControl]

describe(`${BIG_CONSUMER_NAME}-${BIG_REPORTING_SERVICE_PROVIDER_NAME} ${COMPONENT_NAME} pact`, () => {
  beforeAll(async () => await reportingProvider.setup())

  afterAll(async () => await reportingProvider.finalize())

  SUPPORTED_POLICY_TYPES.forEach(policyType =>
    describe(`get ${COMPONENT_NAME} data with a ${policyType} policy type`, () => {
      const operationVariables: ReportingServiceQueryVariables = {
        fromDate: '1502864593000',
        toDate: '1802864593000',
        filter: { [ReportingServiceFilter.AlertPolicyType]: policyType },
        maxRecords: DASHBOARD_WIDGET_MAX_RECORDS_COUNT,
        tenantId: TENANT_ID_MOCK,
      }

      beforeAll(() => {
        const interaction = new GraphQLInteraction()
          .uponReceiving(`request to get ${COMPONENT_NAME} data with a ${policyType} policy type`)
          .withRequest({ path: BIG_REPORTING_BASE_URL, method: 'POST' })
          .withOperation('queryAppliedPolicies')
          .withQuery(print(queryAppliedPoliciesGql))
          .withVariables(operationVariables)
          .willRespondWith({
            status: 200,
            headers: {
              'Content-Type': Matchers.like('application/json'),
            },
            body: { data: Matchers.like(appliedPoliciesMock[policyType]) },
          })

        return reportingProvider.addInteraction(interaction)
      })

      afterAll(() => reportingProvider.verify())

      it(`should get ${COMPONENT_NAME} data with a ${policyType} policy type`, async () => {
        const response = await reportingConsumer.query({
          query: queryAppliedPoliciesGql,
          variables: operationVariables,
        })

        expect(response.data).toEqual(appliedPoliciesMock[policyType])
      })
    }),
  )
})
