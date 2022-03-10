/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { Task } from '../../types'
import type { ApprovedDomainsState } from './types'
import { ActionType, TaskId } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: ApprovedDomainsState = {
  tasks: {
    approvedDomains: {
      loading: false,
    },
    createApprovedDomain: {
      loading: false,
    },
    editApprovedDomain: {
      loading: false,
    },
    deleteApprovedDomain: {
      loading: false,
    },
    deleteMultipleApprovedDomains: {
      loading: false,
    },
    importApprovedDomains: {
      loading: false,
    },
    exportApprovedDomains: {
      loading: false,
    },
  },
}

const updateTask = (state: ApprovedDomainsState, taskId: string, data: Task): ApprovedDomainsState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const reducer: Reducer<ApprovedDomainsState, ActionWithPayload<ActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    case ActionType.FetchApprovedDomainsStart:
      return updateTask(state, TaskId.ApprovedDomains, { ...state.tasks.approvedDomains, loading: true })
    case ActionType.FetchApprovedDomainsError:
      return updateTask(state, TaskId.ApprovedDomains, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.FetchApprovedDomainsSuccess: {
      if (action.payload.result.offset === 0) {
        return updateTask(state, TaskId.ApprovedDomains, {
          loading: false,
          result: action.payload.result,
        })
      } else {
        const allFetchedDomains = [...(state.tasks.approvedDomains?.result?.elements ?? []), ...action.payload.result.elements]
        return updateTask(state, TaskId.ApprovedDomains, {
          loading: false,
          result: { ...action.payload.result, elements: allFetchedDomains },
        })
      }
    }
    case ActionType.CreateApprovedDomainStart:
      return updateTask(state, TaskId.CreateApprovedDomain, { loading: true })
    case ActionType.CreateApprovedDomainError:
      return updateTask(state, TaskId.CreateApprovedDomain, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.CreateApprovedDomainSuccess:
      return updateTask(state, TaskId.CreateApprovedDomain, { loading: false })

    case ActionType.EditApprovedDomainStart:
      return updateTask(state, TaskId.EditApprovedDomain, { loading: true })
    case ActionType.EditApprovedDomainError:
      return updateTask(state, TaskId.EditApprovedDomain, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.EditApprovedDomainSuccess:
      return updateTask(state, TaskId.EditApprovedDomain, {
        loading: false,
      })

    case ActionType.DeleteApprovedDomainStart:
      return updateTask(state, TaskId.DeleteApprovedDomain, { loading: true })
    case ActionType.DeleteMultipleApprovedDomainsStart:
      return updateTask(state, TaskId.DeleteMultipleApprovedDomains, { loading: true })
    case ActionType.DeleteApprovedDomainError:
      return updateTask(state, TaskId.DeleteApprovedDomain, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.DeleteMultipleApprovedDomainsError:
      return updateTask(state, TaskId.DeleteMultipleApprovedDomains, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.DeleteApprovedDomainSuccess:
      return updateTask(state, TaskId.DeleteApprovedDomain, {
        loading: false,
      })
    case ActionType.DeleteMultipleApprovedDomainsSuccess:
      return updateTask(state, TaskId.DeleteMultipleApprovedDomains, {
        loading: false,
      })

    case ActionType.ImportApprovedDomainsStart:
      return updateTask(state, TaskId.ImportApprovedDomains, { loading: true })
    case ActionType.ImportApprovedDomainsError: {
      return updateTask(state, TaskId.ImportApprovedDomains, {
        loading: false,
        error: action.payload.error,
      })
    }
    case ActionType.ImportApprovedDomainsSuccess: {
      return updateTask(state, TaskId.ImportApprovedDomains, { loading: false, result: action.payload.result })
    }

    default:
      return state
  }
}

export default reducer
