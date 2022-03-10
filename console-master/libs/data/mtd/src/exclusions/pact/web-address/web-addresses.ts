//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import { axiosInstance, baseUrl } from '../../../config.rest'
import type { CsvRecordFailure, CsvResult, EntitiesPageableResponse } from '../../../types'
import type { IWebAddress } from '../../api/web-addresses/web-addresses-api-types'
import type WebAddressesInterface from './web-addresses-interface'

const BASE_PATH = '/v1/mtd-exclusion/webAddress'

export const makeWebAddressesEndpoint = (entityId?: string): string => BASE_PATH + (entityId ? `/${entityId}` : '')

export const makeWebAddressesUrl = (entityId?: string): string => `${baseUrl}${makeWebAddressesEndpoint(entityId)}`

export const searchWebAddressesEndpoint = (query?: string): string => BASE_PATH + (query ? `?query=${query}` : '')

export const searchWebAddressesUrl = (query?: string): string => `${baseUrl}${searchWebAddressesEndpoint(query)}`

class WebAddressesClass implements WebAddressesInterface {
  search(query?: string): Response<EntitiesPageableResponse<IWebAddress>> {
    return axiosInstance().get(searchWebAddressesUrl(query))
  }

  import(addressType: string, excludeType: string): Response<CsvResult<CsvRecordFailure>> {
    return axiosInstance().post(`${makeWebAddressesUrl()}/import/${addressType}/${excludeType}`, null, {
      headers: { 'Content-Disposition': 'form-data; filename="import-addresses.csv"' },
    })
  }

  create(data: IWebAddress): Response<IWebAddress> {
    return axiosInstance().post(makeWebAddressesUrl(), data)
  }

  update(data: IWebAddress): Response<IWebAddress> {
    return axiosInstance().put(makeWebAddressesUrl(data.guid), data)
  }

  get(entityId: string): Response<IWebAddress> {
    return axiosInstance().get(makeWebAddressesUrl(entityId))
  }

  remove(entityId: string): Response<void> {
    return axiosInstance().delete(makeWebAddressesUrl(entityId))
  }

  removeMultiple(entityIds: string[]): Response<IWebAddress> {
    return axiosInstance().delete(makeWebAddressesUrl(), { data: entityIds })
  }
}

const WebAddresses = new WebAddressesClass()

export { WebAddresses }
