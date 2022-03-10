import { call, put } from 'redux-saga/effects'

import history from '../../../../../configureHistory'
import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../../../../redux/request/actions'
import restClientInitializer from '../../../../../redux/request/sagas'
import { createErrorNotification, createSuccessNotification } from '../../../NotificationContainer/redux/actions'

export default function* createPartnerSaga({ payload }) {
  const { partnerModel } = payload
  const requestName = 'create-partner'

  yield put(requestStarted(requestName))

  const client = yield* restClientInitializer()

  try {
    const response = yield call(client.post, '/partners', partnerModel)
    yield put(requestSuccess(response, requestName))
    yield put(createSuccessNotification('Partner creation successful.', response))
    yield call(history.push, '/partner')
  } catch (error) {
    let errorMessage = 'Creating partner failed.'
    if (error.response && error.response.status === 409) {
      errorMessage = ''
      const { modelState } = error.response.data
      if (modelState) {
        Object.keys(modelState).forEach(key => {
          errorMessage += `${key[0].toUpperCase()}${key.substr(1)} is ${modelState[key][0].toLowerCase()}. `
        })
      } else {
        errorMessage = 'Partner user email is not unique'
      }
    }

    yield put(createErrorNotification(errorMessage, error))
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
