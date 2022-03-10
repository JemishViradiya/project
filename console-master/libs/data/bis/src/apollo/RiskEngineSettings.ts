/* eslint-disable sonarjs/no-nested-template-literals */
import memoizeOne from 'memoize-one'

import { gql } from '@apollo/client'

import type { ApolloQuery } from '@ues-data/shared'
import { APOLLO_DESTINATION, getApolloQueryContext, NoPermissions } from '@ues-data/shared'

import { RiskEnginesSettingsMutationMock, RiskEnginesSettingsQueryMock } from './mocks'

const selection = (riskEnginesSettingsEnabled, ipAddressRisk, networkAnomalyDetection) => `
  learnedGeozones {
    enabled
    geozoneDistance {
      innerRadius {
        value
        unit
      }
      outerRadius {
        value
        unit
      }
    }
  }
  definedGeozones {
    enabled
  }
  behavioral {
    enabled
    riskLevels {
      level
      range {
        min
        max
      }
    }
  }
  appAnomalyDetection {
    enabled
    ${riskEnginesSettingsEnabled ? 'riskLevel range { min max }' : ''}
  }
  ${
    networkAnomalyDetection
      ? `networkAnomalyDetection {
          enabled
          riskLevel
          range {
            min
            max
          }
        }
        `
      : ''
  }
  ipAddress {
    enabled
    ${
      ipAddressRisk
        ? `scoreIfBlacklisted
          scoreIfNotInLists
          scoreIfNoIPAddress
          scoreIfWhitelisted
          vendorScoreCalculationStrategy
          riskLevels {
            level
            range {
              min
              max
            }
          }
          `
        : ''
    }
  }
`

export const RiskEnginesSettingsQuery = memoizeOne(
  (
    riskEnginesSettingsEnabled,
    ipAddressRisk = false,
    networkAnomalyDetection = false,
  ): ApolloQuery<typeof RiskEnginesSettingsQueryMock, void> => ({
    displayName: 'RiskEnginesSettingsQuery',
    query: gql`
    query riskEnginesSettings {
      settings: BIS_riskEnginesSettings {
        ${selection(riskEnginesSettingsEnabled, ipAddressRisk, networkAnomalyDetection)}
      }
    }
  `,
    mockQueryFn: () => RiskEnginesSettingsQueryMock,
    context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
    permissions: NoPermissions,
  }),
)

export const RiskEnginesSettingsMutation = memoizeOne(
  (riskEnginesSettingsEnabled, ipAddressRisk = false, networkAnomalyDetection = false) => ({
    displayName: 'RiskEnginesSettingsMutation',
    mutation: gql`
    mutation setRiskEnginesSettings($settings: RiskEnginesSettingsInput) {
      settings: BIS_setRiskEnginesSettings(settings: $settings) {
        ${selection(riskEnginesSettingsEnabled, ipAddressRisk, networkAnomalyDetection)}
      }
    }
  `,
    mockMutationFn: () => RiskEnginesSettingsMutationMock,
    context: getApolloQueryContext(APOLLO_DESTINATION.BIS_PORTAL_SERVICE),
  }),
)
