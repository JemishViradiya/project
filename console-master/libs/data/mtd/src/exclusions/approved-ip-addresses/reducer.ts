/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { Task } from '../../types'
import type { ApprovedIpAddressesState } from './types'
import { ActionType, TaskId } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: ApprovedIpAddressesState = {
  tasks: {
    approvedIpAddresses: {
      loading: false,
    },
    createApprovedIpAddress: {
      loading: false,
    },
    editApprovedIpAddress: {
      loading: false,
    },
    deleteApprovedIpAddresses: {
      loading: false,
    },
    importApprovedIpAddresses: {
      loading: false,
    },
    exportApprovedIpAddresses: {
      loading: false,
    },
  },
}

const updateTask = (state: ApprovedIpAddressesState, taskId: string, data: Task): ApprovedIpAddressesState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const reducer: Reducer<ApprovedIpAddressesState, ActionWithPayload<ActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    case ActionType.FetchApprovedIpAddressesStart:
      return updateTask(state, TaskId.ApprovedIpAddresses, { ...state.tasks.approvedIpAddresses, loading: true })
    case ActionType.FetchApprovedIpAddressesError:
      return updateTask(state, TaskId.ApprovedIpAddresses, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.FetchApprovedIpAddressesSuccess: {
      if (action.payload.result.offset === 0) {
        return updateTask(state, TaskId.ApprovedIpAddresses, {
          loading: false,
          result: action.payload.result,
        })
      } else {
        const allFetchedIpAddresses = [
          ...(state.tasks.approvedIpAddresses?.result?.elements ?? []),
          ...action.payload.result.elements,
        ]
        return updateTask(state, TaskId.ApprovedIpAddresses, {
          loading: false,
          result: { ...action.payload.result, elements: allFetchedIpAddresses },
        })
      }
    }
    case ActionType.CreateApprovedIpAddressStart:
      return updateTask(state, TaskId.CreateApprovedIpAddress, { loading: true })
    case ActionType.CreateApprovedIpAddressError:
      return updateTask(state, TaskId.CreateApprovedIpAddress, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.CreateApprovedIpAddressSuccess:
      return updateTask(state, TaskId.CreateApprovedIpAddress, { loading: false })

    case ActionType.EditApprovedIpAddressStart:
      return updateTask(state, TaskId.EditApprovedIpAddress, { loading: true })
    case ActionType.EditApprovedIpAddressError:
      return updateTask(state, TaskId.EditApprovedIpAddress, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.EditApprovedIpAddressSuccess:
      return updateTask(state, TaskId.EditApprovedIpAddress, {
        loading: false,
      })

    case ActionType.DeleteApprovedIpAddressesStart:
      return updateTask(state, TaskId.DeleteApprovedIpAddresses, { loading: true })
    case ActionType.DeleteApprovedIpAddressesError:
      return updateTask(state, TaskId.DeleteApprovedIpAddresses, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.DeleteApprovedIpAddressesSuccess:
      return updateTask(state, TaskId.DeleteApprovedIpAddresses, {
        loading: false,
        result: action.payload.result,
      })

    case ActionType.ImportApprovedIpAddressesStart:
      return updateTask(state, TaskId.ImportApprovedIpAddresses, { loading: true })
    case ActionType.ImportApprovedIpAddressesError: {
      return updateTask(state, TaskId.ImportApprovedIpAddresses, {
        loading: false,
        error: action.payload.error,
      })
    }
    case ActionType.ImportApprovedIpAddressesSuccess: {
      return updateTask(state, TaskId.ImportApprovedIpAddresses, { loading: false, result: action.payload.result })
    }

    default:
      return state
  }
}

export default reducer
