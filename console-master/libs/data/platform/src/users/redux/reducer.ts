/* eslint-disable sonarjs/max-switch-cases */
/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { Task, UsersState } from './types'
import { ActionType } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: UsersState = {
  tasks: {
    users: {
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

const handleError = (state: UsersState, task: string, action: ActionWithPayload<string>) => {
  return updateTask(state, task, {
    loading: false,
    error: action.payload.error,
  })
}

const reducer: Reducer<UsersState, ActionWithPayload<ActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    case ActionType.FetchUsersStart:
      return updateTask(state, 'users', { ...state.tasks.users, loading: true })
    case ActionType.FetchUsersError:
      return handleError(state, 'users', action)
    case ActionType.FetchUsersSuccess: {
      if (!action.payload.users.offset) {
        return updateTask(state, 'users', {
          loading: false,
          result: action.payload.users,
        })
      } else {
        const allFetched = [...(state.tasks.users?.result?.elements ?? []), ...action.payload.users.elements]
        return updateTask(state, 'users', {
          loading: false,
          result: { ...action.payload.users, elements: allFetched },
        })
      }
    }
    default:
      return state
  }
}

export default reducer
