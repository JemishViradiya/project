//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.
import { isEmpty } from 'lodash-es'

import type { PagableResponse, Response } from '@ues-data/shared-types'

import { axiosInstance, fileBaseUrl, fileInventoryBaseUrl, riscScoreBaseUrl } from '../config.rest'
import type { PageableSortableFileInventoryQueryParams } from '../types'
import type FileInventoryInterface from './file-inventory-interface'
import type { FileInventoryBase, FileInventoryDetails, MetadataItem, UserDeviceCountsItem } from './file-inventory-types'

// TODO update typescript check
type FileInventoryQueryUrl = {
  sortBy?: string
  max?: number
  offset?: number
  name?: string
  type?: string
  size?: number
  infoTypes?: string[]
  policyGuid?: string
  dataEntityGuid?: string
}

const getFileInventoryQueryUrl = (params: FileInventoryQueryUrl) =>
  Object.keys(params)
    .map(key => (typeof params[key] === 'object' ? `${key}=${params[key].join(',')}` : `${key}=${params[key]}`))
    .join('&')

export const makeFileInventoryEndpoint = params => {
  return `${fileInventoryBaseUrl}/list${!isEmpty(params) ? '?' + getFileInventoryQueryUrl({ ...params }) : ''}`
}

class FileInventoryClass implements FileInventoryInterface {
  readAll(
    params?: PageableSortableFileInventoryQueryParams<FileInventoryBase>,
  ): Response<PagableResponse<FileInventoryBase> | Partial<PagableResponse<FileInventoryBase>>> {
    return axiosInstance().get(makeFileInventoryEndpoint(params))
  }

  readUserAndDeviceCounts(hashes: string[]): Response<UserDeviceCountsItem | Partial<UserDeviceCountsItem>> {
    return axiosInstance().post(`${riscScoreBaseUrl}/countsByFileHash`, hashes)
  }

  readMetadata(hashes: string[]): Response<MetadataItem | Partial<MetadataItem>> {
    return axiosInstance().post(`${fileBaseUrl}/metadataByFileHash`, hashes)
  }

  read(fileHash: string): Response<FileInventoryDetails | Partial<FileInventoryDetails>> {
    return axiosInstance().get(`${fileInventoryBaseUrl}/details/${fileHash}`)
  }
}

const FileInventoryApi = new FileInventoryClass()

export { FileInventoryApi }
