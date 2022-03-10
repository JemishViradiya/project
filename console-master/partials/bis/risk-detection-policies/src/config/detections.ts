import { ActorDetectionType, FeatureName, RiskLevel } from '@ues-data/shared-types'

import type { DetectionConfig, DetectionsCategory, DetectionsCategoryConfig, DetectionsCategoryType } from '../model'
import { DetectionsProvider } from '../model'

export const DETECTIONS_CATEGORIES: readonly DetectionsCategory[] = [
  {
    type: 'network',
    detections: [ActorDetectionType.InsecuredNetworkDetected, ActorDetectionType.InsecuredWifiDetected],
  },
  {
    type: 'application',
    detections: [
      ActorDetectionType.RestrictedAppDetected,
      ActorDetectionType.MaliciousAppDetected,
      ActorDetectionType.SideLoadedAppDetected,
    ],
  },
  {
    type: 'safeBrowsing',
    detections: [ActorDetectionType.UnsafeMessageDetected],
  },
  {
    type: 'deviceSecurity',
    detections: [
      ActorDetectionType.PrivilegeEscalationDetected,
      ActorDetectionType.EncryptionDisabled,
      ActorDetectionType.ScreenLockDisabled,
      ActorDetectionType.UnresponsiveAgent,
      ActorDetectionType.UnsupportedDeviceOSDetected,
      ActorDetectionType.UnsupportedDeviceModelDetected,
      ActorDetectionType.UnsupportedSecurityPatchDetected,
      ActorDetectionType.IosIntegrityFailure,
      ActorDetectionType.SafetyNetAttestationFailed,
      ActorDetectionType.HardwareAttestationFailed,
      ActorDetectionType.DeveloperMode,
    ],
  },
]

const DEFAULT_APPLICABLE_RISK_LEVELS = new Set([RiskLevel.High, RiskLevel.Medium, RiskLevel.Low])

export const DETECTIONS_CONFIG: Record<ActorDetectionType, DetectionConfig> = {
  insecuredNetworkDetected: {
    provider: DetectionsProvider.MTD,
    applicableRiskLevels: DEFAULT_APPLICABLE_RISK_LEVELS,
  },
  insecuredWifiDetected: {
    provider: DetectionsProvider.MTD,
    applicableRiskLevels: DEFAULT_APPLICABLE_RISK_LEVELS,
  },
  maliciousAppDetected: {
    provider: DetectionsProvider.MTD,
    applicableRiskLevels: DEFAULT_APPLICABLE_RISK_LEVELS,
  },
  sideLoadedAppDetected: {
    provider: DetectionsProvider.MTD,
    applicableRiskLevels: DEFAULT_APPLICABLE_RISK_LEVELS,
  },
  privilegeEscalationDetected: {
    provider: DetectionsProvider.MTD,
    applicableRiskLevels: DEFAULT_APPLICABLE_RISK_LEVELS,
  },
  encryptionDisabled: {
    provider: DetectionsProvider.MTD,
    applicableRiskLevels: DEFAULT_APPLICABLE_RISK_LEVELS,
  },
  screenLockDisabled: {
    provider: DetectionsProvider.MTD,
    applicableRiskLevels: DEFAULT_APPLICABLE_RISK_LEVELS,
  },
  unsupportedDeviceOSDetected: {
    provider: DetectionsProvider.MTD,
    applicableRiskLevels: DEFAULT_APPLICABLE_RISK_LEVELS,
  },
  unsupportedDeviceModelDetected: {
    provider: DetectionsProvider.MTD,
    applicableRiskLevels: DEFAULT_APPLICABLE_RISK_LEVELS,
  },
  unsupportedSecurityPatchDetected: {
    provider: DetectionsProvider.MTD,
    applicableRiskLevels: DEFAULT_APPLICABLE_RISK_LEVELS,
  },
  iosIntegrityFailure: {
    provider: DetectionsProvider.MTD,
    applicableRiskLevels: DEFAULT_APPLICABLE_RISK_LEVELS,
  },
  safetyNetAttestationFailed: {
    provider: DetectionsProvider.MTD,
    applicableRiskLevels: DEFAULT_APPLICABLE_RISK_LEVELS,
  },
  hardwareAttestationFailed: {
    provider: DetectionsProvider.MTD,
    applicableRiskLevels: DEFAULT_APPLICABLE_RISK_LEVELS,
  },
  restrictedAppDetected: {
    provider: DetectionsProvider.MTD,
    applicableRiskLevels: DEFAULT_APPLICABLE_RISK_LEVELS,
    features: [FeatureName.MobileThreatDetectionRestrictedAppThreat],
  },
  unsafeMessageDetected: {
    provider: DetectionsProvider.MTD,
    applicableRiskLevels: DEFAULT_APPLICABLE_RISK_LEVELS,
    features: [FeatureName.MobileThreatDetectionUnsafeMsgThreat],
  },
  unresponsiveAgent: {
    provider: DetectionsProvider.MTD,
    applicableRiskLevels: DEFAULT_APPLICABLE_RISK_LEVELS,
    features: [FeatureName.MobileThreatDetectionUnresponsiveAgentThreat],
  },
  developerModeDetected: {
    provider: DetectionsProvider.MTD,
    applicableRiskLevels: DEFAULT_APPLICABLE_RISK_LEVELS,
    features: [FeatureName.MobileThreatDetectionDeveloperModeThreat],
  },
}

export const DETECTIONS_CATEGORIES_CONFIG: Record<DetectionsCategoryType, DetectionsCategoryConfig> = {
  identity: {
    provider: DetectionsProvider.BIS,
  },
  network: {
    provider: DetectionsProvider.MTD,
  },
  application: {
    provider: DetectionsProvider.MTD,
  },
  safeBrowsing: {
    provider: DetectionsProvider.MTD,
  },
  deviceSecurity: {
    provider: DetectionsProvider.MTD,
  },
}

export const RISK_LEVELS_LIST = [RiskLevel.High, RiskLevel.Medium, RiskLevel.Low, RiskLevel.Secured]
