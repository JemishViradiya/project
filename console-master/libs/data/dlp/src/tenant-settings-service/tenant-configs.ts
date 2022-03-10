//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

// import { UesAxiosClient } from '@ues-data/shared'
import type { Response } from '@ues-data/shared-types'

import { axiosInstance, fileBaseUrl, remediationBaseUrl, tenantBaseUrl } from '../config.rest'
import type TenantConfigsInterface from './configs-interface'
import type { FileSettings, FileSettingsProperties, RemediationSettings, TenantConfig } from './configs-types'

export const makeTenantConfigsUrl = () => `${tenantBaseUrl}/config`
export const makeFileSettingsUrl = () => `${fileBaseUrl}/settings`
export const makeRemediationSettingsUrl = () => `${remediationBaseUrl}/settings`

class TenantConfigsClass implements TenantConfigsInterface {
  readAll(): Response<TenantConfig> {
    const response: Response<TenantConfig> = axiosInstance().get(makeTenantConfigsUrl(), {})
    console.log('Tenant configs API, readAll = ', response)
    return response
  }

  update(tenantConfigArray: TenantConfig): Response<TenantConfig> {
    return axiosInstance().patch(makeTenantConfigsUrl(), tenantConfigArray)
  }

  getFileSettings(): Response<FileSettingsProperties> {
    return axiosInstance().get(makeFileSettingsUrl(), {})
  }

  updateFileSetting(fileSettings: FileSettings): Response<FileSettings> {
    const settingsObj = {}
    fileSettings?.forEach(s => {
      settingsObj[s.key] = s.value
    })

    const payload = { properties: settingsObj }
    return axiosInstance().patch(makeFileSettingsUrl(), payload)
  }

  getRemediationSettings(): Response<RemediationSettings> {
    return axiosInstance().get(makeRemediationSettingsUrl(), {})
  }

  updateRemediationSettings(settings: RemediationSettings): Response<RemediationSettings> {
    console.log('updateRemediationSettings patch. payload= ', settings)
    return axiosInstance().patch(makeRemediationSettingsUrl(), settings)
  }
}

const TenantConfigsApi = new TenantConfigsClass()

export { TenantConfigsApi }
