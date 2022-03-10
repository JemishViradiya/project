import { gql } from '@apollo/client'

import type { ApolloMutation, ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, ApolloDataUtils, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import type { OperatingMode } from '../model'
import { ClientParamsQuery } from './ClientParams'
import { GeneralSettingsMutationMock, GeneralSettingsQueryMock } from './mocks'

export interface GeneralSettingsValues {
  audit?: {
    userName: string
    datetime: number
  }
  dataRetentionPeriod?: number
  privacyMode?: {
    mode?: boolean
  }
  tenantSettings?: {
    operatingMode?: OperatingMode
  }
}

export interface GeneralSettings {
  settings: GeneralSettingsValues
}

const query = ClientParamsQuery()

const selection = `
  audit {
    userName
    datetime
  }
  dataRetentionPeriod
  privacyMode {
    mode
  }
  tenantSettings {
    operatingMode
  }
`

export const GeneralSettingsQuery: ApolloQuery<GeneralSettings, void> = {
  displayName: 'GeneralSettingsQuery',
  query: gql`
    query getGeneralSettings {
      settings: BIS_generalSettings {
        ${selection}
      }
    }
  `,
  mockQueryFn: () => GeneralSettingsQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}

export const GeneralSettingsMutation: ApolloMutation<GeneralSettings, GeneralSettings> = {
  mutation: gql`
    mutation setGeneralSettings($settings: GeneralSettingsInput) {
      settings: BIS_setGeneralSettings(settings: $settings) {
        ${selection}
      }
    }
  `,
  update: (cache, { data: { settings } }) => {
    const { query: clientParamsQuery } = query
    const { clientParams = {}, clientParams: { privacyMode = {} } = {} } = ApolloDataUtils.getApolloCachedValue(cache, {
      query: clientParamsQuery,
    })
    cache.writeQuery({
      query: clientParamsQuery,
      data: {
        clientParams: {
          ...clientParams,
          dataRetentionPeriod: settings.dataRetentionPeriod,
          privacyMode: { ...privacyMode, mode: settings.privacyMode },
        },
      },
    })
    cache.writeQuery({
      query: GeneralSettingsQuery.query,
      data: {
        settings,
      },
    })
  },
  mockMutationFn: () => GeneralSettingsMutationMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
}
