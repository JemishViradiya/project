/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { Task } from '../../types'
import type { ApprovedDevCertsState } from './types'
import { ActionType, TaskId } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: ApprovedDevCertsState = {
  tasks: {
    approvedDevCerts: {
      loading: false,
    },
    createApprovedDevCert: {
      loading: false,
    },
    editApprovedDevCert: {
      loading: false,
    },
    deleteApprovedDevCerts: {
      loading: false,
    },
    importApprovedDevCerts: {
      loading: false,
    },
  },
}

const updateTask = (state: ApprovedDevCertsState, taskId: string, data: Task): ApprovedDevCertsState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const reducer: Reducer<ApprovedDevCertsState, ActionWithPayload<ActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    case ActionType.FetchApprovedDeveloperCertificatesStart:
      return updateTask(state, TaskId.ApprovedDevCerts, { ...state.tasks.approvedDevCerts, loading: true })
    case ActionType.FetchApprovedDeveloperCertificatesError:
      return updateTask(state, TaskId.ApprovedDevCerts, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.FetchApprovedDeveloperCertificatesSuccess: {
      if (action.payload.result.offset === 0) {
        return updateTask(state, TaskId.ApprovedDevCerts, {
          loading: false,
          result: action.payload.result,
        })
      } else {
        const allFetchedDevCerts = [...(state.tasks.approvedDevCerts?.result?.elements ?? []), ...action.payload.result.elements]
        return updateTask(state, TaskId.ApprovedDevCerts, {
          loading: false,
          result: { ...action.payload.result, elements: allFetchedDevCerts },
        })
      }
    }
    case ActionType.CreateApprovedDeveloperCertificateStart:
      return updateTask(state, TaskId.CreateApprovedDevCert, { loading: true })
    case ActionType.CreateApprovedDeveloperCertificateError:
      return updateTask(state, TaskId.CreateApprovedDevCert, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.CreateApprovedDeveloperCertificateSuccess:
      return updateTask(state, TaskId.CreateApprovedDevCert, { loading: false })

    case ActionType.EditApprovedDeveloperCertificateStart:
      return updateTask(state, TaskId.EditApprovedDevCert, { loading: true })
    case ActionType.EditApprovedDeveloperCertificateError:
      return updateTask(state, TaskId.EditApprovedDevCert, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.EditApprovedDeveloperCertificateSuccess:
      return updateTask(state, TaskId.EditApprovedDevCert, {
        loading: false,
      })

    case ActionType.DeleteApprovedDeveloperCertificatesStart:
      return updateTask(state, TaskId.DeleteApprovedDevCerts, { loading: true })
    case ActionType.DeleteApprovedDeveloperCertificatesError:
      return updateTask(state, TaskId.DeleteApprovedDevCerts, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.DeleteApprovedDeveloperCertificatesSuccess:
      return updateTask(state, TaskId.DeleteApprovedDevCerts, {
        loading: false,
        result: action.payload.result,
      })

    case ActionType.ImportApprovedDeveloperCertificatesStart:
      return updateTask(state, TaskId.ImportApprovedDevCerts, { loading: true })
    case ActionType.ImportApprovedDeveloperCertificatesError:
      return updateTask(state, TaskId.ImportApprovedDevCerts, {
        loading: false,
        error: action.payload.error,
      })
    case ActionType.ImportApprovedDeveloperCertificatesSuccess:
      return updateTask(state, TaskId.ImportApprovedDevCerts, { loading: false, result: action.payload.result })

    default:
      return state
  }
}

export default reducer
