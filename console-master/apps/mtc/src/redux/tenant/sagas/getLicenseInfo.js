import { call, put } from 'redux-saga/effects'

import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../request/actions'
import restClientInitializer from '../../request/sagas'

export default function* getTenantLicenseInfoSaga({ payload }) {
  const { tenantId } = payload
  const requestName = 'get-tenant-license-info'
  yield put(requestStarted(requestName))
  const client = yield* restClientInitializer()
  let response = {}

  try {
    response = yield call(client.get, `/tenants/${tenantId}/license-info`)
    yield put(requestSuccess(response, requestName))
    return response.data
  } catch (error) {
    yield put(requestFailure(error, requestName))
    return response
  } finally {
    yield put(requestFinished(requestName))
  }
}
