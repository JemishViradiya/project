//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.
import 'cross-fetch/polyfill'

import { pactMockApolloConfigFactory, pactMockAxiosConfigFactory, pactProviderFactory } from '@ues-data/shared-pact'

export { HTTP_STATUS_CODE_OK } from '@ues-data/shared-pact'

export const TENANT_ID_MOCK = 'L75473134'
export const AUTHORIZATION_TOKEN_MOCK = 'Bearer 2019-01-14T11:34:18.045Z'
export const BIG_CONSUMER_NAME = 'big@Console'

// rest services
export const BIG_POLICY_SERVICE_PROVIDER_NAME = 'big@Policy'

export const BIG_TENANT_SERVICE_PROVIDER_NAME = 'big@Tenant'

export const policyProvider = pactProviderFactory({
  consumer: BIG_CONSUMER_NAME,
  provider: BIG_POLICY_SERVICE_PROVIDER_NAME,
})

export const tenantProvider = pactProviderFactory({
  consumer: BIG_CONSUMER_NAME,
  provider: BIG_TENANT_SERVICE_PROVIDER_NAME,
})

export const mockedAxiosConfig = pactMockAxiosConfigFactory({ policyProvider, tenantProvider })

// graphql services
export const BIG_REPORTING_SERVICE_PROVIDER_NAME = 'big@Reporting'
export const BIG_REPORTING_BASE_URL = '/reporting/graphql'

export const reportingProvider = pactProviderFactory({
  consumer: BIG_CONSUMER_NAME,
  provider: BIG_REPORTING_SERVICE_PROVIDER_NAME,
})
export const reportingConsumer = pactMockApolloConfigFactory(reportingProvider, BIG_REPORTING_BASE_URL)
