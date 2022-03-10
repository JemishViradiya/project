/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { Task, UsersState } from './types'
import { TaskId, UsersActionType } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: UsersState = {
  tasks: {
    getUsers: {
      loading: false,
    },
    getDevices: {
      loading: false,
    },
  },
}

const updateTask = (state: UsersState, taskId: string, data: Task): UsersState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const reducer: Reducer<UsersState, ActionWithPayload<UsersActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    // fetch Users list
    case UsersActionType.FetchUsersStart:
      return updateTask(state, TaskId.GetUsers, { ...state.tasks.getUsers, loading: true })

    case UsersActionType.FetchUsersError:
      return updateTask(state, TaskId.GetUsers, {
        loading: false,
        error: action.payload.error,
      })

    case UsersActionType.FetchUsersSuccess: {
      return updateTask(state, TaskId.GetUsers, {
        loading: false,
        result: action.payload,
      })
    }

    // fetch devices information
    case UsersActionType.FetchDevicesStart:
      return updateTask(state, TaskId.GetDevices, { ...state.tasks.getDevices, loading: true })

    case UsersActionType.FetchDevicesError:
      return updateTask(state, TaskId.GetDevices, {
        loading: false,
        error: action.payload.error,
      })

    case UsersActionType.FetchDevicesSuccess: {
      return updateTask(state, TaskId.GetDevices, {
        loading: false,
        result: action.payload,
      })
    }

    default:
      return state
  }
}

export default reducer
