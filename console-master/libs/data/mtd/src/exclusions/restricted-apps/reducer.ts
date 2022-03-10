/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { Task } from '../../types'
import type { RestrictedAppsState } from './types'
import { ActionType, TaskId } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: RestrictedAppsState = {
  tasks: {
    restrictedApps: {
      loading: false,
    },
    createRestrictedApp: {
      loading: false,
    },
    importRestrictedApps: {
      loading: false,
    },
    editRestrictedApp: {
      loading: false,
    },
    deleteRestrictedApps: {
      loading: false,
    },
  },
}

const updateTask = (state: RestrictedAppsState, taskId: string, data: Task): RestrictedAppsState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const reducer: Reducer<RestrictedAppsState, ActionWithPayload<ActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    case ActionType.FetchRestrictedApplicationsStart:
      return updateTask(state, TaskId.RestrictedApps, { ...state.tasks.restrictedApps, loading: true })
    case ActionType.FetchRestrictedApplicationsError:
      return updateTask(state, TaskId.RestrictedApps, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.FetchRestrictedApplicationsSuccess: {
      if (action.payload.result.offset === 0) {
        return updateTask(state, TaskId.RestrictedApps, {
          loading: false,
          result: action.payload.result,
        })
      } else {
        const allFetchedApps = [...(state.tasks.restrictedApps?.result?.elements ?? []), ...action.payload.result.elements]
        return updateTask(state, TaskId.RestrictedApps, {
          loading: false,
          result: { ...action.payload.result, elements: allFetchedApps },
        })
      }
    }
    case ActionType.CreateRestrictedApplicationStart:
      return updateTask(state, TaskId.CreateRestrictedApp, { loading: true })
    case ActionType.CreateRestrictedApplicationError:
      return updateTask(state, TaskId.CreateRestrictedApp, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.CreateRestrictedApplicationSuccess:
      return updateTask(state, TaskId.CreateRestrictedApp, { loading: false })

    case ActionType.ImportRestrictedApplicationsStart:
      return updateTask(state, TaskId.ImportRestrictedApps, { loading: true })
    case ActionType.ImportRestrictedApplicationsError: {
      return updateTask(state, TaskId.ImportRestrictedApps, {
        loading: false,
        error: action.payload.error,
      })
    }
    case ActionType.ImportRestrictedApplicationsSuccess: {
      return updateTask(state, TaskId.ImportRestrictedApps, { loading: false, result: action.payload.result })
    }

    case ActionType.EditRestrictedApplicationStart:
      return updateTask(state, TaskId.EditRestrictedApp, { loading: true })
    case ActionType.EditRestrictedApplicationError:
      return updateTask(state, TaskId.EditRestrictedApp, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.EditRestrictedApplicationSuccess:
      return updateTask(state, TaskId.EditRestrictedApp, {
        loading: false,
      })

    case ActionType.DeleteRestrictedApplicationsStart:
      return updateTask(state, TaskId.DeleteRestrictedApps, { loading: true })
    case ActionType.DeleteRestrictedApplicationsError:
      return updateTask(state, TaskId.DeleteRestrictedApps, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.DeleteRestrictedApplicationsSuccess:
      return updateTask(state, TaskId.DeleteRestrictedApps, {
        loading: false,
        result: action.payload.result,
      })
    default:
      return state
  }
}

export default reducer
