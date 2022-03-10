import { call, put } from 'redux-saga/effects'

import { createErrorNotification, createSuccessNotification } from '@mtc/redux-partials'

import history from '../../../configureHistory'
import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../request/actions'
import restClientInitializer from '../../request/sagas'

export default function* CreateRoleSaga({ payload }) {
  const { roleModel } = payload
  const requestName = 'create-role'

  yield put(requestStarted(requestName))

  const client = yield* restClientInitializer()

  try {
    const response = yield call(client.post, '/auth/roles', roleModel)
    yield put(requestSuccess(response, requestName))
    yield put(createSuccessNotification('Role creation successful.', response))
    yield call(history.push, '/user/roles')
  } catch (error) {
    yield put(createErrorNotification('Creating role failed.', error))
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
