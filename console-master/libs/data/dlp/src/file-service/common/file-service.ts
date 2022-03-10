/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Response } from '@ues-data/shared'
import { UesAxiosClient } from '@ues-data/shared'

import { fileBaseUrl, riscScoreBaseUrl, tenantBaseUrl } from '../../config.rest'
import type { TenantConfig } from '../../tenant-settings-service'
import type FileServiceInterface from './file--service-interface'

export const makeTenantConfigsUrl = () => `${tenantBaseUrl}/config`
const getPresignedDownloadURL = (): string => `${fileBaseUrl}/downloadURL`
const getFileDetailsURL = (): string => `${riscScoreBaseUrl}/fileDetails`

class FileServiceClass implements FileServiceInterface {
  getConfigs(): Response<TenantConfig> {
    return UesAxiosClient().get(makeTenantConfigsUrl(), {})
  }
  getFile(fileHash: string): any {
    return UesAxiosClient().get(fileBaseUrl + `/${fileHash}`, {
      responseType: 'blob',
      headers: {
        accept: 'application/octet-stream',
      },
    })
  }
  getPresignedDownloadURL(fileHash: string): any {
    return UesAxiosClient().get(getPresignedDownloadURL() + `/${fileHash}`, {})
  }
  getFileDetails(fileHash: string): any {
    return UesAxiosClient().get(getFileDetailsURL() + `/${fileHash}`, {})
  }
}

const FileService = new FileServiceClass()

export { FileService }
