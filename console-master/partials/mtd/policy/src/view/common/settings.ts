/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
export enum POLICY_SMS_SCANNING_OPTIONS {
  CLOUD_SCANNING = 'CLOUD_SCANNING',
  ON_DEVICE_SCANNING = 'ON_DEVICE_SCANNING',
  NO_SCANNING = 'NO_SCANNING',
}

export enum POLICY_WARNING_NOTIFICATION_INTERVAL {
  MINUTES = 'MINUTES',
  HOURS = 'HOURS',
  DAYS = 'DAYS',
}

export enum POLICY_HW_ATTESTATION_SECURITY_LEVEL {
  SOFTWARE = 'SOFTWARE',
  TRUSTED_ENVIRONMENT = 'TRUSTED_ENVIRONMENT',
  STRONGBOX = 'STRONGBOX',
}

export enum OS_FAMILY {
  ANDROID = 'android',
  IOS = 'ios',
}

export enum MIN_OS {
  ANDROID = '9',
  IOS = '12.0',
}

export enum TAB {
  ANDROID = 'android',
  IOS = 'ios',
}

export enum UPDATE_TABS {
  SETTINGS = 'settings',
  USERS_AND_GROUPS = 'usergroups',
}

export enum POLICY_TYPE {
  MOBILE_THREAT_DETECTION = 'MOBILE_THREAT_DETECTION',
}

export enum SERVER_POLICY_OPERATION {
  UPDATE = 'update',
  DELETE = 'delete',
}

export const MTD_SERVICE_ID = 'com.blackberry.mtd'
export const MTD_ENTITY_TYPE = 'MTD'
export const UNRESPONSIVE_AGENT_MIN_VALUE = 4
export const UNRESPONSIVE_AGENT_MAX_VALUE = 168

export enum DATA_PRIVACY_FORM_SETTINGS {
  dataPrivacyApplicationName = 'dataPrivacyApplicationName',
  dataPrivacyApplicationDeveloperSigningId = 'dataPrivacyApplicationDeveloperSigningId',
  dataPrivacyApplicationPackageName = 'dataPrivacyApplicationPackageName',
  dataPrivacyMessageSenderPhoneEmail = 'dataPrivacyMessageSenderPhoneEmail',
  dataPrivacyNetworkSsid = 'dataPrivacyNetworkSsid',
  dataPrivacyUrl = 'dataPrivacyUrl',
}

export enum FORM_REFS {
  FORMIK_BAG = 'formikBag',
  POLICY_NAME = 'name',
  WARNING_NOTIFCATION_INTERVAL = 'warningNotificationsInterval',
  ANDROID_UNSUPPORTED_OS_LIST = 'androidUnsupportedOsList',
  ANDROID_UNSUPPORTED_MODEL_LIST = 'androidUnsupportedModelList',
  ANDROID_SECURITY_PATCH_LIST = 'androidHwAttestationSecurityPatchLevelList',
  IOS_UNSUPPORTED_OS_LIST = 'iosUnsupportedOsList',
  IOS_UNSUPPORTED_MODEL_LIST = 'iosUnsupportedModelList',
  DATA_PRIVACY_NOT_SET = 'dataPrivacyEnabled',
  ANDROID_INSECURE_WIFI_LIST = 'androidInsecureWifiList',
  ANDROID_SMS_SCANNING_START_OFFSET = 'androidSmsScanningStartOffset',
  ANDROID_UNRESPONSIVE_AGENT_COUNT = 'androidUnresponsiveThresholdHours',
  IOS_UNRESPONSIVE_AGENT_COUNT = 'iosUnresponsiveThresholdHours',

  // Add new entries before this line
  SETTINGS_TAB_ANDROID = 'android',
  SETTINGS_TAB_IOS = 'ios',
}

export enum QUERY_STRING_PARM {
  MODE = 'mode',
  TAB = 'tabId',
}

export enum MODE_PARAM_VALUE {
  COPY = 'copy',
}

export enum NOTIFY_SUFFIX {
  DeviceNotify = 'DeviceNotify',
  EmailNotify = 'EmailNotify',
}

