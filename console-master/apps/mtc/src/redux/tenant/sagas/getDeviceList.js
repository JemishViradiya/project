import { call, put } from 'redux-saga/effects'

import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../request/actions'
import restClientInitializer from '../../request/sagas'
import { setTenantDeviceList } from '../actions'

export default function* getTenantDeviceListSaga({ payload }) {
  const { tenantId, params } = payload
  const requestName = 'get-tenant-device-list'
  yield put(requestStarted(requestName))
  const client = yield* restClientInitializer()
  try {
    const response = yield call(client.get, `/devices/tenants/${tenantId}/devices`, params)
    yield put(setTenantDeviceList(response.data))
    yield put(requestSuccess(response))
  } catch (error) {
    yield put(createErrorNotification('Getting list of tenant devices failed.', error))
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
