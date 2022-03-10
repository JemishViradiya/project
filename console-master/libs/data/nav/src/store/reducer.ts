/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action, Reducer } from 'redux'

import type { NavAppsState } from './types'
import { ActionType } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

const reducer: Reducer<NavAppsState, ActionWithPayload<string>> = (state = {}, action) => {
  switch (action.type) {
    case ActionType.FetchNavAppsSuccess: {
      return {
        ...state,
        navApps: action.payload,
        updateApps: false,
      }
    }
    case ActionType.FetchNavAppsError: {
      return { ...state, error: action.payload.error }
    }
    case ActionType.UpdateNavApps: {
      return { ...state, updateApps: action.payload }
    }
    default:
      return state
  }
}

export default reducer
