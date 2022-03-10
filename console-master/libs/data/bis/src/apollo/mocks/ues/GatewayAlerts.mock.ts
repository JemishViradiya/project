/* eslint-disable sonarjs/no-duplicate-string */

import { ActionType, ChallengeState, OperatingMode } from '../../../model'
import { BISEngineTrainingStatusQueryMock } from './EngineTrainingStatus.mock'

export const GatewayAlertsQueryMock = BISEngineTrainingStatusQueryMock.trainingStatus.networkAnomalyDetection
  ? {
      eventInfiniteScroll: {
        total: 0,
        events: [],
      },
    }
  : {
      eventInfiniteScroll: {
        total: 61,
        events: [
          {
            id: 'vgJ8IXgByFP9XJIDj1-C',
            assessment: {
              eEcoId: 'aNlmKIIU7O9ZF/nJecfSgj3vZtcc=',
              userInfo: {
                displayName: 'UES',
              },
              datetime: 1615469503703,
              identityAndBehavioralRisk: {
                level: 'CRITICAL',
              },
              mappings: {
                behavioral: {
                  score: -1,
                  riskLevel: null,
                },
                networkAnomalyDetection: null,
              },
              datapoint: {
                source: {
                  deviceModel: null,
                  containerId: null,
                  os: null,
                  entitlementId: null,
                },
              },
            },
            sisActions: {
              policyName: 'Policy_6104943d-8bec-4279-8899-9710d96d50cf',
              actions: [
                {
                  type: ActionType.OverrideNetworkAccessControlPolicy,
                  name: 'Demo network access control policy',
                },
              ],
            },
            operatingMode: OperatingMode.PASSIVE,
            fixup: ChallengeState.Deny,
          },
          {
            id: 'xgJ8IXgByFP9XJIDj1-C',
            assessment: {
              eEcoId: '2/00M+Ae2PQ7RRvH+oIdFBrZsNe4=',
              userInfo: {
                displayName: 'UES',
              },
              datetime: 1615469503703,
              identityAndBehavioralRisk: {
                level: 'MEDIUM',
              },
              mappings: {
                behavioral: {
                  score: 44.06273318439557,
                  riskLevel: 'MEDIUM',
                },
                networkAnomalyDetection: {
                  riskScore: 94.52693239704459,
                },
              },
              datapoint: {
                source: {
                  deviceModel: null,
                  containerId: null,
                  os: null,
                  entitlementId: null,
                },
              },
            },
            sisActions: {
              policyName: null,
              actions: [],
            },
            operatingMode: OperatingMode.ACTIVE,
            fixup: ChallengeState.Failed,
          },
          {
            id: 'ywJ8IXgByFP9XJIDj1-D',
            assessment: {
              eEcoId: 'cBFfo6NlSEBUg8QNd7GuEbhJf6XE=',
              userInfo: {
                displayName: 'UES',
              },
              datetime: 1615469503703,
              identityAndBehavioralRisk: {
                level: 'CRITICAL',
              },
              mappings: {
                behavioral: {
                  score: 91.05555976389506,
                  riskLevel: 'CRITICAL',
                },
                networkAnomalyDetection: {
                  riskScore: 97.28668660803932,
                },
              },
              datapoint: {
                source: {
                  deviceModel: null,
                  containerId: null,
                  os: null,
                  entitlementId: null,
                },
              },
            },
            sisActions: {
              policyName: 'Policy_e890c7fe-4a89-4485-867d-8a078ea969be',
              actions: [
                {
                  type: 'mdm:assignITPolicyOverrideProfile',
                  name: null,
                },
                {
                  type: ActionType.OverrideNetworkAccessControlPolicy,
                  name: 'Demo public network policy',
                },
              ],
            },
            operatingMode: OperatingMode.ACTIVE,
            fixup: ChallengeState.InProgress,
          },
          {
            id: '1wJ8IXgByFP9XJIDj1-D',
            assessment: {
              eEcoId: 'Lu/TLeIdTwLVn88JXcpK5Qt6rEHs=',
              userInfo: {
                displayName: 'UES',
              },
              datetime: 1615469503703,
              identityAndBehavioralRisk: {
                level: 'MEDIUM',
              },
              mappings: {
                behavioral: {
                  score: 7.567342922611125,
                  riskLevel: 'UNKNOWN',
                },
                networkAnomalyDetection: {
                  riskScore: 25.356075853820208,
                },
              },
              datapoint: {
                source: {
                  deviceModel: 'Model Mars',
                  containerId: '12334467',
                  os: 'android',
                  entitlementId: null,
                },
              },
            },
            sisActions: {
              policyName: null,
              actions: [],
            },
            operatingMode: OperatingMode.ACTIVE,
            fixup: ChallengeState.NoMfa,
          },
          {
            id: 'vgJ8IXgByFP9XJIDj1-C',
            assessment: {
              eEcoId: 'aNlmKIIU7O9ZF/nJecfSgj3vZtcc=',
              userInfo: {
                displayName: 'UES',
              },
              datetime: 1615469503703,
              identityAndBehavioralRisk: {
                level: 'CRITICAL',
              },
              mappings: {
                behavioral: {
                  score: -1,
                  riskLevel: null,
                },
                networkAnomalyDetection: null,
              },
              datapoint: {
                source: {
                  deviceModel: null,
                  containerId: null,
                  os: null,
                  entitlementId: null,
                },
              },
            },
            sisActions: {
              policyName: 'Policy_6104943d-8bec-4279-8899-9710d96d50cf',
              actions: [
                {
                  type: ActionType.OverrideNetworkAccessControlPolicy,
                  name: 'Demo network access control policy',
                },
              ],
            },
            operatingMode: OperatingMode.PASSIVE,
            fixup: ChallengeState.MfaSkipped,
          },
          {
            id: '2wJ8IXgByFP9XJIDj1-D',
            assessment: {
              eEcoId: 'FS0jtactcDkmem9Fgi10sC09szP4=',
              userInfo: {
                displayName: 'UES',
              },
              datetime: 1615469503703,
              identityAndBehavioralRisk: {
                level: 'HIGH',
              },
              mappings: {
                behavioral: {
                  score: 44.807645745338846,
                  riskLevel: 'HIGH',
                },
                networkAnomalyDetection: {
                  riskScore: 2.8968799344012375,
                },
              },
              datapoint: {
                source: {
                  deviceModel: 'Model Moon',
                  containerId: '9876543',
                  os: 'ios',
                  entitlementId: 'com.blackberry.ues',
                },
              },
            },
            sisActions: {
              policyName: 'Policy_9da91b9f-0953-4610-8f4f-2998ef8b7b40',
              actions: [
                {
                  type: 'uem:wipeDevice',
                  name: null,
                },
              ],
            },
            operatingMode: OperatingMode.ACTIVE,
            fixup: ChallengeState.NotApplicable,
          },
          {
            id: '3QJ8IXgByFP9XJIDj1-D',
            assessment: {
              eEcoId: '7m0IBZuhF4xjw77S6/W9R0+ix9yo=',
              userInfo: {
                displayName: 'UES',
              },
              datetime: 1615469503703,
              identityAndBehavioralRisk: {
                level: 'MEDIUM',
              },
              mappings: {
                behavioral: {
                  score: 96.68650039057968,
                  riskLevel: 'MEDIUM',
                },
                networkAnomalyDetection: {
                  riskScore: 75.97094258683454,
                },
              },
              datapoint: {
                source: {
                  deviceModel: 'Model Mars',
                  containerId: '45673',
                  os: 'android',
                  entitlementId: null,
                },
              },
            },
            sisActions: {
              policyName: 'Policy_39aa9cc1-a3d4-4034-a8ea-f989899e46a0',
              actions: [
                {
                  type: 'app:blockApplication',
                  name: null,
                },
                {
                  type: 'uem:assignGroup',
                  name: null,
                },
              ],
            },
            operatingMode: OperatingMode.ACTIVE,
            fixup: ChallengeState.Ok,
          },
          {
            id: '4gJ8IXgByFP9XJIDj1-D',
            assessment: {
              eEcoId: 'jr006aus6QAwB8ZjRTUdo4IYnYqs=',
              userInfo: {
                displayName: 'UES',
              },
              datetime: 1615469503703,
              identityAndBehavioralRisk: {
                level: 'CRITICAL',
              },
              mappings: {
                behavioral: {
                  score: 56.27256168625124,
                  riskLevel: 'CRITICAL',
                },
                networkAnomalyDetection: {
                  riskScore: 11.543392001018724,
                },
              },
              datapoint: {
                source: {
                  deviceModel: 'iPhone9,3',
                  containerId: '127373',
                  os: 'ios',
                  entitlementId: 'com.blackberry.ues',
                },
              },
            },
            sisActions: {
              policyName: null,
              actions: [],
            },
            operatingMode: OperatingMode.ACTIVE,
            fixup: ChallengeState.Timeout,
          },
          {
            id: '6gJ8IXgByFP9XJIDj1-D',
            assessment: {
              eEcoId: 'Z/NZVSygc4LxD/6F9htvDyVHGASc=',
              userInfo: {
                displayName: 'UES',
              },
              datetime: 1615469503703,
              identityAndBehavioralRisk: {
                level: 'HIGH',
              },
              mappings: {
                behavioral: {
                  score: 52.92863778940523,
                  riskLevel: 'HIGH',
                },
                networkAnomalyDetection: {
                  riskScore: 16,
                },
              },
              datapoint: {
                source: {
                  deviceModel: 'Model Sun',
                  containerId: '37248923739',
                  os: 'android',
                  entitlementId: 'com.blackberry.ues',
                },
              },
            },
            sisActions: {
              policyName: 'Policy_ddf272c3-33f4-4bec-a2fb-bc86ba50b14a',
              actions: [
                {
                  type: 'app:blockApplication',
                  name: null,
                },
              ],
            },
            operatingMode: OperatingMode.ACTIVE,
            fixup: ChallengeState.Unknown,
          },
          {
            id: 'twJ8IXgByFP9XJIDg19Z',
            assessment: {
              eEcoId: 'gFQeXQ8SKVrk7cZdFSa2YyOR49lI=',
              userInfo: {
                displayName: 'UES',
              },
              datetime: 1615469503703,
              identityAndBehavioralRisk: {
                level: 'CRITICAL',
              },
              mappings: {
                behavioral: {
                  score: 86.0712678552462,
                  riskLevel: 'CRITICAL',
                },
                networkAnomalyDetection: {
                  riskScore: 20.94205916947419,
                },
              },
              datapoint: {
                source: {
                  deviceModel: 'Pixel 3',
                  containerId: '393264297346',
                  os: 'android',
                  entitlementId: null,
                },
              },
            },
            sisActions: {
              policyName: 'Policy_22dc404a-459d-474d-9ff9-2b5da8328c1d',
              actions: [
                {
                  type: 'uem:unblockApplications',
                  name: null,
                },
                {
                  type: 'app:reAuthenticateToConfirm',
                  name: null,
                },
              ],
            },
            operatingMode: OperatingMode.ACTIVE,
            fixup: ChallengeState.Deny,
          },
          {
            id: '3QJ8IXgByFP9XJIDj1-D',
            assessment: {
              eEcoId: '7m0IBZuhF4xjw77S6/W9R0+ix9yo=',
              userInfo: {
                displayName: 'UES',
              },
              datetime: 1615469503703,
              identityAndBehavioralRisk: {
                level: 'MEDIUM',
              },
              mappings: {
                behavioral: {
                  score: 96.68650039057968,
                  riskLevel: 'MEDIUM',
                },
                networkAnomalyDetection: {
                  riskScore: 75.97094258683454,
                },
              },
              datapoint: {
                source: {
                  deviceModel: 'Model Mars',
                  containerId: '4897538927324',
                  os: 'android',
                  entitlementId: 'com.blackberry.ues',
                },
              },
            },
            sisActions: {
              policyName: 'Policy_39aa9cc1-a3d4-4034-a8ea-f989899e46ax',
              actions: [
                {
                  type: 'app:blockApplication',
                  name: null,
                },
                {
                  type: 'uem:assignGroup',
                  name: null,
                },
              ],
            },
            operatingMode: OperatingMode.ACTIVE,
            fixup: ChallengeState.MfaSkipped,
          },
        ],
      },
    }
