import { call, put } from 'redux-saga/effects'

import history from '../../../../../configureHistory'
import { loginUserSuccess } from '../../../../../redux/auth/actions'
import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../../../../redux/request/actions'
import restClientInitializer from '../../../../../redux/request/sagas'
import { TOKEN_URL } from '../../../../../services/api/authAPI'
import Storage from '../../../../../Storage'
import { createErrorNotification } from '../../../NotificationContainer/redux/actions'

export default function* signPartnerEulaSaga({ payload }) {
  const requestName = 'sign-partner-eula'
  yield put(requestStarted(requestName))
  const client = yield* restClientInitializer()
  const { id } = payload
  try {
    const response = yield call(client.post, `/partners/${id}/eula`, null)
    yield put(requestSuccess(response, requestName))
    yield put(requestSuccess(response, requestName))
    const refreshResponse = yield call(client.post, TOKEN_URL, null)
    Storage.storeBearerToken(refreshResponse)
    yield put(loginUserSuccess(refreshResponse.data, null))
    yield call(history.push, '/')
  } catch (error) {
    yield put(createErrorNotification('Signing Eula Failed', error))
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
