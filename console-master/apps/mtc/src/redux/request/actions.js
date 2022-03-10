export const REQUEST_SUCCESS = '@Cylance/api/REQUEST_SUCCESS'
export const REQUEST_FAILURE = '@Cylance/api/REQUEST_FAILURE'
export const REQUEST_START = '@Cylance/api/REQUEST_START'
export const REQUEST_FINISH = '@Cylance/api/REQUEST_FINISH'

export const requestSuccess = (response, name) => ({
  type: REQUEST_SUCCESS,
  payload: {
    name: name,
    data: response,
  },
})

export const requestFailure = (error, name) => ({
  type: REQUEST_FAILURE,
  payload: { error, name },
})

export const requestStarted = name => ({
  type: REQUEST_START,
  payload: name,
})

export const requestFinished = name => ({
  type: REQUEST_FINISH,
  payload: name,
})
