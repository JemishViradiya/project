//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.
import { AdaptiveResponsePolicies } from '@ues-bis/adaptive-response-policies'
import { RiskDetectionPolicies } from '@ues-bis/risk-detection-policies'
import type { IsFeatureEnabled } from '@ues-data/shared'
import { FeatureName } from '@ues-data/shared'
import { EnterpriseIdentityPolicies } from '@ues-eid/policy'
import { GatewayPolicies } from '@ues-gateway/policies'
import { DlpContentPolicy, DlpMobilePolicy } from '@ues-info/policy'
import { ProtectMobilePolicies } from '@ues-mtd/policy'
import { ActivationProfiles } from '@ues-platform/policies'
import { HelpLinks } from '@ues/assets'
import type { TabRouteObject } from '@ues/behaviours'

const [NetworkAccessControl, GatewayApp] = GatewayPolicies

export const Routes: (TabRouteObject & {
  helpLink?: HelpLinks
  feaurizedHelpLink?: (isEnabled: IsFeatureEnabled) => HelpLinks
})[] = [
  {
    ...ActivationProfiles,
    translations: {
      label: 'profiles:navigation.activation.label',
    },
    feaurizedHelpLink: isEnabled =>
      isEnabled(FeatureName.UESCronosNavigation) ? HelpLinks.Enrollment_Cronos : HelpLinks.Enrollment,
  },
  {
    ...NetworkAccessControl,
    translations: {
      label: 'profiles:navigation.networkAccessControl.label',
    },
    helpLink: HelpLinks.NetworkAccessControl,
  },
  {
    ...GatewayApp,
    helpLink: HelpLinks.GatewayService,
    translations: {
      label: 'profiles:navigation.gatewayService.label',
    },
  },
  {
    ...EnterpriseIdentityPolicies,
    translations: {
      label: 'profiles:navigation.enterpriseIdentity.label',
    },
    helpLink: HelpLinks.AuthenticationPolicy,
  },
  {
    ...ProtectMobilePolicies,
    features: isEnabled => isEnabled(FeatureName.MobileThreatDetection) && isEnabled(FeatureName.UESCronosNavigation),
    translations: {
      label: 'profiles:navigation.mobileDeviceThreats.label',
    },
    helpLink: HelpLinks.ProtectMobilePolicy,
  },
  {
    ...AdaptiveResponsePolicies,
    helpLink: HelpLinks.PoliciesAdaptiveResponse,
    features: (isEnabled, extraTenantFeatures) => !extraTenantFeatures?.isMigratedToDP,
    translations: {
      label: 'profiles:navigation.adaptiveResponse.label',
    },
  },
  {
    ...RiskDetectionPolicies,
    helpLink: HelpLinks.PoliciesRiskDetection,
    features: (isEnabled, extraTenantFeatures) =>
      isEnabled(FeatureName.UESActionOrchestrator) && extraTenantFeatures?.isMigratedToDP,
    translations: {
      label: 'profiles:navigation.riskDetection.label',
    },
  },
  {
    ...DlpContentPolicy,
    features: isEnabled => isEnabled(FeatureName.UESDlpNavigation),
    translations: {
      label: 'profiles:navigation.dlpContentThreads.label',
    },
    helpLink: HelpLinks.DlpContentPolicy,
  },
  {
    ...DlpMobilePolicy,
    features: isEnabled => isEnabled(FeatureName.UESDlpMobileNavigation),
    translations: {
      label: 'profiles:navigation.dlpMobileThreads.label',
    },
    helpLink: HelpLinks.DlpMobilePolicy,
  },
]
