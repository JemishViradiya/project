import axios from 'axios'

import { UesAxiosClient } from '@ues-data/shared'

import type {
  BulkDeleteResponse,
  CsvRecordFailure,
  CsvResult,
  EntitiesPageableResponse,
  PageableSortableQueryParams,
  Response,
} from '../../../types'
import type { IAppUploadInfo, UploadInfo } from '../app-file-parser/app-file-parser-api-types'
import { UPLOAD_TIMEOUT } from '../app-file-parser/app-file-parser-api-types'
import { IMPORT_TIMEOUT_IN_MILLISECONDS } from '../index'
import type ApplicationsApiInterface from './applications-api-interface'
import type { IAppInfo } from './applications-api-types'

const BASE_APPLICATION_URL = '/mtd/v1/mtd-exclusion/application'

class ApplicationsApiClass implements ApplicationsApiInterface {
  search(
    tenantId: string,
    params?: PageableSortableQueryParams<IAppInfo>,
    isExport?: boolean,
  ): Promise<Response<EntitiesPageableResponse<IAppInfo>>> {
    return UesAxiosClient().get(BASE_APPLICATION_URL, {
      params: params,
      headers: {
        ...(isExport && { export: true }),
        tenantId: tenantId,
      },
    })
  }

  createApproved(data: IAppInfo): Promise<Response<IAppInfo>> {
    data.type = 'APPROVED'
    return UesAxiosClient().post(BASE_APPLICATION_URL, data)
  }

  createRestricted(data: IAppInfo): Promise<Response<IAppInfo>> {
    data.type = 'RESTRICTED'
    return UesAxiosClient().post(BASE_APPLICATION_URL, data)
  }

  importApproved(data: File): Promise<CsvResult<CsvRecordFailure>> {
    return UesAxiosClient().post(BASE_APPLICATION_URL + '/import/APPROVED', data, {
      headers: {
        'content-disposition': `form-data; filename="${data.name}"`,
        'content-type': 'text/csv',
      },
      timeout: IMPORT_TIMEOUT_IN_MILLISECONDS,
    })
  }

  importRestricted(data: File): Promise<CsvResult<CsvRecordFailure>> {
    return UesAxiosClient().post(BASE_APPLICATION_URL + '/import/RESTRICTED', data, {
      headers: {
        'content-disposition': `form-data; filename="${data.name}"`,
        'content-type': 'text/csv',
      },
      timeout: IMPORT_TIMEOUT_IN_MILLISECONDS,
    })
  }

  editApproved(data: IAppInfo): Promise<void> {
    data.type = 'APPROVED'
    return UesAxiosClient().put(`${BASE_APPLICATION_URL}/${data.guid}`, data)
  }

  editRestricted(data: IAppInfo): Promise<void> {
    data.type = 'RESTRICTED'
    return UesAxiosClient().put(`${BASE_APPLICATION_URL}/${data.guid}`, data)
  }

  remove(entityId: string): Promise<void> {
    return UesAxiosClient().delete(`${BASE_APPLICATION_URL}/${entityId}`)
  }

  removeMultiple(entityIds: string[]): Promise<BulkDeleteResponse> {
    return UesAxiosClient().delete(`${BASE_APPLICATION_URL}`, {
      data: entityIds,
    })
  }

  async parseAppFile(appUploadInfo: IAppUploadInfo): Promise<Response<IAppInfo>> {
    const uploadInfoPromise = await UesAxiosClient().get(`${BASE_APPLICATION_URL}/uploadUrl`, {
      params: { filename: appUploadInfo.fileName },
    })
    const uploadInfo: UploadInfo = uploadInfoPromise.data

    await axios.put(uploadInfo.url, appUploadInfo.content, {
      timeout: UPLOAD_TIMEOUT,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    })

    return UesAxiosClient().put(`${BASE_APPLICATION_URL}/parseUploadedFile`, null, {
      timeout: UPLOAD_TIMEOUT,
      params: { key: uploadInfo.key },
    })
  }
}

const ApplicationsApi = new ApplicationsApiClass()

export { ApplicationsApi }
