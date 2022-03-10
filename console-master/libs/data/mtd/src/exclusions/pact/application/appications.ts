//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import { axiosInstance, baseUrl } from '../../../config.rest'
import type { CsvRecordFailure, CsvResult, EntitiesPageableResponse, IAppInfo } from '../../../types'
import type ApplicationsInterface from './applications-interface'

const BASE_PATH = '/v1/mtd-exclusion/application'

export const makeAppsEndpoint = (entityId?: string): string => BASE_PATH + (entityId ? `/${entityId}` : '')

export const makeAppsUrl = (entityId?: string): string => `${baseUrl}${makeAppsEndpoint(entityId)}`

export const searchAppsEndpoint = (query?: string): string => BASE_PATH + (query ? `?query=${query}` : '')

export const searchAppsUrl = (query?: string): string => `${baseUrl}${searchAppsEndpoint(query)}`

class ApplicationsClass implements ApplicationsInterface {
  search(query?: string): Response<EntitiesPageableResponse<IAppInfo>> {
    return axiosInstance().get(searchAppsUrl(query))
  }

  import(excludeType: string): Response<CsvResult<CsvRecordFailure>> {
    return axiosInstance().post(`${makeAppsUrl()}/import/${excludeType}`, null, {
      headers: { 'Content-Disposition': 'form-data; filename="import-app.csv"' },
    })
  }

  create(data: IAppInfo): Response<IAppInfo> {
    return axiosInstance().post(makeAppsUrl(), data)
  }

  update(data: IAppInfo): Response<IAppInfo> {
    return axiosInstance().put(makeAppsUrl(data.guid), data)
  }

  get(entityId: string): Response<IAppInfo> {
    return axiosInstance().get(makeAppsUrl(entityId))
  }

  remove(entityId: string): Response<void> {
    return axiosInstance().delete(makeAppsUrl(entityId))
  }

  removeMultiple(entityIds: string[]): Response<IAppInfo> {
    return axiosInstance().delete(makeAppsUrl(), { data: entityIds })
  }

  parseAppFile(): Promise<Response<IAppInfo>> {
    return axiosInstance().post(`${makeAppsUrl()}/parseFile`, null, {
      headers: { 'Content-Disposition': 'form-data; filename="test-app.ipa"' },
    })
  }
}

const Applications = new ApplicationsClass()

export { Applications }
