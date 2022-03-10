import { call, put } from 'redux-saga/effects'

import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../request/actions'
import restClientInitializer from '../../request/sagas'
import { setInstallationToken } from '../actions'

export default function* getInstallationTokenSaga({ payload }) {
  const { tenantId } = payload
  const requestName = 'get-installation-token'

  yield put(requestStarted(requestName))

  const client = yield* restClientInitializer()

  try {
    const response = yield call(client.get, `/tenants/${tenantId}/install-token`)
    yield put(requestSuccess(response, requestName))
    yield put(setInstallationToken(response.data))
  } catch (error) {
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
