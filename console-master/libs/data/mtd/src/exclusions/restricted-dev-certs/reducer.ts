/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { Task } from '../../types'
import type { RestrictedDevCertsState } from './types'
import { ActionType, TaskId } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: RestrictedDevCertsState = {
  tasks: {
    restrictedDevCerts: {
      loading: false,
    },
    createRestrictedDevCert: {
      loading: false,
    },
    editRestrictedDevCert: {
      loading: false,
    },
    deleteRestrictedDevCerts: {
      loading: false,
    },
    importRestrictedDevCerts: {
      loading: false,
    },
  },
}

const updateTask = (state: RestrictedDevCertsState, taskId: string, data: Task): RestrictedDevCertsState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const reducer: Reducer<RestrictedDevCertsState, ActionWithPayload<ActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    case ActionType.FetchRestrictedDeveloperCertificatesStart:
      return updateTask(state, TaskId.RestrictedDevCerts, { ...state.tasks.restrictedDevCerts, loading: true })
    case ActionType.FetchRestrictedDeveloperCertificatesError:
      return updateTask(state, TaskId.RestrictedDevCerts, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.FetchRestrictedDeveloperCertificatesSuccess: {
      if (action.payload.result.offset === 0) {
        return updateTask(state, TaskId.RestrictedDevCerts, {
          loading: false,
          result: action.payload.result,
        })
      } else {
        const allFetchedDevCerts = [...(state.tasks.restrictedDevCerts?.result?.elements ?? []), ...action.payload.result.elements]
        return updateTask(state, TaskId.RestrictedDevCerts, {
          loading: false,
          result: { ...action.payload.result, elements: allFetchedDevCerts },
        })
      }
    }
    case ActionType.CreateRestrictedDeveloperCertificateStart:
      return updateTask(state, TaskId.CreateRestrictedDevCert, { loading: true })
    case ActionType.CreateRestrictedDeveloperCertificateError:
      return updateTask(state, TaskId.CreateRestrictedDevCert, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.CreateRestrictedDeveloperCertificateSuccess:
      return updateTask(state, TaskId.CreateRestrictedDevCert, { loading: false })

    case ActionType.EditRestrictedDeveloperCertificateStart:
      return updateTask(state, TaskId.EditRestrictedDevCert, { loading: true })
    case ActionType.EditRestrictedDeveloperCertificateError:
      return updateTask(state, TaskId.EditRestrictedDevCert, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.EditRestrictedDeveloperCertificateSuccess:
      return updateTask(state, TaskId.EditRestrictedDevCert, {
        loading: false,
      })

    case ActionType.DeleteRestrictedDeveloperCertificatesStart:
      return updateTask(state, TaskId.DeleteRestrictedDevCerts, { loading: true })
    case ActionType.DeleteRestrictedDeveloperCertificatesError:
      return updateTask(state, TaskId.DeleteRestrictedDevCerts, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.DeleteRestrictedDeveloperCertificatesSuccess:
      return updateTask(state, TaskId.DeleteRestrictedDevCerts, {
        loading: false,
        result: action.payload.result,
      })

    case ActionType.ImportRestrictedDeveloperCertificatesStart:
      return updateTask(state, TaskId.ImportRestrictedDevCerts, { loading: true })
    case ActionType.ImportRestrictedDeveloperCertificatesError:
      return updateTask(state, TaskId.ImportRestrictedDevCerts, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.ImportRestrictedDeveloperCertificatesSuccess:
      return updateTask(state, TaskId.ImportRestrictedDevCerts, { loading: false, result: action.payload.result })

    default:
      return state
  }
}

export default reducer
