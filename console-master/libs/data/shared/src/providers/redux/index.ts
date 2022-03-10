/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action } from 'redux'

import type { UesReduxSlices } from './slices'
import { configureStore } from './store'

export { UesReduxSlices } from './slices'

export type UesReduxBaseState = {
  [k in UesReduxSlices]: Record<string, unknown>
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
// export interface UesReduxState extends UesReduxBaseState {}
export type UesReduxState<K extends UesReduxSlices = UesReduxSlices, State = Record<string, unknown>> = {
  [k in K]: State
} &
  {
    [k in Exclude<UesReduxSlices, K>]: Record<string, unknown>
  }

let initialState

try {
  initialState = JSON.parse(localStorage.initialReduxState)
} catch (error) {
  if (process.env.NODE_ENV !== 'test') {
    console.log('No saved state found:', error.message)
  }
}

export const UesReduxStore = configureStore<UesReduxState, Action<unknown>>(initialState)
