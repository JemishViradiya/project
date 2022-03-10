import { call, put } from 'redux-saga/effects'

import { createErrorNotification } from '@mtc/redux-partials'

import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../request/actions'
import restClientInitializer from '../../request/sagas'
import { setPermissionList } from '../actions'

export default function* getPermissionListSaga() {
  const requestName = 'get-permission-list'

  yield put(requestStarted(requestName))

  const client = yield* restClientInitializer()

  try {
    const response = yield call(client.get, '/auth/permissions')
    yield put(requestSuccess(response, requestName))
    yield put(setPermissionList(response.data))
  } catch (error) {
    yield put(createErrorNotification('Getting list of available permissions failed.', error))
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
