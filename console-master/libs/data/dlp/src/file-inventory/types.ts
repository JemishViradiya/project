/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { PagableResponse } from '@ues-data/shared-types'

import type { FileInventoryApi, FileInventoryBase, FileInventoryDetails, FileInventoryMockApi } from '../file-inventory-service'

export type ApiProvider = typeof FileInventoryApi | typeof FileInventoryMockApi

export const FileInventoryReduxSlice = 'app.dlp.fileInventory'

export interface Task<TResult = unknown> {
  loading?: boolean
  error?: Error
  result?: TResult
}

export enum TaskId {
  GetFileInventory = 'getFileInventory',
  GetFileDetails = 'getFileDetails',
}

export interface FileInventoryState {
  tasks?: {
    getFileInventory: Task<PagableResponse<FileInventoryBase>>
    getFileDetails: Task<PagableResponse<FileInventoryDetails>>
  }
}

export const FileInventoryActionType = {
  FetchFileInventoryStart: `${FileInventoryReduxSlice}/fetch-fileInventory-start`,
  FetchFileInventoryError: `${FileInventoryReduxSlice}/fetch-fileInventory-error`,
  FetchFileInventorySuccess: `${FileInventoryReduxSlice}/fetch-fileInventory-success`,

  FetchFileDetailsStart: `${FileInventoryReduxSlice}/fetch-file-details-start`,
  FetchFileDetailsError: `${FileInventoryReduxSlice}/fetch-file-details-error`,
  FetchFileDetailsSuccess: `${FileInventoryReduxSlice}/fetch-file-details-success`,
}

// eslint-disable-next-line no-redeclare
export type FileInventoryActionType = string
