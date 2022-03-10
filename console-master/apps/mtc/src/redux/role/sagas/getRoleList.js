import { call, put } from 'redux-saga/effects'

import { createErrorNotification } from '@mtc/redux-partials'

import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../request/actions'
import restClientInitializer from '../../request/sagas'
import { setRoleList } from '../actions'

export default function* getRoleListSaga({ payload }) {
  const requestName = 'get-role-list'

  yield put(requestStarted(requestName))

  const client = yield* restClientInitializer()

  try {
    const response = yield call(client.get, '/auth/roles', payload.params)
    yield put(requestSuccess(response, requestName))
    yield put(setRoleList(response))
  } catch (error) {
    yield put(createErrorNotification('Getting list of roles failed.', error))
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
