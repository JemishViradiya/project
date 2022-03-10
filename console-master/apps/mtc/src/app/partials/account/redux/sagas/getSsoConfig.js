import { call, put } from 'redux-saga/effects'

import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../../../../redux/request/actions'
import restClientInitializer from '../../../../../redux/request/sagas'
import { createErrorNotification } from '../../../NotificationContainer/redux/actions'
import { setSsoConfig } from '../actions'
import { externalAuthSettingsModelFrom } from './transforms/externalAuthSettingsModel'

export default function* getSsoConfigSaga({ payload }) {
  const requestName = 'sso-config'
  const partnerId = payload
  const client = yield* restClientInitializer()
  yield put(requestStarted(requestName))

  try {
    const response = yield call(client.get, `/auth/external-auth/${partnerId}/settings`)
    const ssoConfig = externalAuthSettingsModelFrom(response.data)
    yield put(setSsoConfig(ssoConfig))
    yield put(requestSuccess(response, requestName))
  } catch (error) {
    const errorMessage = 'Getting authentication settings failed.'
    yield put(createErrorNotification(errorMessage, error))
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
