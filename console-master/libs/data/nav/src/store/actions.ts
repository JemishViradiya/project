/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { NavigationApps } from './types'
import { ActionType } from './types'

export const fetchNavAppsStart = (mock: boolean, refetch: boolean) => (dispatch, getState) => {
  dispatch({ type: ActionType.FetchNavAppsStart, payload: { mock, refetch } })
}

export type QueryAppsVars = {
  mock?: boolean
  refetch?: boolean
}

export type FetchNavAppsReturnType = {
  type: typeof ActionType
  payload: QueryAppsVars
}

export const fetchNavAppsSuccess = (payload: NavigationApps) => ({
  type: ActionType.FetchNavAppsSuccess,
  payload,
})

export const fetchFeaturesError = (error: Error) => ({
  type: ActionType.FetchNavAppsError,
  payload: { error },
})

export const updateNavApps = (payload: boolean) => ({
  type: ActionType.UpdateNavApps,
  payload,
})
