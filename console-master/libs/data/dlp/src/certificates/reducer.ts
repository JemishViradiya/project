/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { Reducer } from 'redux'

import type { ActionWithPayload, Task } from '../types'
import type { CertificateState } from './types'
import { CertificateActionType, TaskId } from './types'

export const defaultState: CertificateState = {
  tasks: {
    certificates: {
      loading: false,
    },
    createCertificate: {
      loading: false,
    },
    deleteCertificate: {
      loading: false,
    },
  },
}

const updateTask = (state: CertificateState, taskId: string, data: Task): CertificateState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const reducer: Reducer<CertificateState, ActionWithPayload<CertificateActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    //fetch certificates
    case CertificateActionType.FetchCertificatesStart:
      return updateTask(state, TaskId.Certificates, {
        ...state.tasks.certificates,
        loading: true,
      })

    case CertificateActionType.FetchCertificatesError:
      return updateTask(state, TaskId.Certificates, {
        loading: false,
        error: action.payload.error,
      })

    case CertificateActionType.FetchCertificatesSuccess: {
      if (!action.payload.offset || action.payload.offset === 0) {
        return updateTask(state, TaskId.Certificates, {
          loading: false,
          result: action.payload,
        })
      } else {
        const allFetchedCertificates = [...(state.tasks.certificates?.result?.elements ?? []), ...action.payload.elements]
        return updateTask(state, TaskId.Certificates, {
          loading: false,
          result: { ...action.payload, elements: allFetchedCertificates },
        })
      }
    }

    //create certificate
    case CertificateActionType.CreateCertificateStart:
      return updateTask(state, TaskId.CreateCertificate, { loading: true })

    case CertificateActionType.CreateCertificateError:
      return updateTask(state, TaskId.CreateCertificate, {
        loading: false,
        error: action.payload.error,
      })

    case CertificateActionType.CreateCertificateSuccess:
      return updateTask(state, TaskId.CreateCertificate, { loading: false, result: action.payload })

    //delete certificate
    case CertificateActionType.DeleteCertificateStart:
      return updateTask(state, TaskId.DeleteCertificate, { loading: true })

    case CertificateActionType.DeleteCertificateError:
      return updateTask(state, TaskId.DeleteCertificate, {
        loading: false,
        error: action.payload.error,
      })

    case CertificateActionType.DeleteCertificateSuccess:
      return updateTask(state, TaskId.DeleteCertificate, {
        loading: false,
      })

    default:
      return state
  }
}

export default reducer
