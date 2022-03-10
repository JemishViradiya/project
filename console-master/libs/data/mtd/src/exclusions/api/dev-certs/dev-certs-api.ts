import axios from 'axios'

import { UesAxiosClient } from '@ues-data/shared'

import type { CsvRecordFailure, CsvResult, EntitiesPageableResponse, PageableSortableQueryParams, Response } from '../../../types'
import type { IAppUploadInfo, UploadInfo } from '../app-file-parser/app-file-parser-api-types'
import { UPLOAD_TIMEOUT } from '../app-file-parser/app-file-parser-api-types'
import { IMPORT_TIMEOUT_IN_MILLISECONDS } from '../index'
import type DeveloperCertificatesApiInterface from './dev-certs-api-interface'
import type { IDeveloperCertificate } from './dev-certs-api-types'

const BASE_CERTIFICATE_URL = '/mtd/v1/mtd-exclusion/certificate'

class DeveloperCertificatesApiClass implements DeveloperCertificatesApiInterface {
  search(
    tenantId: string,
    params?: PageableSortableQueryParams<IDeveloperCertificate>,
    isExport?: boolean,
  ): Promise<Response<EntitiesPageableResponse<IDeveloperCertificate>>> {
    return UesAxiosClient().get(BASE_CERTIFICATE_URL, {
      params: params,
      headers: {
        ...(isExport && { export: true }),
        tenantId: tenantId,
      },
    })
  }

  createApproved(data: IDeveloperCertificate): Promise<Response<IDeveloperCertificate>> {
    data.type = 'APPROVED'
    return UesAxiosClient().post(BASE_CERTIFICATE_URL, data)
  }

  createRestricted(data: IDeveloperCertificate): Promise<Response<IDeveloperCertificate>> {
    data.type = 'RESTRICTED'
    return UesAxiosClient().post(BASE_CERTIFICATE_URL, data)
  }

  editApproved(data: IDeveloperCertificate): Promise<void> {
    data.type = 'APPROVED'
    return UesAxiosClient().put(`${BASE_CERTIFICATE_URL}/${data.guid}`, data)
  }

  editRestricted(data: IDeveloperCertificate): Promise<void> {
    data.type = 'RESTRICTED'
    return UesAxiosClient().put(`${BASE_CERTIFICATE_URL}/${data.guid}`, data)
  }

  importApproved(data: IDeveloperCertificate): Promise<Response<CsvResult<CsvRecordFailure>>> {
    return UesAxiosClient().post(BASE_CERTIFICATE_URL + '/import/APPROVED', data, {
      headers: {
        'content-disposition': `form-data; filename="${data.name}"`,
        'content-type': 'text/csv',
      },
      timeout: IMPORT_TIMEOUT_IN_MILLISECONDS,
    })
  }

  importRestricted(data: IDeveloperCertificate): Promise<Response<CsvResult<CsvRecordFailure>>> {
    return UesAxiosClient().post(BASE_CERTIFICATE_URL + '/import/RESTRICTED', data, {
      headers: {
        'content-disposition': `form-data; filename="${data.name}"`,
        'content-type': 'text/csv',
      },
      timeout: IMPORT_TIMEOUT_IN_MILLISECONDS,
    })
  }

  remove(entityId: string): Promise<void> {
    return UesAxiosClient().delete(`${BASE_CERTIFICATE_URL}/${entityId}`)
  }

  removeMultiple(entityIds: string[]): Promise<void> {
    return UesAxiosClient().delete(`${BASE_CERTIFICATE_URL}`, {
      data: entityIds,
    })
  }

  async parseAppFile(appUploadInfo: IAppUploadInfo): Promise<Response<IDeveloperCertificate>> {
    const uploadInfoPromise = await UesAxiosClient().get(`${BASE_CERTIFICATE_URL}/uploadUrl`, {
      params: { filename: appUploadInfo.fileName },
    })
    const uploadInfo: UploadInfo = uploadInfoPromise.data

    await axios.put(uploadInfo.url, appUploadInfo.content, {
      timeout: UPLOAD_TIMEOUT,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    })

    return UesAxiosClient().put(`${BASE_CERTIFICATE_URL}/parseUploadedFile`, null, {
      timeout: UPLOAD_TIMEOUT,
      params: { key: uploadInfo.key },
    })
  }
}

const DeveloperCertificatesApi = new DeveloperCertificatesApiClass()

export { DeveloperCertificatesApi }
