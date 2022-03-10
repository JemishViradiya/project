import { ActorDetectionType, RiskLevel } from '@ues-data/shared-types'

const detections = [
  { name: ActorDetectionType.MaliciousAppDetected, level: RiskLevel.High, contributes: true },
  { name: ActorDetectionType.SideLoadedAppDetected, level: RiskLevel.High, contributes: true },
  { name: ActorDetectionType.IosIntegrityFailure, level: RiskLevel.Medium, contributes: true },
  { name: ActorDetectionType.SafetyNetAttestationFailed, level: RiskLevel.Medium, contributes: true },
  { name: ActorDetectionType.UnsafeMessageDetected, level: RiskLevel.Low, contributes: false },
  { name: ActorDetectionType.ScreenLockDisabled, level: RiskLevel.Low, contributes: false },
]
const restOfDetections = Object.values(ActorDetectionType)
  .filter(adt => !detections.map(d => d.name).includes(adt))
  .map(adt => ({
    name: adt,
    level: RiskLevel.Low,
    contributes: false,
  }))

export const DeviceAssessmentQueryMock = {
  items: [
    {
      policyName: 'Policy 1',
      riskLevel: RiskLevel.High,
      deviceId: 'device-1',
      detections: [
        { name: ActorDetectionType.ScreenLockDisabled, level: RiskLevel.High, contributes: true },
        { name: ActorDetectionType.MaliciousAppDetected, level: RiskLevel.High, contributes: true },
      ],
      detectionTime: 1600000000008,
    },
    {
      policyName: 'Policy 1',
      riskLevel: RiskLevel.Medium,
      deviceId: 'device-2',
      detections: [
        { name: ActorDetectionType.UnsupportedSecurityPatchDetected, level: RiskLevel.Medium, contributes: true },
        { name: ActorDetectionType.IosIntegrityFailure, level: RiskLevel.Low, contributes: false },
      ],
      detectionTime: 1600000000000,
    },
    {
      policyName: 'Policy 1',
      deviceId: 'device-3',
      riskLevel: RiskLevel.Low,
      detections: [],
      detectionTime: 1600000000000,
    },
    {
      policyName: 'High Risk Policy',
      riskLevel: RiskLevel.High,
      deviceId: '8bb31f75-42ec-47bb-b910-20e101ae76ab',
      detections: detections.concat(restOfDetections),
      detectionTime: 1600000000008,
    },
    {
      policyName: 'Medium Risk Policy',
      riskLevel: RiskLevel.Medium,
      deviceId: '8bb31f75-42ec-47bb-b910-20e101ae76ah',
      detections: [
        { name: ActorDetectionType.UnsupportedSecurityPatchDetected, level: RiskLevel.Medium, contributes: true },
        { name: ActorDetectionType.IosIntegrityFailure, level: RiskLevel.Low, contributes: false },
      ],
      detectionTime: 1600000000000,
    },
  ],
}
