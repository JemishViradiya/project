// //******************************************************************************
// // Copyright 2021 BlackBerry. All Rights Reserved.
import 'cross-fetch/polyfill'

import { pactMockAxiosConfigFactory, pactProviderFactory } from '@ues-data/shared-pact'

export { HTTP_STATUS_CODE_OK } from '@ues-data/shared-pact'

export const HTTP_STATUS_CREATED = 201
export const TEMPLATE_ID_MOCK = '8f6b5e73-2345-45ac-a71d-872d45142166'
export const AUTHORIZATION_TOKEN_MOCK = 'Bearer 2021-02-18T17:18:54.045Z'

export const DLP_TEMPLATE_PACT_CONSUMER_NAME = 'dlp@Gateway-Template'
export const DLP_TEMPLATE_PACT_PROVIDER_NAME = 'dlp@Template'

export const templateProvider = pactProviderFactory({
  consumer: DLP_TEMPLATE_PACT_CONSUMER_NAME,
  provider: DLP_TEMPLATE_PACT_PROVIDER_NAME,
})

export const DLP_BROWSER_DOMAIN_PACT_CONSUMER_NAME = 'dlp@Gateway-BrowserDomain'
export const DLP_BROWSER_DOMAIN_PACT_PROVIDER_NAME = 'dlp@BrowserDomain'

export const domainProvider = pactProviderFactory({
  consumer: DLP_BROWSER_DOMAIN_PACT_CONSUMER_NAME,
  provider: DLP_BROWSER_DOMAIN_PACT_CONSUMER_NAME,
})

export const DLP_CERTIFICATE_PACT_CONSUMER_NAME = 'dlp@Gateway-Certificate'
export const DLP_CERTIFICATE_PACT_PROVIDER_NAME = 'dlp@Certiifcate'

export const certificateProvider = pactProviderFactory({
  consumer: DLP_CERTIFICATE_PACT_CONSUMER_NAME,
  provider: DLP_CERTIFICATE_PACT_CONSUMER_NAME,
})

export const DLP_DATA_ENTITY_PACT_CONSUMER_NAME = 'dlp@Gateway-DataEntity'
export const DLP_DATA_ENTITY_PACT_PROVIDER_NAME = 'dlp@DataEntity'

export const dataEntityProvider = pactProviderFactory({
  consumer: DLP_DATA_ENTITY_PACT_CONSUMER_NAME,
  provider: DLP_DATA_ENTITY_PACT_CONSUMER_NAME,
})

export const DLP_POLICY_PACT_CONSUMER_NAME = 'dlp@Gateway-Policy'
export const DLP_POLICY_PACT_PROVIDER_NAME = 'dlp@Policy'

export const policyProvider = pactProviderFactory({
  consumer: DLP_POLICY_PACT_CONSUMER_NAME,
  provider: DLP_POLICY_PACT_PROVIDER_NAME,
})

export const DLP_TENANT_CONFIGS_PACT_CONSUMER_NAME = 'dlp@Gateway-TenantConfigs'
export const DLP_TENANT_CONFIGS_PACT_PROVIDER_NAME = 'dlp@TenantConfigs'

export const tenantConfigsProvider = pactProviderFactory({
  consumer: DLP_TENANT_CONFIGS_PACT_CONSUMER_NAME,
  provider: DLP_TENANT_CONFIGS_PACT_PROVIDER_NAME,
})

export const mockedAxiosConfig = pactMockAxiosConfigFactory({ templateProvider, policyProvider, tenantConfigsProvider })
