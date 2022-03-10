import type { DefaultRootState } from 'react-redux'
import { createSelector } from 'reselect'

import type { StatefulResult } from '@ues-data/shared'

import type { DogPageResult, DogPageVariables, DogProgressiveResult, DogProgressiveVariables, State } from './types'
import { ReduxSlice } from './types'

const getState = (state): State => state?.[ReduxSlice]

const dogPageSelector = createSelector(
  getState,
  (_: State, args: DogPageVariables) => args.page,
  (_: State, args: DogPageVariables) => args.limit,
  (state: State, page, limit) => {
    // custom selector logic goes here
    if (process.env.NODE_ENV !== 'test') console.log('REDUX.Selector.page', state, page, limit)
    return state as Partial<StatefulResult<DogPageResult>>
  },
)
export const selectDogPageState = (vars: DogPageVariables) =>
  // add current variables to selector arguments
  (state: DefaultRootState) => dogPageSelector(state, vars)

const dogProgressiveSelector = createSelector(
  getState,
  (_: State, args: DogProgressiveVariables) => args.offset,
  (_: State, args: DogProgressiveVariables) => args.limit,
  (state: State, offset, limit) => {
    // custom selector logic goes here
    if (process.env.NODE_ENV !== 'test') console.log('REDUX.Selector.progressive', state, offset, limit)
    return state as Partial<StatefulResult<DogProgressiveResult>>
  },
)
export const selectDogProgressiveState = (vars: DogProgressiveVariables) =>
  // add current variables to selector arguments
  (state: DefaultRootState) => dogProgressiveSelector(state, vars)
