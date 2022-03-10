/* eslint-disable sonarjs/max-switch-cases */
/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { CompanyDirectoryState, Task } from './types'
import { ActionType } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: CompanyDirectoryState = {
  tasks: {
    companyDirectories: {
      loading: false,
    },
    removeDirectory: {
      loading: false,
    },
    addDirectory: {
      loading: false,
    },
    editDirectory: {
      loading: false,
    },

    syncDirectory: {
      loading: false,
    },
    cancelSyncDirectory: {
      loading: false,
    },
  },
}

const updateTask = (state: CompanyDirectoryState, taskId: string, data: Task): CompanyDirectoryState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const handleError = (state: CompanyDirectoryState, task: string, action: ActionWithPayload<string>) => {
  return updateTask(state, task, {
    loading: false,
    error: action.payload.error,
  })
}

const reducer: Reducer<CompanyDirectoryState, ActionWithPayload<ActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    // Get directories
    case ActionType.GetCompanyDirectoriesStart:
      return updateTask(state, 'companyDirectories', { loading: true })
    case ActionType.GetCompanyDirectoriesError:
      return handleError(state, 'companyDirectories', action)
    case ActionType.GetCompanyDirectoriesSuccess:
      return updateTask(state, 'companyDirectories', { loading: false, result: action.payload.directories })

    // Remove directory
    case ActionType.RemoveCompanyDirectoryStart:
      return updateTask(state, 'removeDirectory', { loading: true })
    case ActionType.RemoveCompanyDirectoryError:
      return handleError(state, 'removeDirectory', action)
    case ActionType.RemoveCompanyDirectorySuccess:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          removeDirectory: { loading: false },
          companyDirectories: {
            loading: false,
            result: state.tasks.companyDirectories.result.filter(d => d.id !== action.payload.id),
          },
        },
      }

    // Add directory
    case ActionType.AddCompanyDirectoryStart:
      return updateTask(state, 'addDirectory', { loading: true })
    case ActionType.AddCompanyDirectoryError:
      return handleError(state, 'addDirectory', action)
    case ActionType.AddCompanyDirectorySuccess:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          addDirectory: { loading: false },
          companyDirectories: {
            loading: false,
            result: [...state.tasks.companyDirectories.result, action.payload.directory],
          },
        },
      }

    // Edit directory
    case ActionType.EditCompanyDirectoryStart:
      return updateTask(state, 'editDirectory', { loading: true })
    case ActionType.EditCompanyDirectoryError:
      return handleError(state, 'editDirectory', action)
    case ActionType.EditCompanyDirectorySuccess:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          editDirectory: { loading: false },
          companyDirectories: {
            loading: false,
            result: [
              ...(state.tasks.companyDirectories.result || []).filter(d => d.id !== action.payload.directory.id),
              action.payload.directory,
            ],
          },
        },
      }

    // Cancel directory sync
    case ActionType.CancelSyncDirectoryStart:
      return updateTask(state, 'cancelSyncDirectory', { loading: true })
    case ActionType.CancelSyncDirectoryError:
      return handleError(state, 'cancelSyncDirectory', action)
    case ActionType.CancelSyncDirectorySuccess: {
      return {
        ...state,
        tasks: {
          ...state.tasks,
          cancelSyncDirectory: { loading: false },
          companyDirectories: {
            loading: false,
            result: [
              ...state.tasks.companyDirectories.result.map(d => {
                if (d.id === action.payload.id) return { ...d, syncStatus: { updated: true, ...action.payload.syncState } }
                return { ...d }
              }),
            ],
          },
        },
      }
    }

    // Sync directory
    case ActionType.SyncDirectoryStart:
      return updateTask(state, 'syncDirectory', { loading: true })
    case ActionType.SyncDirectoryError:
      return handleError(state, 'syncDirectory', action)
    case ActionType.SyncDirectoryRetry:
    case ActionType.SyncDirectorySuccess: {
      return {
        ...state,
        tasks: {
          ...state.tasks,
          syncDirectory: { loading: false },
          companyDirectories: {
            loading: false,
            result: [
              ...state.tasks.companyDirectories.result.map(d => {
                if (d.id === action.payload.id) return { ...d, syncStatus: { updated: true, ...action.payload.syncState } }
                return { ...d }
              }),
            ],
          },
        },
      }
    }

    // Sync
    case ActionType.AddSyncSchedule: {
      // Validation for duplicate schedule should happen before this
      const newSchedule = action.payload.schedule
      const updatedCompanyDirectory = state.tasks.companyDirectories.result.find(c => c.id === action.payload.connectionId)
      updatedCompanyDirectory.directorySyncSchedules = [...updatedCompanyDirectory.directorySyncSchedules, newSchedule]
      return {
        ...state,
        tasks: {
          ...state.tasks,
          editDirectory: { loading: false },
          companyDirectories: {
            loading: false,
            result: [
              ...state.tasks.companyDirectories.result.filter(d => d.id !== action.payload.connectionId),
              updatedCompanyDirectory,
            ],
          },
        },
      }
    }
    case ActionType.RemoveSyncSchedule: {
      const scheduleIdToRemove = action.payload.scheduleId
      const updatedCompanyDirectory = state.tasks.companyDirectories.result.find(c => c.id === action.payload.connectionId)
      updatedCompanyDirectory.directorySyncSchedules = updatedCompanyDirectory.directorySyncSchedules.filter(
        s => s['id'] !== scheduleIdToRemove,
      )
      return {
        ...state,
        tasks: {
          ...state.tasks,
          editDirectory: { loading: false },
          companyDirectories: {
            loading: false,
            result: [
              ...state.tasks.companyDirectories.result.filter(d => d.id !== action.payload.connectionId),
              updatedCompanyDirectory,
            ],
          },
        },
      }
    }
    case ActionType.SetSyncSettings: {
      const updatedCompanyDirectory = state.tasks.companyDirectories.result.find(c => c.id === action.payload.connectionId)
      return {
        ...state,
        tasks: {
          ...state.tasks,
          editDirectory: { loading: false },
          companyDirectories: {
            loading: false,
            result: [
              ...state.tasks.companyDirectories.result.filter(d => d.id !== action.payload.connectionId),
              { ...updatedCompanyDirectory, ...action.payload.syncSettings },
            ],
          },
        },
      }
    }

    default:
      return state
  }
}

export default reducer
