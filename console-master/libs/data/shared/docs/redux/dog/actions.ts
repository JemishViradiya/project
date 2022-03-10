import type { Dispatch } from 'redux'

import type { Dog, DogVariables } from './types'
import { ActionTypes } from './types'

export const searchDog = (variables: DogVariables) => (dispatch: Dispatch) => {
  dispatch({ type: ActionTypes.fetch, payload: variables })
  setTimeout(
    () =>
      dispatch(
        variables.name === 'Buck'
          ? {
              type: ActionTypes.success,
              payload: { id: '1', name: 'Buck', breed: 'bulldog' } as Dog,
              meta: variables,
            }
          : {
              type: ActionTypes.failure,
              error: true,
              payload: Object.assign(new Error('Not Found'), {
                ...variables,
                statusCode: 404,
              }),
              meta: variables,
            },
      ),
    300,
  )
}

export const updateDog = (variables: Dog) => (dispatch: Dispatch) => {
  dispatch({ type: ActionTypes.update, payload: variables })
  setTimeout(
    () =>
      dispatch(
        variables.name === 'Buck'
          ? {
              type: ActionTypes.success,
              payload: { id: '1', name: 'Buck', breed: 'bulldog', ...variables },
              meta: variables,
            }
          : {
              type: ActionTypes.failure,
              error: true,
              payload: Object.assign(new Error('Not Found'), {
                ...variables,
                statusCode: 404,
              }),
              meta: variables,
            },
      ),
    300,
  )
}
