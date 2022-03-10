// //******************************************************************************
// // Copyright 2021 BlackBerry. All Rights Reserved.
import 'cross-fetch/polyfill'

import { pactMockAxiosConfigFactory, pactProviderFactory } from '@ues-data/shared-pact'

export { AUTHORIZATION_TOKEN_MOCK } from '@ues-data/shared-pact'

export const PLATFORM_DIRECTORY_PACT_CONSUMER_NAME = 'uc@Platform-Directory'
export const PLATFORM_DIRECTORY_PACT_PROVIDER_NAME = 'ecs@Directory'

export const directoryProvider = pactProviderFactory({
  consumer: PLATFORM_DIRECTORY_PACT_CONSUMER_NAME,
  provider: PLATFORM_DIRECTORY_PACT_PROVIDER_NAME,
})

export const mockedAxiosConfig = pactMockAxiosConfigFactory({ directoryProvider })

export const PLATFORM_BFFGRID_PACT_CONSUMER_NAME = 'uc@ecs-BffGrid'
export const PLATFORM_BFFGRID_PACT_PROVIDER_NAME = 'ecs@BffGrid'

export const bffGridProvider = pactProviderFactory({
  consumer: PLATFORM_BFFGRID_PACT_CONSUMER_NAME,
  provider: PLATFORM_BFFGRID_PACT_PROVIDER_NAME,
})

export const mockedBffGridAxiosConfig = pactMockAxiosConfigFactory({ bffGridProvider })
