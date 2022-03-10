import { RiskLevel } from '@ues-data/shared-types'

export const DetectionPolicyQueryMock = {
  detectionPolicy: {
    id: 'd792c82b-4700-4a61-9817-3e5c9db672dc',
    name: 'Detection policy 1',
    description: 'My detection policy 1',
    updatedByUser: 'Xardas',
    updatedAt: 1615929151349,
    policyData: {
      arr: {
        enabled: true,
        minimumRiskLevel: RiskLevel.Medium,
      },
      deviceRiskDetection: {
        riskDetections: [
          {
            riskLevel: RiskLevel.High,
            detections: [
              {
                name: 'insecuredNetworkDetected',
              },
              {
                name: 'maliciousAppDetected',
              },
              {
                name: 'sideLoadedAppDetected',
              },
            ],
          },
          {
            riskLevel: RiskLevel.Medium,
            detections: [
              {
                name: 'insecuredWifiDetected',
              },
            ],
          },
          {
            riskLevel: RiskLevel.Low,
            detections: [
              {
                name: 'privilegeEscalationDetected',
              },
            ],
          },
        ],
      },
    },
  },
}

export const DefaultDetectionPolicyQueryMock = {
  detectionPolicy: {
    id: 'd792c82b-4700-4a61-9817-3e5c9db672dc',
    name: 'defaultDetectionPolicy',
    description: 'My detection policy 1',
    updatedByUser: 'Xardas',
    updatedAt: 1615929151349,
    policyData: {
      arr: {
        enabled: true,
        minimumRiskLevel: RiskLevel.Medium,
      },
      default: true,
      deviceRiskDetection: {
        riskDetections: [
          {
            riskLevel: RiskLevel.High,
            detections: [
              {
                name: 'insecuredNetworkDetected',
              },
              {
                name: 'maliciousAppDetected',
              },
              {
                name: 'sideLoadedAppDetected',
              },
            ],
          },
          {
            riskLevel: RiskLevel.Medium,
            detections: [
              {
                name: 'insecuredWifiDetected',
              },
            ],
          },
          {
            riskLevel: RiskLevel.Low,
            detections: [
              {
                name: 'privilegeEscalationDetected',
              },
            ],
          },
        ],
      },
    },
  },
}

export const CreateDetectionPolicyMutationMock = {
  createDetectionPolicy: {
    name: 'Detection policy',
    description: 'My detection policy',
    id: 'd792c82b-4700-4a48-9817-3e5c9db672dc',
  },
}

export const UpdateDetectionPolicyMutationMock = {
  updateDetectionPolicy: {
    name: 'Detection policy',
    description: 'My detection policy',
    id: 'd792c82b-4700-4a68-9817-3e5c9db672dc',
  },
}

export const DeleteDetectionPoliciesMutationMock = {
  deleteDetectionPolicies: {
    success: ['d792c82b-4700-4a68-9817-3e5c9db672dc'],
    fail: [],
  },
}
