/* eslint-disable sonarjs/max-switch-cases */
/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { BcnState, Task } from './types'
import { ActionType } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: BcnState = {
  tasks: {
    bcnInstances: {
      loading: false,
    },
    deleteInstance: {
      loading: false,
    },
    bcnSettings: {
      loading: false,
    },
  },
}

const updateTask = (state: BcnState, taskId: string, data: Task): BcnState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const handleError = (state: BcnState, task: string, action: ActionWithPayload<string>) => {
  return updateTask(state, task, {
    loading: false,
    error: action.payload.error,
  })
}

const reducer: Reducer<BcnState, ActionWithPayload<ActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    // Get instances
    case ActionType.GetConnectionsStart:
      return updateTask(state, 'bcnInstances', { loading: true })
    case ActionType.GetConnectionsError:
      return handleError(state, 'bcnInstances', action)
    case ActionType.GetConnectionsSuccess:
      return updateTask(state, 'bcnInstances', { loading: false, result: action.payload.connections })

    // Delete instance
    case ActionType.DeleteConnectionStart:
      return updateTask(state, 'deleteInstance', { loading: true })
    case ActionType.DeleteConnectionError:
      return handleError(state, 'deleteInstance', action)
    case ActionType.DeleteConnectionSuccess:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          deleteInstance: { loading: false },
          bcnInstances: {
            loading: false,
            result: state.tasks.bcnInstances.result.filter(b => b.instanceId !== action.payload.id),
          },
        },
      }

    // Get settings
    case ActionType.GetSettingsStart:
      return updateTask(state, 'bcnSettings', { loading: true })
    case ActionType.GetSettingsError:
      return handleError(state, 'bcnSettings', action)
    case ActionType.GetSettingsSuccess:
      return updateTask(state, 'bcnSettings', { loading: false, result: action.payload.settings })

    case ActionType.SetLocalSettings:
      return updateTask(state, 'bcnSettings', { loading: false, result: action.payload.settings })

    default:
      return state
  }
}

export default reducer
