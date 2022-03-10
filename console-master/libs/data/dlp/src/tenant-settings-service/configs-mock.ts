//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params, sonarjs/no-duplicate-string */

import { isEmpty } from 'lodash-es'

import type { Response } from '@ues-data/shared-types'

import type TenantConfigsInterface from './configs-interface'
import type { FileSettings, FileSettingsProperties, RemediationSettings, TenantConfig } from './configs-types'
import { CONFIG_KEY } from './configs-types'

export const mockTenantConfigs: TenantConfig = [
  { key: CONFIG_KEY.IS_SNIPPET_REPORTED, value: 'true' },
  { key: CONFIG_KEY.UPLOAD_EVIDENCE_FILE, value: 'true' },
  { key: CONFIG_KEY.TEMP_FILE_FOLDER_SIZE, value: '10' },
  { key: CONFIG_KEY.UPLOAD_ON_MOBILE_NETWORK, value: 'false' },
  { key: CONFIG_KEY.UPLOAD_DIRECTLY_TO_S3, value: 'true' },
  { key: CONFIG_KEY.BANDWIDTH_LIMIT, value: '10' },
  { key: CONFIG_KEY.TRANSFER_WINDOW_STAR_TIME, value: '0' },
  { key: CONFIG_KEY.TRANSFER_WINDOW_END_TIME, value: '3600' },
  { key: CONFIG_KEY.EMAIL_DOMAINS, value: '["office.com"]' },
]

const fileSetingMockString = `{
  "properties": {
    "ui.file.setting.evidenceFileRetentionPeriod":"30"
  }
}`

const remediationSettingsMock = {
  EMAIL_NOTIFICATION_ENABLED: 'true',
  EMAIL_RECIPIENTS: 'abc@abc.com, xyz@xyz.com',
}

let updatedTenantConfigArrayData = []
let updatedFileSetingString = {}

class TenantConfigsMockClass implements TenantConfigsInterface {
  readAll(): Response<TenantConfig> {
    const tenantConfigArrayData = updatedTenantConfigArrayData.length ? updatedTenantConfigArrayData : mockTenantConfigs
    return Promise.resolve({
      data: tenantConfigArrayData,
    })
  }

  update(tenantConfigArray: TenantConfig): Response {
    updatedTenantConfigArrayData = tenantConfigArray.map(item => ({ ...item, value: item.value.toString() }))
    return Promise.resolve({
      data: tenantConfigArray,
    })
  }

  getFileSettings(): Response<FileSettingsProperties> {
    const mockResponse = !isEmpty(updatedFileSetingString) ? updatedFileSetingString : JSON.parse(fileSetingMockString)
    return Promise.resolve({ data: mockResponse })
  }

  updateFileSetting(fileSettings: FileSettings): Response {
    const updatedFileSetingMockString = `{
      "properties": {
      "ui.file.setting.evidenceFileRetentionPeriod": "${fileSettings[0].value}"}
    }`
    updatedFileSetingString = JSON.parse(updatedFileSetingMockString)
    return Promise.resolve({})
  }

  getRemediationSettings(): Response<RemediationSettings> {
    return Promise.resolve({
      data: remediationSettingsMock,
    })
  }

  updateRemediationSettings(settings: RemediationSettings): Response<RemediationSettings> {
    return Promise.resolve({ data: settings })
  }
}

const TenantConfigsMockApi = new TenantConfigsMockClass()

export { TenantConfigsMockApi }
