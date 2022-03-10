import type { Dispatch } from 'redux'

import { getMoreData, getPageData } from '../../util'
import type { Dog, DogPageResult, DogPageVariables, DogProgressiveResult, DogProgressiveVariables } from './types'
import { ActionTypes, ReduxSlice } from './types'

export const listDogsPage = (variables: DogPageVariables) => (dispatch: Dispatch) => {
  dispatch({ type: ActionTypes.fetch, payload: variables })
  const updateQuery = (): DogPageResult => {
    return getPageData<Dog>(variables.limit, variables.page)
  }

  if (variables.page === -1) {
    return dispatch({ type: ActionTypes.failure, error: true, payload: new Error('Invalid Request') })
  }

  setTimeout(
    // eslint-disable-next-line sonarjs/no-identical-functions
    () =>
      dispatch({
        type: ActionTypes.success,
        payload: updateQuery(),
        meta: variables,
      }),
    300,
  )
}

export const listDogsProgressive = (variables: DogProgressiveVariables) => (dispatch: Dispatch, getState) => {
  dispatch({ type: ActionTypes.fetch, payload: variables })
  const updateQuery = (): DogProgressiveResult => {
    const result = getMoreData<Dog>(variables.limit, variables.offset)
    const currentData = getState()[ReduxSlice].data
    if (currentData) {
      if (currentData.data.length > variables.offset) {
        result.data = currentData.data.slice().splice(variables.offset, variables.limit, ...result.data)
      } else {
        result.data = [...currentData.data, ...result.data]
      }
    }
    return result
  }

  if (variables.offset < 0) {
    return dispatch({ type: ActionTypes.failure, error: true, payload: new Error('Invalid Request') })
  }

  setTimeout(
    // eslint-disable-next-line sonarjs/no-identical-functions
    () =>
      dispatch({
        type: ActionTypes.success,
        payload: updateQuery(),
        meta: variables,
      }),
    300,
  )
}
