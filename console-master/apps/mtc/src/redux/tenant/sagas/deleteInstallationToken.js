import { call, put } from 'redux-saga/effects'

import { createErrorNotification, createSuccessNotification } from '@mtc/redux-partials'

import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../request/actions'
import restClientInitializer from '../../request/sagas'
import { setInstallationToken } from '../actions'

export default function* DeleteInstallationTokenSaga({ payload }) {
  const { tenantId } = payload
  const requestName = 'delete-installation-token'
  yield put(requestStarted(requestName))
  const client = yield* restClientInitializer()

  try {
    const response = yield call(client.delete, `/tenants/${tenantId}/install-token`)
    yield put(requestSuccess(response, requestName))
    yield put(createSuccessNotification('Installation Token Deletion Successful', response))
    yield put(setInstallationToken(''))
  } catch (error) {
    yield put(createErrorNotification('Deleting Installation Token Failed.', error))
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
