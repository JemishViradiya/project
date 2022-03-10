import { call, put } from 'redux-saga/effects'

import { createErrorNotification } from '@mtc/redux-partials'

import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../request/actions'
import restClientInitializer from '../../request/sagas'

export default function* getTenantCountSaga(model) {
  const requestName = 'get-tenant-count'
  yield put(requestStarted(requestName))
  const client = yield* restClientInitializer()

  try {
    const response = yield call(client.get, '/tenants', model)
    yield put(requestSuccess(response, requestName))
    return response.data.totalCount
  } catch (error) {
    yield put(createErrorNotification('Getting tenant license info failed.', error))
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
