/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { ParsedAppState, Task } from './types'
import { ActionType, TaskId } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: ParsedAppState = {
  tasks: {
    parseAppFile: {
      loading: false,
    },
  },
}

const updateTask = (state: ParsedAppState, taskId: string, data: Task): ParsedAppState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const reducer: Reducer<ParsedAppState, ActionWithPayload<ActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    case ActionType.ParseAppFileStart:
      return updateTask(state, TaskId.ParseAppFile, { loading: true })
    case ActionType.parseAppFileSuccess:
      return updateTask(state, TaskId.ParseAppFile, { loading: false, result: action.payload.result })
    case ActionType.parseAppFileError:
      return updateTask(state, TaskId.ParseAppFile, {
        loading: false,
        error: action.payload.error,
      })

    default:
      return state
  }
}

export default reducer
