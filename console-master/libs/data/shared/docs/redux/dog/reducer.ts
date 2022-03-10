import type { Action } from 'redux'

import type { Dog, DogVariables, State } from './types'
import { ActionTypes } from './types'

export const reducer = (state: State = {}, action: Action<ActionTypes> & { payload?: Dog | Error; meta?: DogVariables }): State => {
  switch (action.type) {
    case ActionTypes.fetch:
    case ActionTypes.update:
      state = { loading: true, meta: action.payload }
      break
    case ActionTypes.success:
      state = { data: action.payload as Dog, meta: action.meta }
      break
    case ActionTypes.failure:
      state = { error: action.payload as Error, meta: action.meta, data: state.data }
      break
    default:
      return state
  }
  if (process.env.NODE_ENV !== 'test') console.log('REDUX.Action', action.type, action, state)
  return state
}
