/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { EvidenceLockerState, Task } from './types'
import { EvidenceLockerActionType, TaskId } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: EvidenceLockerState = {
  tasks: {
    getEvidenceLocker: {
      loading: false,
    },
  },
}

const updateTask = (state: EvidenceLockerState, taskId: string, data: Task): EvidenceLockerState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const reducer: Reducer<EvidenceLockerState, ActionWithPayload<EvidenceLockerActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    // fetch Evidence Locker list
    case EvidenceLockerActionType.FetchEvidenceLockerStart:
      return updateTask(state, TaskId.GetEvidenceLocker, { ...state.tasks.getEvidenceLocker, loading: true })

    case EvidenceLockerActionType.FetchEvidenceLockerError:
      return updateTask(state, TaskId.GetEvidenceLocker, {
        loading: false,
        error: action.payload.error,
      })

    case EvidenceLockerActionType.FetchEvidenceLockerSuccess: {
      return updateTask(state, TaskId.GetEvidenceLocker, {
        loading: false,
        result: action.payload,
      })
    }

    default:
      return state
  }
}

export default reducer
