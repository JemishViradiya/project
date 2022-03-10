/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { DirectoryInstance } from '../directory-types'

export const ReduxSlice = 'app.platform.directoryConnections'

export interface Task<TResult = unknown> {
  loading?: boolean
  error?: Error
  result?: TResult
}

export interface CompanyDirectoryState {
  tasks?: {
    companyDirectories: Task<DirectoryInstance[]>
    removeDirectory: Task
    addDirectory: Task
    editDirectory: Task

    syncDirectory: Task
    cancelSyncDirectory: Task
  }
}

export const ActionType = {
  GetCompanyDirectoriesStart: `${ReduxSlice}/get-company-directories-start`,
  GetCompanyDirectoriesError: `${ReduxSlice}/get-company-directories-error`,
  GetCompanyDirectoriesSuccess: `${ReduxSlice}/get-company-directories-success`,

  AddCompanyDirectoryStart: `${ReduxSlice}/add-company-directory-start`,
  AddCompanyDirectoryError: `${ReduxSlice}/add-company-directory-error`,
  AddCompanyDirectorySuccess: `${ReduxSlice}/add-company-directory-success`,

  RemoveCompanyDirectoryStart: `${ReduxSlice}/remove-company-directory-start`,
  RemoveCompanyDirectoryError: `${ReduxSlice}/remove-company-directory-error`,
  RemoveCompanyDirectorySuccess: `${ReduxSlice}/remove-company-directory-success`,

  EditCompanyDirectoryStart: `${ReduxSlice}/edit-company-directory-start`,
  EditCompanyDirectoryError: `${ReduxSlice}/edit-company-directory-error`,
  EditCompanyDirectorySuccess: `${ReduxSlice}/edit-company-directory-success`,

  SyncDirectoryStart: `${ReduxSlice}/sync-directory-start`,
  SyncDirectoryError: `${ReduxSlice}/sync-directory-error`,
  SyncDirectorySuccess: `${ReduxSlice}/sync-directory-success`,
  SyncDirectoryRetry: `${ReduxSlice}/sync-directory-retry`,

  CancelSyncDirectoryStart: `${ReduxSlice}/cancel-sync-directory-start`,
  CancelSyncDirectoryError: `${ReduxSlice}/cancel-sync-directory-error`,
  CancelSyncDirectorySuccess: `${ReduxSlice}/cancel-sync-directory-success`,

  AddSyncSchedule: `${ReduxSlice}/ADD_SYNC_SCHEDULE`,
  RemoveSyncSchedule: `${ReduxSlice}/REMOVE_SYNC_SCHEDULE`,
  SetSyncSettings: `${ReduxSlice}/SET_SYNC_SETTINGS`,
}

// eslint-disable-next-line no-redeclare
export type ActionType = string
