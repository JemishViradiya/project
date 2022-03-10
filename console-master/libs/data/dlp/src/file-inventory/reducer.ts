/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { FileInventoryState, Task } from './types'
import { FileInventoryActionType, TaskId } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: FileInventoryState = {
  tasks: {
    getFileInventory: {
      loading: false,
    },
    getFileDetails: {
      loading: false,
    },
  },
}

const updateTask = (state: FileInventoryState, taskId: string, data: Task): FileInventoryState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const reducer: Reducer<FileInventoryState, ActionWithPayload<FileInventoryActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    // fetch fileInventory list
    case FileInventoryActionType.FetchFileInventoryStart:
      return updateTask(state, TaskId.GetFileInventory, { ...state.tasks.getFileInventory, loading: true })

    case FileInventoryActionType.FetchFileInventoryError:
      return updateTask(state, TaskId.GetFileInventory, {
        loading: false,
        error: action.payload.error,
      })

    case FileInventoryActionType.FetchFileInventorySuccess: {
      return updateTask(state, TaskId.GetFileInventory, {
        loading: false,
        result: action.payload,
      })
    }

    // fetch file details
    case FileInventoryActionType.FetchFileDetailsStart:
      return updateTask(state, TaskId.GetFileDetails, { ...state.tasks.getFileDetails, loading: true })

    case FileInventoryActionType.FetchFileDetailsError:
      return updateTask(state, TaskId.GetFileDetails, {
        loading: false,
        error: action.payload.error,
      })

    case FileInventoryActionType.FetchFileDetailsSuccess: {
      return updateTask(state, TaskId.GetFileDetails, {
        loading: false,
        result: action.payload,
      })
    }

    default:
      return state
  }
}

export default reducer
