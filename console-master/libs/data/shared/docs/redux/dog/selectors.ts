import { createSelector } from 'reselect'

import type { State } from './types'
import { ReduxSlice } from './types'

const getState = (state): State => state?.[ReduxSlice]

export const selectDogState = createSelector(getState, (state: State) => {
  // custom selector logic goes here
  return state
})
