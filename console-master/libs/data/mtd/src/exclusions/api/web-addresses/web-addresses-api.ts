// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { UesAxiosClient } from '@ues-data/shared'

import type { CsvRecordFailure, CsvResult, EntitiesPageableResponse, PageableSortableQueryParams, Response } from '../../../types'
import { IMPORT_TIMEOUT_IN_MILLISECONDS } from '../index'
import type WebAddressesApiInterface from './web-addresses-api-interface'
import type { IWebAddress } from './web-addresses-api-types'

const BASE_CERTIFICATE_URL = '/mtd/v1/mtd-exclusion/webAddress'

class WebAddressesApiClass implements WebAddressesApiInterface {
  searchIpAddresses(
    tenantId: string,
    params?: PageableSortableQueryParams<IWebAddress>,
    isExport?: boolean,
  ): Promise<Response<EntitiesPageableResponse<IWebAddress>>> {
    params.query.addressType = 'IP'
    return UesAxiosClient().get(BASE_CERTIFICATE_URL, {
      params: params,
      headers: {
        ...(isExport && { export: true }),
        tenantId: tenantId,
      },
    })
  }

  searchDomains(
    tenantId: string,
    params?: PageableSortableQueryParams<IWebAddress>,
    isExport?: boolean,
  ): Promise<Response<EntitiesPageableResponse<IWebAddress>>> {
    params.query.addressType = 'HOST'
    return UesAxiosClient().get(BASE_CERTIFICATE_URL, {
      params: params,
      headers: {
        ...(isExport && { export: true }),
        tenantId: tenantId,
      },
    })
  }

  createApprovedIpAddress(data: IWebAddress): Promise<Response<IWebAddress>> {
    data.type = 'APPROVED'
    data.addressType = 'IP'
    return UesAxiosClient().post(BASE_CERTIFICATE_URL, data)
  }

  createRestrictedIpAddress(data: IWebAddress): Promise<Response<IWebAddress>> {
    data.type = 'RESTRICTED'
    data.addressType = 'IP'
    return UesAxiosClient().post(BASE_CERTIFICATE_URL, data)
  }

  createApprovedDomain(data: IWebAddress): Promise<Response<IWebAddress>> {
    data.type = 'APPROVED'
    data.addressType = 'HOST'
    return UesAxiosClient().post(BASE_CERTIFICATE_URL, data)
  }

  createRestrictedDomain(data: IWebAddress): Promise<Response<IWebAddress>> {
    data.type = 'RESTRICTED'
    data.addressType = 'HOST'
    return UesAxiosClient().post(BASE_CERTIFICATE_URL, data)
  }

  editApprovedIpAddress(data: IWebAddress): Promise<void> {
    data.type = 'APPROVED'
    data.addressType = 'IP'
    return UesAxiosClient().put(`${BASE_CERTIFICATE_URL}/${data.guid}`, data)
  }

  editRestrictedIpAddress(data: IWebAddress): Promise<void> {
    data.type = 'RESTRICTED'
    data.addressType = 'IP'
    return UesAxiosClient().put(`${BASE_CERTIFICATE_URL}/${data.guid}`, data)
  }

  editApprovedDomain(data: IWebAddress): Promise<void> {
    data.type = 'APPROVED'
    data.addressType = 'HOST'
    return UesAxiosClient().put(`${BASE_CERTIFICATE_URL}/${data.guid}`, data)
  }

  editRestrictedDomain(data: IWebAddress): Promise<void> {
    data.type = 'RESTRICTED'
    data.addressType = 'HOST'
    return UesAxiosClient().put(`${BASE_CERTIFICATE_URL}/${data.guid}`, data)
  }

  importApprovedIpAddress(data: File): Promise<CsvResult<CsvRecordFailure>> {
    return UesAxiosClient().post(BASE_CERTIFICATE_URL + '/import/IP/APPROVED', data, {
      headers: {
        'content-disposition': `form-data; filename="${data.name}"`,
        'content-type': 'text/csv',
      },
      timeout: IMPORT_TIMEOUT_IN_MILLISECONDS,
    })
  }

  importRestrictedIpAddress(data: File): Promise<CsvResult<CsvRecordFailure>> {
    return UesAxiosClient().post(BASE_CERTIFICATE_URL + '/import/IP/RESTRICTED', data, {
      headers: {
        'content-disposition': `form-data; filename="${data.name}"`,
        'content-type': 'text/csv',
      },
      timeout: IMPORT_TIMEOUT_IN_MILLISECONDS,
    })
  }

  importApprovedDomain(data: File): Promise<CsvResult<CsvRecordFailure>> {
    return UesAxiosClient().post(BASE_CERTIFICATE_URL + '/import/HOST/APPROVED', data, {
      headers: {
        'content-disposition': `form-data; filename="${data.name}"`,
        'content-type': 'text/csv',
      },
      timeout: IMPORT_TIMEOUT_IN_MILLISECONDS,
    })
  }

  importRestrictedDomain(data: File): Promise<CsvResult<CsvRecordFailure>> {
    return UesAxiosClient().post(BASE_CERTIFICATE_URL + '/import/HOST/RESTRICTED', data, {
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
}

const WebAddressesApi = new WebAddressesApiClass()

export { WebAddressesApi }
