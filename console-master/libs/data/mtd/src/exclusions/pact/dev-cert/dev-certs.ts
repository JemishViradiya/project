//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import { axiosInstance, baseUrl } from '../../../config.rest'
import type { CsvRecordFailure, CsvResult, EntitiesPageableResponse, IDeveloperCertificate } from '../../../types'
import type DevCertsInterface from './dev-certs-interface'

const BASE_PATH = '/v1/mtd-exclusion/certificate'

export const makeDevCertsEndpoint = (entityId?: string): string => BASE_PATH + (entityId ? `/${entityId}` : '')

export const makeDevCertsUrl = (entityId?: string): string => `${baseUrl}${makeDevCertsEndpoint(entityId)}`

export const searchDevCertsEndpoint = (query?: string): string => BASE_PATH + (query ? `?query=${query}` : '')

export const searchDevCertsUrl = (query?: string): string => `${baseUrl}${searchDevCertsEndpoint(query)}`

class DevCertsClass implements DevCertsInterface {
  search(query?: string): Response<EntitiesPageableResponse<IDeveloperCertificate>> {
    return axiosInstance().get(searchDevCertsUrl(query))
  }

  import(excludeType: string): Response<CsvResult<CsvRecordFailure>> {
    return axiosInstance().post(`${makeDevCertsUrl()}/import/${excludeType}`, null, {
      headers: { 'Content-Disposition': 'form-data; filename="import-certificate.csv"' },
    })
  }

  create(data: IDeveloperCertificate): Response<IDeveloperCertificate> {
    return axiosInstance().post(makeDevCertsUrl(), data)
  }

  update(data: IDeveloperCertificate): Response<IDeveloperCertificate> {
    return axiosInstance().put(makeDevCertsUrl(data.guid), data)
  }

  get(entityId: string): Response<IDeveloperCertificate> {
    return axiosInstance().get(makeDevCertsUrl(entityId))
  }

  remove(entityId: string): Response<void> {
    return axiosInstance().delete(makeDevCertsUrl(entityId))
  }

  removeMultiple(entityIds: string[]): Response<IDeveloperCertificate> {
    return axiosInstance().delete(makeDevCertsUrl(), { data: entityIds })
  }

  parseAppFile(): Promise<Response<IDeveloperCertificate>> {
    return axiosInstance().post(`${makeDevCertsUrl()}/parseFile`, null, {
      headers: { 'Content-Disposition': 'form-data; filename="test-app.ipa"' },
    })
  }
}

const DevCerts = new DevCertsClass()

export { DevCerts }
