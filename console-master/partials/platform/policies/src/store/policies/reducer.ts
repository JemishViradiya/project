/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { ActivationProfile } from '@ues-data/platform'

import type { PoliciesState, Task } from './types'
import { ActionType } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: PoliciesState = {
  tasks: {
    policy: {
      loading: false,
    },
    policyAssignedUsers: {
      loading: false,
    },
    createPolicy: {
      loading: false,
    },
    updatePolicy: {
      loading: false,
    },
    deletePolicy: {
      loading: false,
    },
  },
  ui: {
    localPolicyData: {} as ActivationProfile,
  },
}

const updateTask = (state: PoliciesState, taskId: string, data: Task): PoliciesState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const reducer: Reducer<PoliciesState, ActionWithPayload<ActionType>> = (maybeState, action) => {
  const state = maybeState ?? defaultState

  switch (action.type) {
    case ActionType.FetchPolicyStart:
      return updateTask(state, 'policy', { loading: true })
    case ActionType.FetchPolicyError:
      return updateTask(state, 'policy', {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.FetchPolicySuccess:
      return {
        ...updateTask(state, 'policy', {
          loading: false,
          result: action.payload.result,
        }),
        ui: {
          ...state.ui,
          localPolicyData: action.payload.result,
        },
      }

    case ActionType.CreatePolicyStart:
      return updateTask(state, 'createPolicy', { loading: true })
    case ActionType.CreatePolicyError:
      return updateTask(state, 'createPolicy', {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.CreatePolicySuccess:
      return updateTask(state, 'createPolicy', { loading: false, result: action.payload })

    case ActionType.UpdatePolicyStart:
      return updateTask(state, 'updatePolicy', { loading: true })
    case ActionType.UpdatePolicyError:
      return updateTask(state, 'updatePolicy', {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.UpdatePolicySuccess:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          policy: { result: state.ui.localPolicyData },
          updatePolicy: { loading: false },
        },
      }

    case ActionType.DeletePolicyStart:
    case ActionType.DeleteMultiplePoliciesStart:
      return updateTask(state, 'deletePolicy', { loading: true })
    case ActionType.DeletePolicyError:
    case ActionType.DeleteMultiplePoliciesError:
      return updateTask(state, 'deletePolicy', {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.DeletePolicySuccess:
    case ActionType.DeleteMultiplePoliciesSuccess:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          policy: { loading: false },
          deletePolicy: { loading: false },
        },
        ui: {
          ...state.ui,
          localPolicyData: {},
        },
      }

    case ActionType.ClearPolicy:
      return {
        ...updateTask(state, 'policy', { result: {} }),
        ui: {
          ...state.ui,
          localPolicyData: {},
        },
      }

    case ActionType.UpdateLocalPolicyData: {
      return {
        ...state,
        ui: {
          ...state.ui,
          localPolicyData:
            action.payload === undefined ? state.tasks.policy.result : { ...state.ui.localPolicyData, ...action.payload },
        },
      }
    }

    default:
      return state
  }
}

export default reducer
