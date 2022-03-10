import { call, put } from 'redux-saga/effects'

import { createErrorNotification } from '@mtc/redux-partials'

import { TOKEN_URL } from '../../../services/api/authAPI'
import Storage from '../../../Storage'
import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../request/actions'
import restClientInitializer from '../../request/sagas'
import { loginUserSuccess } from '../actions'
import postLogin from './postLogin'

export default function* loginSaga({ payload }) {
  const requestName = 'login'

  yield put(requestStarted(requestName))

  const client = yield* restClientInitializer()

  try {
    const response = yield call(client.login, TOKEN_URL, payload.email, payload.password)
    yield call(Storage.storeBearerToken, response)
    yield call(Storage.setLoggedInAccount, payload.email)
    yield put(loginUserSuccess(response.data, payload.email))
    postLogin(response.data)
    yield put(requestSuccess(response, requestName))
  } catch (error) {
    if (error.response && error.response.status === 401) {
      yield put(
        createErrorNotification(
          'The username and/or password is invalid, or you are required to use an External Identity Provider.',
          error,
        ),
      )
    } else {
      yield put(createErrorNotification('A server error has occurred.', error))
    }

    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
