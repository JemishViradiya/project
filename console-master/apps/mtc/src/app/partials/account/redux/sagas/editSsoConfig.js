import { call, put, select } from 'redux-saga/effects'

import { requestFailure, requestFinished, requestStarted, requestSuccess } from '../../../../../redux/request/actions'
import restClientInitializer from '../../../../../redux/request/sagas'
import { createErrorNotification, createSuccessNotification } from '../../../NotificationContainer/redux/actions'
import { setSsoConfig } from '../actions'
import { externalAuthSettingsModelFrom, externalAuthSettingsModelTo } from './transforms/externalAuthSettingsModel'

export const getAccount = state => state.account

export default function* editSsoConfigSaga({ payload }) {
  const values = payload
  const requestName = 'sso-config'
  const client = yield* restClientInitializer()

  yield put(requestStarted(requestName))

  try {
    const authSettingsModel = externalAuthSettingsModelTo(values)
    const response = yield call(client.post, `/auth/external-auth/${authSettingsModel.partnerId}/settings`, authSettingsModel)
    const updatedSsoConfig = response.data
    const ssoConfigViewModel = externalAuthSettingsModelFrom(updatedSsoConfig)
    yield put(setSsoConfig(ssoConfigViewModel))
    yield put(createSuccessNotification('Authentication settings updated.'))
    yield put(requestSuccess(response, requestName))
  } catch (error) {
    let errorMessage = 'Authentication settings update failed.'
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message
    }
    const currentAccountState = yield select(getAccount)
    const { ssoConfig } = currentAccountState
    yield put(setSsoConfig(ssoConfig))
    yield put(createErrorNotification(errorMessage, error))
    yield put(requestFailure(error, requestName))
  } finally {
    yield put(requestFinished(requestName))
  }
}
