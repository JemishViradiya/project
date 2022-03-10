import { v1 as uuidv1 } from 'uuid'

import { NOTIFICATION_ERROR, NOTIFICATION_SUCCESS, NOTIFICATION_WARNING } from './actions'

const setError = (state, action) => {
  const { response, message } = action.payload
  return {
    ...state,
    id: uuidv1(),
    type: 'error',
    message: message,
    response: response,
  }
}

const setSuccess = (state, action) => {
  const { response, message } = action.payload
  return {
    ...state,
    id: uuidv1(),
    type: 'success',
    message: message,
    response: response,
  }
}

const setWarning = (state, action) => {
  const { response, message } = action.payload
  return {
    ...state,
    id: uuidv1(),
    type: 'warning',
    message: message,
    response: response,
  }
}

export default function (state = {}, action) {
  switch (action.type) {
    case NOTIFICATION_ERROR:
      return setError(state, action)
    case NOTIFICATION_SUCCESS:
      return setSuccess(state, action)
    case NOTIFICATION_WARNING:
      return setWarning(state, action)
    default:
      return state
  }
}
