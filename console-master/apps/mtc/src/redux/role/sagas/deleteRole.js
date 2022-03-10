import { get } from 'lodash'
import { call, put } from 'redux-saga/effects'

import { createErrorNotification, createSuccessNotification } from '@mtc/redux-partials'

import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../request/actions'
import restClientInitializer from '../../request/sagas'

export default function* deleteRoleSaga({ payload }) {
  const requestName = 'delete-role'

  yield put(requestStarted(requestName))

  const client = yield* restClientInitializer()

  try {
    const response = yield call(client.delete, `/auth/roles/${payload.roleId}`)
    yield put(requestSuccess(response, requestName))
    yield put(createSuccessNotification('Role deleted successfully', response))
  } catch (error) {
    // Using defaultTo because sometimes role specific error messages are returned
    // such as only being able to delete roles with 0 users, but not always
    const message = get(error, 'response.data.message', 'Role delete failed')
    yield put(createErrorNotification(message, error))
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
