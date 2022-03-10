import { ChallengeState } from '../../../model'

export const GatewayAlertDetailsMock = {
  eventDetails: {
    assessment: {
      datetime: 1615469503703,
      eEcoId: 'cBFfo6NlSEBUg8QNd7GuEbhJf6XE=',
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
          flowId: 8632038131208974,
          totalEvents: 5,
          totalAnomalousEvents: 0,
        },
      },
      datapoint: {
        datapointId: 'a4c815fe-5a98-418e-9272-94a2931b0ed1',
        source: {
          deviceModel: 'Pixel 3',
          containerId: 'a4c815fe-5a98-418e-927s-94a2931b0ed1',
          os: 'android',
          entitlementId: null,
        },
      },
      userInfo: {
        displayName: 'Rosemarie Stamm',
      },
    },
    sisActions: {
      policyName: 'Policy_e890c7fe-4a89-4485-867d-8a078ea969be',
      actions: [
        {
          type: 'overridePublicInternetAccessPolicy',
          entityId: '182589e2-0a3c-11eb-9ca3-0242ac130002',
          name: 'Demo public network policy',
        },
      ],
    },
    fixup: ChallengeState.NoMfa,
  },
}
