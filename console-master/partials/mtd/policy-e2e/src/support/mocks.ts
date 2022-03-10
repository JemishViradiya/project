/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
export const MtdPolicyMock = {
  type: 'MOBILE_THREAT_DETECTION',
  name: 'Everything',
  description: '',
  warningNotificationsEnabled: true,
  warningNotificationsIntervalType: 'HOURS',
  warningNotificationsCount: 3,
  warningNotificationsInterval: 4,
  dataPrivacyEnabled: true,
  dataPrivacyApplicationName: true,
  dataPrivacyApplicationDeveloperSigningId: false,
  dataPrivacyApplicationPackageName: false,
  dataPrivacyMessageSenderPhoneEmail: false,
  dataPrivacyNetworkSsid: false,
  dataPrivacyUrl: false,
  androidHwAttestationEnabled: true,
  androidHwAttestationSecurityPatchEnabled: true,
  androidHwAttestationSecurityPatchLevelList: [{ date: { day: 1, month: 1, year: 2021 } }],
  androidSafetynetAttestationEnabled: true,
  androidSafetynetAttestationCtsEnabled: false,
  androidMaliciousAppEnabled: true,
  androidMaliciousAppScanSystem: true,
  androidMaliciousAppAlwaysAllowApprovedList: true,
  androidMaliciousAppAlwaysBlockRestrictList: true,
  androidMaliciousAppUploadOverWifi: true,
  androidMaliciousAppUploadOverMobile: false,
  androidMessageScanningEnabled: true,
  androidUnsupportedOsEnabled: false,
  androidUnsupportedModelEnabled: false,
  androidMaliciousAppWifiMaxSize: 0,
  androidMaliciousAppWifiMaxMonthly: 0,
  androidMaliciousAppMobileMaxSize: 0,
  androidMaliciousAppMobileMaxMonthly: 500,
  androidMessageScanningOption: 'CLOUD_SCANNING',
  androidSideLoadedAppEnabled: true,
  androidPrivilegeEscalationEnabled: true,
  androidEncryptionDisabled: true,
  androidCompromisedNetworkEnabled: true,
  androidInsecureWifiEnabled: false,
  androidScreenLockDisabled: true,
  androidKnoxAttestationEnabled: false,
  androidDeveloperModeDetectionEnabled: true,
  androidHwAttestationSecurityLevel: 'SOFTWARE',
  iosUnresponsiveThresholdHours: 8,
  androidScanMsgStartTimeOffset: 8,
  iosScreenLockDisabled: true,
  iosMessageScanningEnabled: true,
  iosCompromisedNetworkEnabled: true,
  iosPrivilegeEscalationEnabled: true,
  iosSideLoadedAppEnabled: true,
  iosIntegrityCheckAttestationEnabled: true,
  iosMessageScanningOption: 'CLOUD_SCANNING',
  iosUnsupportedOsEnabled: false,
  iosUnsupportedModelEnabled: false,
  warningEmailNotificationsEnabled: true,
  modified: 1613533923071,
}

export enum MOCK_WIFI_TYPES {
  'WPA-PSK-CCMP+TKIP',
  'WPA-PSK-CCMP',
  'WPA2-PSK-CCMP+TKIP',
  'WPA2-PSK-CCMP',
  'WPA2-EAP-CCMP',
  'WPA-PSK-TKIP',
  'WPA2-PSK-TKIP',
  'RSN-EAP-CCMP',
  'RSN-PSK-CCMP+TKIP',
  'RSN-PSK-CCMP',
  'RSN-PSK+TKIP',
  'WEP',
  'Open',
}

export const MOCK_ANDROID_OS_VERSIONS = [
  { name: 'Android 9', version: '9' },
  { name: 'Android 9.0', version: '9.0' },
  { name: 'Android 9.0.1', version: '9.0.1' },
  { name: 'Android 9.0.2', version: '9.0.2' },
  { name: 'Android 9.0.3', version: '9.0.3' },
  { name: 'Android 10', version: '10' },
  { name: 'Android 11', version: '11' },
]

export const MOCK_IOS_OS_VERSIONS = [
  { name: 'iOS 11.0', version: '11.0' },
  { name: 'iOS 11.1', version: '11.1' },
  { name: 'iOS 11.2', version: '11.2' },
  { name: 'iOS 11.3', version: '11.3' },
  { name: 'iOS 11.4', version: '11.4' },
  { name: 'iOS 12.0', version: '12.0' },
  { name: 'iOS 12.1', version: '12.1' },
  { name: 'iOS 12.2', version: '12.2' },
  { name: 'iOS 12.3', version: '12.3' },
  { name: 'iOS 12.4', version: '12.4' },
  { name: 'iOS 12.5', version: '12.5' },
  { name: 'iOS 13.0', version: '13.0' },
  { name: 'iOS 13.1', version: '13.1' },
  { name: 'iOS 13.2', version: '13.2' },
  { name: 'iOS 13.3', version: '13.3' },
  { name: 'iOS 13.4', version: '13.4' },
  { name: 'iOS 13.5', version: '13.5' },
  { name: 'iOS 13.6', version: '13.6' },
  { name: 'iOS 13.7', version: '13.7' },
  { name: 'iOS 14.0', version: '14.0' },
  { name: 'iOS 14.1', version: '14.1' },
  { name: 'iOS 14.2', version: '14.2' },
  { name: 'iOS 14.3', version: '14.3' },
  { name: 'iOS 14.4', version: '14.4' },
  { name: 'iOS 14.5', version: '14.5' },
]
