/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { PagableResponse } from '@ues-data/shared'

import type { FileInventoryBase, FileInventoryDetails } from '../file-inventory-service'
import type { PageableSortableFileInventoryQueryParams } from '../types'
import type { ApiProvider } from './types'
import { FileInventoryActionType } from './types'

// fetch FileInventory list
export const fetchFileInventoryStart = (
  payload: { queryParams: PageableSortableFileInventoryQueryParams<FileInventoryBase> },
  apiProvider: ApiProvider,
) => ({
  type: FileInventoryActionType.FetchFileInventoryStart,
  payload: { ...payload, apiProvider },
})

export const fetchFileInventorySuccess = (payload: PagableResponse<FileInventoryBase>) => ({
  type: FileInventoryActionType.FetchFileInventorySuccess,
  payload,
})

export const fetchFileInventoryError = (error: Error) => ({
  type: FileInventoryActionType.FetchFileInventoryError,
  payload: { error },
})

//fetch FileInventory by fileHash
export const fetchFileDetailsStart = (payload: { fileHash: string }, apiProvider: ApiProvider) => {
  return {
    type: FileInventoryActionType.FetchFileDetailsStart,
    payload: { ...payload, apiProvider },
  }
}

export const fetchFileDetailsSuccess = (payload: FileInventoryDetails) => ({
  type: FileInventoryActionType.FetchFileDetailsSuccess,
  payload,
})

export const fetchFileDetailsError = (error: Error) => ({
  type: FileInventoryActionType.FetchFileDetailsError,
  payload: { error },
})
