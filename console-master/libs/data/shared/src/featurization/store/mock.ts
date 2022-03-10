import type { Feature } from './types'
import { FeatureName } from './types'

export const mockFeatures: Feature[] = [
  // Add features that you want to check when app is in a preview mode
  {
    name: FeatureName.ReferenceDiagnostic,
    enabled: true,
  },
  {
    name: FeatureName.EnrollmentProfileEmailRichTextEditor,
    enabled: true,
  },
  {
    name: FeatureName.MobileEnrollment,
    enabled: true,
  },
  {
    name: FeatureName.EIDAuthentication,
    enabled: true,
  },
  {
    name: FeatureName.ARR,
    enabled: true,
  },
  {
    name: FeatureName.UESCronosNavigation,
    enabled: true,
  },
  {
    name: FeatureName.UESBigAclEnabled,
    enabled: true,
  },
  {
    name: FeatureName.UESBigAclMigrationEnabled,
    enabled: true,
  },
  {
    name: FeatureName.UESBigDnsTunnelingEnabled,
    enabled: false,
  },
  {
    name: FeatureName.UESBigIpRepEnabled,
    enabled: false,
  },
  {
    name: FeatureName.SingleNXApp,
    enabled: true,
  },
  {
    name: FeatureName.UESIntuneIntegration,
    enabled: true,
  },
  {
    name: FeatureName.UESTOTPAuthenticatorEnabled,
    enabled: true,
  },
  {
    name: FeatureName.MobileThreatDetection,
    enabled: true,
  },
  {
    name: FeatureName.DevicePolicyMemoryProtectionV2Enabled,
    enabled: true,
  },
  {
    name: FeatureName.DevicePolicyScriptControlV2Enabled,
    enabled: true,
  },
  {
    name: FeatureName.DevicePolicySoftwareInventoryEnabled,
    enabled: true,
  },
  {
    name: FeatureName.UESDevicePolicies,
    enabled: true,
  },
]
