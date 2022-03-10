import { createErrorNotification } from '@mtc/partials'

import { ERROR } from '../constants/Error'
import { store } from '../store'

const ERRORS = {
  401: ERROR.UNAUTHORIZED,
  500: ERROR.SERVER_ERROR,
}

class ErrorService {
  static resolve(error) {
    let errorMessage
    if (error.response.status === 409 || error.response.status === 401 || error.response.status === 400) {
      if (typeof error.response.data.modelState !== 'undefined') {
        const fields = Object.keys(error.response.data.modelState)
        const fieldName = fields[0].charAt(0).toUpperCase() + fields[0].slice(1)
        errorMessage = `${fieldName} is ${error.response.data.modelState[fields[0]][0].toLowerCase()}.`
      } else if (error.response.data.message !== 'undefined') {
        errorMessage = error.response.data.message
      } else {
        errorMessage = error.response.data
      }
    } else {
      errorMessage = ERRORS[error.response.status]
    }
    store.dispatch(createErrorNotification(errorMessage, error))
  }

  static log(message) {
    store.dispatch(createErrorNotification(message, null))
  }
}

export default ErrorService