export const POLICY_DEFAULTS = {
  type: POLICY_TYPE.MOBILE_THREAT_DETECTION,
  name: '',
  description: '',

  warningNotificationsEnabled: false,
  warningNotificationsIntervalType: POLICY_WARNING_NOTIFICATION_INTERVAL.HOURS,
  warningNotificationsCount: 3,
  warningNotificationsInterval: 4,
  dataPrivacyEnabled: false,
  androidHwAttestationEnabled: true,
  androidHwAttestationSecurityPatchEnabled: false,
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
  androidMessageScanningOption: POLICY_SMS_SCANNING_OPTIONS.CLOUD_SCANNING,
  androidSideLoadedAppEnabled: true,
  androidPrivilegeEscalationEnabled: true,
  androidEncryptionDisabled: true,
  androidCompromisedNetworkEnabled: true,
  androidInsecureWifiEnabled: false,
  androidScreenLockDisabled: true,
  androidKnoxAttestationEnabled: false,
  androidDeveloperModeDetectionEnabled: true,
  androidHwAttestationSecurityLevel: POLICY_HW_ATTESTATION_SECURITY_LEVEL.SOFTWARE,
  iosScreenLockDisabled: true,
  iosMessageScanningEnabled: true,
  iosCompromisedNetworkEnabled: true,
  iosPrivilegeEscalationEnabled: true,
  iosSideLoadedAppEnabled: true,
  iosIntegrityCheckAttestationEnabled: true,
  iosMessageScanningOption: POLICY_SMS_SCANNING_OPTIONS.CLOUD_SCANNING,
  iosUnsupportedOsEnabled: false,
  iosUnsupportedModelEnabled: false,
  androidMaliciousAppEnabledDeviceNotify: true,
  androidMaliciousAppEnabledEmailNotify: true,
  androidSideLoadedAppEnabledDeviceNotify: true,
  androidSideLoadedAppEnabledEmailNotify: true,
  androidPrivilegeEscalationEnabledDeviceNotify: true,
  androidPrivilegeEscalationEnabledEmailNotify: true,
  androidScreenLockDisabledDeviceNotify: true,
  androidScreenLockDisabledEmailNotify: true,
  androidKnoxAttestationEnabledDeviceNotify: true,
  androidKnoxAttestationEnabledEmailNotify: true,
  androidDeveloperModeDetectionEnabledDeviceNotify: true,
  androidDeveloperModeDetectionEnabledEmailNotify: true,
  androidEncryptionDisabledDeviceNotify: true,
  androidEncryptionDisabledEmailNotify: true,
  androidUnsupportedOsEnabledDeviceNotify: true,
  androidUnsupportedOsEnabledEmailNotify: true,
  androidHwAttestationEnabledDeviceNotify: true,
  androidHwAttestationEnabledEmailNotify: true,
  androidSafetynetAttestationEnabledDeviceNotify: true,
  androidSafetynetAttestationEnabledEmailNotify: true,
  androidHwAttestationSecurityPatchEnabledDeviceNotify: true,
  androidHwAttestationSecurityPatchEnabledEmailNotify: true,
  androidCompromisedNetworkEnabledDeviceNotify: true,
  androidCompromisedNetworkEnabledEmailNotify: true,
  androidMessageScanningEnabledDeviceNotify: true,
  androidMessageScanningEnabledEmailNotify: true,
  androidUnresponsiveAgentEmailNotify: true,
  androidInsecureWifiEnabledDeviceNotify: true,
  androidInsecureWifiEnabledEmailNotify: true,
  androidUnsupportedModelEnabledDeviceNotify: true,
  androidUnsupportedModelEnabledEmailNotify: true,
  androidUnresponsiveThresholdHours: 8,
  androidScanMsgStartTimeOffset: 0,
  iosUnresponsiveAgentDeviceNotify: true,
  iosUnresponsiveAgentEmailNotify: true,
  iosUnresponsiveThresholdHours: 8,
  iosUnsupportedModelEnabledDeviceNotify: true,
  iosUnsupportedModelEnabledEmailNotify: true,
  iosSideLoadedAppEnabledDeviceNotify: true,
  iosSideLoadedAppEnabledEmailNotify: true,
  iosPrivilegeEscalationEnabledDeviceNotify: true,
  iosPrivilegeEscalationEnabledEmailNotify: true,
  iosScreenLockDisabledDeviceNotify: true,
  iosScreenLockDisabledEmailNotify: true,
  iosUnsupportedOsEnabledDeviceNotify: true,
  iosUnsupportedOsEnabledEmailNotify: true,
  iosIntegrityCheckAttestationEnabledDeviceNotify: true,
  iosIntegrityCheckAttestationEnabledEmailNotify: true,
  iosCompromisedNetworkEnabledDeviceNotify: true,
  iosCompromisedNetworkEnabledEmailNotify: true,
}
