// //******************************************************************************
// // Copyright 2021 BlackBerry. All Rights Reserved.
import 'cross-fetch/polyfill'

import { pactMockAxiosConfigFactory, pactProviderFactory } from '@ues-data/shared-pact'

export { AUTHORIZATION_TOKEN_MOCK } from '@ues-data/shared-pact'

export const TENANT_ID_MOCK = 'L54544746'

export const MTD_DEVICE_METADATA_PACT_CONSUMER_NAME = 'uc@MTD-DeviceMetadata'
export const MTD_DEVICE_METADATA_PACT_PROVIDER_NAME = 'mtd@DeviceMetadata'

export const MTD_EXCLUSION_PACT_CONSUMER_NAME = 'uc@MTD-Exclusion'
export const MTD_EXCLUSION_PACT_PROVIDER_NAME = 'mtd@Exclusion'
export const MTD_COMPLIANCE_PACT_CONSUMER_NAME = 'uc@MTD-ComplianceService'
export const MTD_COMPLIANCE_PACT_PROVIDER_NAME = 'mtd@ComplianceService'

export const deviceMetadataProvider = pactProviderFactory({
  consumer: MTD_DEVICE_METADATA_PACT_CONSUMER_NAME,
  provider: MTD_DEVICE_METADATA_PACT_PROVIDER_NAME,
  pactfileWriteMode: 'update',
})

export const exclusionProvider = pactProviderFactory({
  consumer: MTD_EXCLUSION_PACT_CONSUMER_NAME,
  provider: MTD_EXCLUSION_PACT_PROVIDER_NAME,
  pactfileWriteMode: 'update',
})

export const complianceProvider = pactProviderFactory({
  consumer: MTD_COMPLIANCE_PACT_CONSUMER_NAME,
  provider: MTD_COMPLIANCE_PACT_PROVIDER_NAME,
  pactfileWriteMode: 'update',
})

export const mockedAxiosConfig = pactMockAxiosConfigFactory({ deviceMetadataProvider, complianceProvider, exclusionProvider })
