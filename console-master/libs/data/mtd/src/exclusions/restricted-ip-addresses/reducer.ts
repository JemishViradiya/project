/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { Task } from '../../types'
import type { RestrictedIpAddressesState } from './types'
import { ActionType, TaskId } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: RestrictedIpAddressesState = {
  tasks: {
    restrictedIpAddresses: {
      loading: false,
    },
    createRestrictedIpAddress: {
      loading: false,
    },
    editRestrictedIpAddress: {
      loading: false,
    },
    deleteRestrictedIpAddresses: {
      loading: false,
    },
    importRestrictedIpAddresses: {
      loading: false,
    },
  },
}

const updateTask = (state: RestrictedIpAddressesState, taskId: string, data: Task): RestrictedIpAddressesState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const reducer: Reducer<RestrictedIpAddressesState, ActionWithPayload<ActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    case ActionType.FetchRestrictedIpAddressesStart:
      return updateTask(state, TaskId.RestrictedIpAddresses, { ...state.tasks.restrictedIpAddresses, loading: true })
    case ActionType.FetchRestrictedIpAddressesError:
      return updateTask(state, TaskId.RestrictedIpAddresses, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.FetchRestrictedIpAddressesSuccess: {
      if (action.payload.result.offset === 0) {
        return updateTask(state, TaskId.RestrictedIpAddresses, {
          loading: false,
          result: action.payload.result,
        })
      } else {
        const allFetchedIpAddresses = [
          ...(state.tasks.restrictedIpAddresses?.result?.elements ?? []),
          ...action.payload.result.elements,
        ]
        return updateTask(state, TaskId.RestrictedIpAddresses, {
          loading: false,
          result: { ...action.payload.result, elements: allFetchedIpAddresses },
        })
      }
    }
    case ActionType.CreateRestrictedIpAddressStart:
      return updateTask(state, TaskId.CreateRestrictedIpAddress, { loading: true })
    case ActionType.CreateRestrictedIpAddressError:
      return updateTask(state, TaskId.CreateRestrictedIpAddress, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.CreateRestrictedIpAddressSuccess:
      return updateTask(state, TaskId.CreateRestrictedIpAddress, { loading: false })

    case ActionType.EditRestrictedIpAddressStart:
      return updateTask(state, TaskId.EditRestrictedIpAddress, { loading: true })
    case ActionType.EditRestrictedIpAddressError:
      return updateTask(state, TaskId.EditRestrictedIpAddress, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.EditRestrictedIpAddressSuccess:
      return updateTask(state, TaskId.EditRestrictedIpAddress, {
        loading: false,
      })

    case ActionType.DeleteRestrictedIpAddressesStart:
      return updateTask(state, TaskId.DeleteRestrictedIpAddresses, { loading: true })
    case ActionType.DeleteRestrictedIpAddressesError:
      return updateTask(state, TaskId.DeleteRestrictedIpAddresses, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.DeleteRestrictedIpAddressesSuccess:
      return updateTask(state, TaskId.DeleteRestrictedIpAddresses, {
        loading: false,
        result: action.payload.result,
      })

    case ActionType.ImportRestrictedIpAddressesStart:
      return updateTask(state, TaskId.ImportRestrictedIpAddresses, { loading: true })
    case ActionType.ImportRestrictedIpAddressesError: {
      return updateTask(state, TaskId.ImportRestrictedIpAddresses, {
        loading: false,
        error: action.payload.error,
      })
    }
    case ActionType.ImportRestrictedIpAddressesSuccess: {
      return updateTask(state, TaskId.ImportRestrictedIpAddresses, { loading: false, result: action.payload.result })
    }

    default:
      return state
  }
}

export default reducer
