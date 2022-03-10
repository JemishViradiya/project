import { call, put } from 'redux-saga/effects'

import ErrorService from '../../../services/errors'
import SuccessService from '../../../services/success'
import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../request/actions'
import restClientInitializer from '../../request/sagas'

export default function* forgotPasswordSaga({ payload }) {
  const requestName = 'forgot-password'

  yield put(requestStarted(requestName))

  const client = yield* restClientInitializer()

  try {
    const response = yield call(client.post, '/auth/forgot-password', { email: payload })
    SuccessService.resolve('Reset instructions sent if the provided email is on file')
    yield put(requestSuccess(response, requestName))
  } catch (error) {
    ErrorService.resolve(error)
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
