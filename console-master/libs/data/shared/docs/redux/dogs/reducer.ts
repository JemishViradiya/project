import type { Action } from 'redux'

import type { DogPageResult, DogPageVariables, DogProgressiveResult, DogProgressiveVariables, State } from './types'
import { ActionTypes } from './types'

export const reducer = (
  state: State = {},
  action: Action<ActionTypes> & {
    payload?: DogPageResult | DogPageVariables | DogProgressiveResult | DogProgressiveVariables | Error
    meta?: DogPageVariables | DogProgressiveVariables
  },
): State => {
  switch (action.type) {
    case ActionTypes.fetch:
    case ActionTypes.update:
      state = {
        ...((action.payload as DogProgressiveVariables).offset === 0 ? {} : state),
        loading: true,
        meta: action.payload as DogPageVariables | DogProgressiveVariables,
      }
      break
    case ActionTypes.success:
      state = { data: action.payload as DogPageResult, meta: action.meta }
      break
    case ActionTypes.failure:
      state = { ...state, error: action.payload as Error, meta: action.meta }
      break
    default:
      return state
  }
  if (process.env.NODE_ENV !== 'test') console.log('REDUX.Action', action.type, action, state)
  return state
}
