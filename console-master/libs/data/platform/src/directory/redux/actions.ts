/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type DirectoryInterface from '../directory-interface'
import type { DirectoryInstance, SyncState, SyncType } from '../directory-types'
import { ActionType } from './types'

export const getCompanyDirectoriesStart = (payload: { sortOrder: string }, apiProvider: DirectoryInterface) => ({
  type: ActionType.GetCompanyDirectoriesStart,
  payload: { ...payload, apiProvider },
})

export const getCompanyDirectoriesSuccess = (payload: DirectoryInstance[]) => ({
  type: ActionType.GetCompanyDirectoriesSuccess,
  payload: { directories: payload },
})

export const getCompanyDirectoriesError = (error: Error) => ({
  type: ActionType.GetCompanyDirectoriesError,
  payload: { error },
})

export const removeCompanyDirectoryStart = (payload: { id: string }, apiProvider: DirectoryInterface) => ({
  type: ActionType.RemoveCompanyDirectoryStart,
  payload: { ...payload, apiProvider },
})

export const removeCompanyDirectorySuccess = (payload: { id: string }) => ({
  type: ActionType.RemoveCompanyDirectorySuccess,
  payload: { ...payload },
})

export const removeCompanyDirectoryError = (error: Error) => ({
  type: ActionType.RemoveCompanyDirectoryError,
  payload: { error },
})

export const addCompanyDirectoryStart = (payload: DirectoryInstance, apiProvider: DirectoryInterface) => ({
  type: ActionType.AddCompanyDirectoryStart,
  payload: { directory: payload, apiProvider },
})

export const addCompanyDirectorySuccess = (payload: DirectoryInstance) => ({
  type: ActionType.AddCompanyDirectorySuccess,
  payload: { directory: payload },
})

export const addCompanyDirectoryError = (error: Error) => ({
  type: ActionType.AddCompanyDirectoryError,
  payload: { error },
})

export const editCompanyDirectoryStart = (payload: DirectoryInstance, apiProvider: DirectoryInterface) => ({
  type: ActionType.EditCompanyDirectoryStart,
  payload: { directory: payload, apiProvider },
})

export const editCompanyDirectorySuccess = (payload: DirectoryInstance) => ({
  type: ActionType.EditCompanyDirectorySuccess,
  payload: { directory: payload },
})

export const editCompanyDirectoryError = (error: Error) => ({
  type: ActionType.EditCompanyDirectoryError,
  payload: { error },
})

// Sync
export const addSyncSchedule = (connectionId, schedule) => {
  return {
    type: ActionType.AddSyncSchedule,
    payload: { connectionId: connectionId, schedule: schedule },
  }
}

export const removeSyncSchedule = (connectionId, scheduleId) => {
  return {
    type: ActionType.RemoveSyncSchedule,
    payload: { connectionId: connectionId, scheduleId: scheduleId },
  }
}

export const setSyncSettings = (connectionId, settings) => {
  return {
    type: ActionType.SetSyncSettings,
    payload: { connectionId: connectionId, syncSettings: settings },
  }
}

export const cancelSyncDirectoryStart = (payload: { id: string }, apiProvider: DirectoryInterface) => ({
  type: ActionType.CancelSyncDirectoryStart,
  payload: { ...payload, apiProvider },
})

export const cancelSyncDirectorySuccess = (payload: { id: string; syncState: SyncState }) => ({
  type: ActionType.CancelSyncDirectorySuccess,
  payload: { ...payload },
})

export const cancelSyncDirectoryError = (error: Error) => ({
  type: ActionType.CancelSyncDirectoryError,
  payload: { error },
})

export const syncDirectoryStart = (payload: { id: string; type: SyncType }, apiProvider: DirectoryInterface) => ({
  type: ActionType.SyncDirectoryStart,
  payload: { ...payload, apiProvider },
})

export const syncDirectorySuccess = (payload: { id: string; syncState: SyncState }) => ({
  type: ActionType.SyncDirectorySuccess,
  payload: { ...payload },
})

export const syncDirectoryRetry = (payload: { id: string; syncState: SyncState }) => ({
  type: ActionType.SyncDirectoryRetry,
  payload: { ...payload },
})

export const syncDirectoryError = (error: Error) => ({
  type: ActionType.SyncDirectoryError,
  payload: { error },
})
