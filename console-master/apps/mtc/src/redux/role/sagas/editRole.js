import { call, put } from 'redux-saga/effects'

import { createErrorNotification, createSuccessNotification } from '@mtc/redux-partials'

import history from '../../../configureHistory'
import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../request/actions'
import restClientInitializer from '../../request/sagas'

export default function* EditRoleSaga({ payload }) {
  const { roleModel, roleId } = payload

  const requestName = 'edit-role'

  yield put(requestStarted(requestName))

  const client = yield* restClientInitializer()

  try {
    const response = yield call(client.put, `/auth/roles/${roleId}`, roleModel)
    yield put(requestSuccess(response, requestName))
    yield put(createSuccessNotification('Role update successful.', response))
    yield call(history.push, '/user/roles')
  } catch (error) {
    yield put(createErrorNotification('Role update failed.', error))
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
