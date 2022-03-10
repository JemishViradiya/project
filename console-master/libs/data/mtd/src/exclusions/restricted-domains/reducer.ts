/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { Task } from '../../types'
import type { RestrictedDomainsState } from './types'
import { ActionType, TaskId } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: RestrictedDomainsState = {
  tasks: {
    restrictedDomains: {
      loading: false,
    },
    createRestrictedDomain: {
      loading: false,
    },
    editRestrictedDomain: {
      loading: false,
    },
    deleteRestrictedDomain: {
      loading: false,
    },
    deleteMultipleRestrictedDomains: {
      loading: false,
    },
    importRestrictedDomains: {
      loading: false,
    },
  },
}

const updateTask = (state: RestrictedDomainsState, taskId: string, data: Task): RestrictedDomainsState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const reducer: Reducer<RestrictedDomainsState, ActionWithPayload<ActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    case ActionType.FetchRestrictedDomainsStart:
      return updateTask(state, TaskId.RestrictedDomains, { ...state.tasks.restrictedDomains, loading: true })
    case ActionType.FetchRestrictedDomainsError:
      return updateTask(state, TaskId.RestrictedDomains, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.FetchRestrictedDomainsSuccess: {
      if (action.payload.result.offset === 0) {
        return updateTask(state, TaskId.RestrictedDomains, {
          loading: false,
          result: action.payload.result,
        })
      } else {
        const allFetchedDomains = [...(state.tasks.restrictedDomains?.result?.elements ?? []), ...action.payload.result.elements]
        return updateTask(state, TaskId.RestrictedDomains, {
          loading: false,
          result: { ...action.payload.result, elements: allFetchedDomains },
        })
      }
    }
    case ActionType.CreateRestrictedDomainStart:
      return updateTask(state, TaskId.CreateRestrictedDomain, { loading: true })
    case ActionType.CreateRestrictedDomainError:
      return updateTask(state, TaskId.CreateRestrictedDomain, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.CreateRestrictedDomainSuccess:
      return updateTask(state, TaskId.CreateRestrictedDomain, { loading: false })

    case ActionType.EditRestrictedDomainStart:
      return updateTask(state, TaskId.EditRestrictedDomain, { loading: true })
    case ActionType.EditRestrictedDomainError:
      return updateTask(state, TaskId.EditRestrictedDomain, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.EditRestrictedDomainSuccess:
      return updateTask(state, TaskId.EditRestrictedDomain, {
        loading: false,
      })

    case ActionType.DeleteRestrictedDomainStart:
      return updateTask(state, TaskId.DeleteRestrictedDomain, { loading: true })
    case ActionType.DeleteMultipleRestrictedDomainsStart:
      return updateTask(state, TaskId.DeleteMultipleRestrictedDomains, { loading: true })
    case ActionType.DeleteRestrictedDomainError:
      return updateTask(state, TaskId.DeleteRestrictedDomain, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.DeleteMultipleRestrictedDomainsError:
      return updateTask(state, TaskId.DeleteMultipleRestrictedDomains, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.DeleteRestrictedDomainSuccess:
      return updateTask(state, TaskId.DeleteRestrictedDomain, {
        loading: false,
      })
    case ActionType.DeleteMultipleRestrictedDomainsSuccess:
      return updateTask(state, TaskId.DeleteMultipleRestrictedDomains, {
        loading: false,
      })
    case ActionType.ImportRestrictedDomainsStart:
      return updateTask(state, TaskId.ImportRestrictedDomains, { loading: true })
    case ActionType.ImportRestrictedDomainsError: {
      return updateTask(state, TaskId.ImportRestrictedDomains, {
        loading: false,
        error: action.payload.error,
      })
    }

    case ActionType.ImportRestrictedDomainsSuccess: {
      return updateTask(state, TaskId.ImportRestrictedDomains, { loading: false, result: action.payload.result })
    }

    default:
      return state
  }
}

export default reducer
