//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

export type TenantConfigItem = {
  key: CONFIG_KEY
  value: string
}

export type FileSettingItem = {
  key: CONFIG_KEY
  value: string
}

export type FileSettings = FileSettingItem[]

export type FileSettingsProperties = { properties: any }

export enum REMEDIATION_SETTINGS {
  EMAIL_NOTIFICATION_ENABLED = 'ui.tenant.setting.isEmailEnabled',
  EMAIL_RECIPIENTS = 'ui.tenant.setting.emailRecipients',
}

// export type RemediationSettings = { [key in keyof typeof REMEDIATION_SETTINGS]: string }
export type RemediationSettings = any

export enum CONFIG_KEY {
  IS_SNIPPET_REPORTED = 'ui.tenant.setting.isSnippetReported',
  UPLOAD_EVIDENCE_FILE = 'ui.tenant.setting.uploadEvidenceFile',
  TEMP_FILE_FOLDER_SIZE = 'ui.tenant.setting.tempFileFolderSize',
  UPLOAD_DIRECTLY_TO_S3 = 'ui.tenant.setting.uploadDirectlyToS3',
  UPLOAD_ON_MOBILE_NETWORK = 'ui.tenant.setting.uploadOnMobileNetwork',
  BANDWIDTH_LIMIT = 'ui.tenant.setting.bandwidthLimit',
  TRANSFER_WINDOW_STAR_TIME = 'ui.tenant.setting.transferWindowStartTime',
  TRANSFER_WINDOW_END_TIME = 'ui.tenant.setting.transferWindowEndTime',
  DATA_RETENTION_STOREDAYS = 'ui.file.setting.evidenceFileRetentionPeriod',
  EMAIL_DOMAINS = 'ui.tenant.setting.emailDomains',
}

export type TenantConfig = TenantConfigItem[]

export const tenantConfigArrOrdered: TenantConfigItem[] = [
  { key: CONFIG_KEY.IS_SNIPPET_REPORTED, value: 'false' },
  { key: CONFIG_KEY.UPLOAD_EVIDENCE_FILE, value: 'false' },
  { key: CONFIG_KEY.TEMP_FILE_FOLDER_SIZE, value: '10' },
  { key: CONFIG_KEY.UPLOAD_DIRECTLY_TO_S3, value: 'true' },
  { key: CONFIG_KEY.UPLOAD_ON_MOBILE_NETWORK, value: 'false' },
  { key: CONFIG_KEY.BANDWIDTH_LIMIT, value: '50' },
  { key: CONFIG_KEY.TRANSFER_WINDOW_STAR_TIME, value: '0' },
  { key: CONFIG_KEY.TRANSFER_WINDOW_END_TIME, value: '3600' },
  { key: CONFIG_KEY.DATA_RETENTION_STOREDAYS, value: '30' },
  { key: CONFIG_KEY.EMAIL_DOMAINS, value: '' },
]
