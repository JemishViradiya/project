/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

export enum FeatureName {
  ARR = 'UES.ARR.Enabled',
  BisBehaviouralLocationEnabled = 'ues.bis.behaviouralLocation.enabled',
  BisGeofenceEnabled = 'ues.bis.geofence.enabled',
  BisIpFenceEnabled = 'ues.bis.ipfence.enabled',
  DeploymentsUpdateRulesEnabled = 'Deployments.UpdateRules.enabled',
  DeploymentsUpdateStrategiesEnabled = 'Deployments.UpdateStrategies.enabled',
  EIDAuthentication = 'UES.EIDAuthentication.Enabled',
  EnrollmentProfileEmailRichTextEditor = 'UES.EnrollmentProfileEmailRichTextEditor.Enabled',
  ExclusionIosRestricted = 'mtd.exclusion.ios.restricted.enabled',
  ExclusionIosSafeApps = 'mtd.exclusion.ios.safe.apps.enabled',
  MobileEnrollment = 'UES.MobileEnrollment.Enabled',
  MobileThreatDetection = 'UES.MTD.enabled',
  MobileThreatDetectionAlertIncludeExport = 'UES.MTD.alert.export.Enabled',
  MobileThreatDetectionDeveloperModeThreat = 'UES.MTD.developerMode.threat.enabled',
  MobileThreatDetectionKnoxAttestationThreat = 'UES.MTD.knoxAttestation.threat.enabled',
  MobileThreatDetectionReportingOnlyMode = 'UES.MTD.reportingOnlyMode.enabled',
  MobileThreatDetectionRestrictedAppThreat = 'UES.MTD.restrictedApp.threat.enabled',
  MobileThreatDetectionUnresponsiveAgentThreat = 'UES.MTD.unresponsiveAgent.threat.enabled',
  MobileThreatDetectionUnsafeMsgThreat = 'UES.MTD.unsafeMsg.threat.enabled',
  MockDataBypassMode = 'UES.MockDataBypassMode.Enabled',
  // flag control the RBAC checks on the UI to help with release of dependancies
  PermissionChecksEnabled = 'ues.permission.checks.enabled',
  PolicyAuthenticationBrowserFirstSeen = 'UES.policyAuthentication.BrowserFirstSeen.Enabled',
  PolicyAuthenticationException = 'UES.policyAuthentication.Exception.Enabled',
  ReferenceDiagnostic = 'UES.ReferenceDiagnostics.Enabled',
  SingleNXApp = 'ues.single.nx.app.enabled',
  UESActionOrchestrator = 'ues.action.orchestrator.enabled',
  UESBigAclEnabled = 'UES.big.ACL.Enabled',
  UESBigAclMigrationEnabled = 'ues.big.acl.migration.enabled',
  UESBigDnsTunnelingEnabled = 'ues.big.dns.tunneling.enabled',
  UESBigIpRepEnabled = 'ues.big.ip.rep.threshold.enabled',
  UESBigWindowsTunnelEnabled = 'ues.big.windows.tunnel.enabled',
  UESCronosNavigation = 'ues.nav.cronos.enabled',
  UESDlpMobileNavigation = 'ues.bip.mobile.policy.enabled',
  UESDlpNavigation = 'ues.bip.enabled',
  UESIntuneConnector = 'ues.emmconnector.enabled',
  UESIntuneIntegration = 'ues.intune.integration.enabled',
  UESNavigationGatewayAlertsTransition = 'ues.navigation.gatewayalerts.transition',
  UESPersonaDashboard = 'ues.persona.dashboard.enabled',
  UESPersonaUsers = 'ues.persona.users.enabled',
  UESTOTPAuthenticatorEnabled = 'ues.eid.totp.authenticator.enabled',
  UESTOTPEnrollmentEnabled = 'ues.eid.totp.enrollment.enabled',
  DevicePolicyMemoryProtectionV2Enabled = 'Policy.MemoryProtectionV2.enabled',
  DevicePolicyScriptControlV2Enabled = 'Policy.ScriptControlV2.enabled',
  DevicePolicySoftwareInventoryEnabled = 'Policy.SoftwareInventory.enabled',
  UESUEMConnector = 'ues.uemconnector.enabled',
  UESDevicePolicies = 'ues.devicepolicies.enabled',
  UESBigDNSPrivacyEnabled = 'ues.big.dns.privacy.enabled',
  UESBigMacOSProtectEnabled = 'ues.big.macos.protect.enabled',
}

export type Feature = {
  name: FeatureName
  enabled: boolean
}

export interface FeaturesState {
  features?: Feature[]
  overrides?: Feature[]
  loaded?: boolean
  initializationPromise?: Promise<void>
}
