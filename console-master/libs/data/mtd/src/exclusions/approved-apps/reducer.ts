/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { Task } from '../../types'
import type { ApprovedAppsState } from './types'
import { ActionType, TaskId } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: ApprovedAppsState = {
  tasks: {
    approvedApps: {
      loading: false,
    },
    createApprovedApp: {
      loading: false,
    },
    importApprovedApps: {
      loading: false,
    },
    editApprovedApp: {
      loading: false,
    },
    exportApprovedApps: {
      loading: false,
    },
    deleteApprovedApps: {
      loading: false,
    },
  },
}

const updateTask = (state: ApprovedAppsState, taskId: string, data: Task): ApprovedAppsState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const reducer: Reducer<ApprovedAppsState, ActionWithPayload<ActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    case ActionType.FetchApprovedApplicationsStart:
      return updateTask(state, TaskId.ApprovedApps, { ...state.tasks.approvedApps, loading: true })
    case ActionType.FetchApprovedApplicationsError:
      return updateTask(state, TaskId.ApprovedApps, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.FetchApprovedApplicationsSuccess: {
      if (action.payload.result.offset === 0) {
        return updateTask(state, TaskId.ApprovedApps, {
          loading: false,
          result: action.payload.result,
        })
      } else {
        const allFetchedApps = [...(state.tasks.approvedApps?.result?.elements ?? []), ...action.payload.result.elements]
        return updateTask(state, TaskId.ApprovedApps, {
          loading: false,
          result: { ...action.payload.result, elements: allFetchedApps },
        })
      }
    }
    case ActionType.CreateApprovedApplicationStart:
      return updateTask(state, TaskId.CreateApprovedApp, { loading: true })
    case ActionType.CreateApprovedApplicationError:
      return updateTask(state, TaskId.CreateApprovedApp, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.CreateApprovedApplicationSuccess:
      return updateTask(state, TaskId.CreateApprovedApp, { loading: false })

    case ActionType.ImportApprovedApplicationsStart:
      return updateTask(state, TaskId.ImportApprovedApps, { loading: true })
    case ActionType.ImportApprovedApplicationsError: {
      return updateTask(state, TaskId.ImportApprovedApps, {
        loading: false,
        error: action.payload.error,
      })
    }
    case ActionType.ImportApprovedApplicationsSuccess: {
      return updateTask(state, TaskId.ImportApprovedApps, { loading: false, result: action.payload.result })
    }

    case ActionType.EditApprovedApplicationStart:
      return updateTask(state, TaskId.EditApprovedApp, { loading: true })
    case ActionType.EditApprovedApplicationError:
      return updateTask(state, TaskId.EditApprovedApp, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.EditApprovedApplicationSuccess:
      return updateTask(state, TaskId.EditApprovedApp, {
        loading: false,
      })

    case ActionType.DeleteApprovedApplicationsStart:
      return updateTask(state, TaskId.DeleteApprovedApps, { loading: true })
    case ActionType.DeleteApprovedApplicationsError:
      return updateTask(state, TaskId.DeleteApprovedApps, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.DeleteApprovedApplicationsSuccess:
      return updateTask(state, TaskId.DeleteApprovedApps, {
        loading: false,
        result: action.payload.result,
      })
    default:
      return state
  }
}

export default reducer
