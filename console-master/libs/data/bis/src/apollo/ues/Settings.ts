import { gql } from '@apollo/client'

import type { ApolloMutation, ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import type { OperatingMode, RiskLevelTypes } from '../../model'
import {
  UESGeneralSettingsQueryMock,
  UESRiskEnginesSettingsQueryMock,
  UESSettingsMutationMock,
  UESSettingsQueryMock,
} from '../mocks'

export interface GeneralSettingsOptions {
  generalSettings: {
    tenantSettings: {
      operatingMode: OperatingMode
    }
  }
}

export interface RiskEnginesSettingsOptions {
  riskEnginesSettings: {
    networkAnomalyDetection: {
      enabled: boolean
      riskLevel: RiskLevelTypes
      range: {
        min: number
        max: number
      }
    }
  }
}

export interface SettingsOptions extends GeneralSettingsOptions, RiskEnginesSettingsOptions {}

const generalSettingsSelection = `
  tenantSettings {
    operatingMode
  }
`

const riskEnginesSettingsSelection = `
  networkAnomalyDetection {
    enabled
    riskLevel
    range {
      min
      max
    }
  }
`

export const UESGeneralSettingsQuery: ApolloQuery<GeneralSettingsOptions, void> = {
  displayName: 'UESGeneralSettingsQuery',
  query: gql`
    query getGeneralSettings {
      generalSettings: BIS_generalSettings {
        ${generalSettingsSelection}
      }
    }
  `,
  mockQueryFn: () => UESGeneralSettingsQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}

export const UESRiskEnginesSettingsQuery: ApolloQuery<RiskEnginesSettingsOptions, void> = {
  displayName: 'UESRiskEnginesSettingsQuery',
  query: gql`
    query getRiskEnginesSettings {
      riskEnginesSettings: BIS_riskEnginesSettings {
        ${riskEnginesSettingsSelection}
      }
    }
  `,
  mockQueryFn: () => UESRiskEnginesSettingsQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}

export const UESSettingsQuery: ApolloQuery<SettingsOptions, void> = {
  displayName: 'UESSettingsQuery',
  query: gql`
    query getSettings {
      generalSettings: BIS_generalSettings {
        ${generalSettingsSelection}
      }
      riskEnginesSettings: BIS_riskEnginesSettings {
        ${riskEnginesSettingsSelection}
      }
    }
  `,
  mockQueryFn: () => UESSettingsQueryMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  permissions: NoPermissions,
}

export const UESSettingsMutation: ApolloMutation<GeneralSettingsOptions, GeneralSettingsOptions> = {
  mutation: gql`
    mutation setSettings($generalSettings: GeneralSettingsInput) {
      generalSettings: BIS_setGeneralSettings(settings: $generalSettings) {
        ${generalSettingsSelection}
      }
    }
  `,
  update: (cache, { data }) => {
    cache.writeQuery({
      query: UESSettingsQuery.query,
      data,
    })
  },
  mockMutationFn: () => UESSettingsMutationMock,
  context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
}
