/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { DlpEventsState, Task } from './types'
import { DlpEventsActionType, TaskId } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: DlpEventsState = {
  tasks: {
    getEvents: {
      loading: false,
    },
    getEventDetails: {
      loading: false,
    },
  },
}

const updateTask = (state: DlpEventsState, taskId: string, data: Task): DlpEventsState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const reducer: Reducer<DlpEventsState, ActionWithPayload<DlpEventsActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    // fetch event list
    case DlpEventsActionType.FetchEventsStart:
      return updateTask(state, TaskId.GetEvents, { ...state.tasks.getEvents, loading: true })

    case DlpEventsActionType.FetchEventsError:
      return updateTask(state, TaskId.GetEvents, {
        loading: false,
        error: action.payload.error,
      })

    case DlpEventsActionType.FetchEventsSuccess: {
      return updateTask(state, TaskId.GetEvents, {
        loading: false,
        result: action.payload,
      })
    }

    // fetch event details
    case DlpEventsActionType.FetchEventDetailsStart:
      return updateTask(state, TaskId.GetEventDetails, { ...state.tasks.getEventDetails, loading: true })

    case DlpEventsActionType.FetchEventDetailsError:
      return updateTask(state, TaskId.GetEventDetails, {
        loading: false,
        error: action.payload.error,
      })

    case DlpEventsActionType.FetchEventDetailsSuccess: {
      return updateTask(state, TaskId.GetEventDetails, {
        loading: false,
        result: action.payload,
      })
    }

    default:
      return state
  }
}

export default reducer
