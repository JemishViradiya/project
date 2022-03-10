import { call, put } from 'redux-saga/effects'

import { createErrorNotification } from '@mtc/redux-partials'

import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../request/actions'
import restClientInitializer from '../../request/sagas'
import { setRole } from '../actions'

export default function* getRoleById({ payload }) {
  const requestName = 'get-role-by-id'

  yield put(requestStarted(requestName))

  const client = yield* restClientInitializer()

  try {
    const response = yield call(client.get, `/auth/roles/${payload.roleId}`)
    yield put(requestSuccess(response, requestName))
    yield put(setRole(response.data))
  } catch (error) {
    yield put(createErrorNotification('Getting role information failed.', error))
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
