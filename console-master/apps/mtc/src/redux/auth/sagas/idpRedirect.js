import { call, put } from 'redux-saga/effects'

import { createErrorNotification } from '@mtc/redux-partials'

import { requestFinished, requestStarted } from '../../request/actions'
import restClientInitializer from '../../request/sagas'

const redirectToLogin = redirectUrl => {
  window.location.replace(redirectUrl)
}

export default function* idpRedirectSaga({ payload }) {
  const requestName = 'idp-redirect'
  yield put(requestStarted(requestName))
  const client = yield* restClientInitializer(false)
  try {
    const response = yield call(client.get, '/auth/external-auth/login', { userEmail: payload.email })
    redirectToLogin(response.data)
  } catch (error) {
    if (error.response && error.response.status === 404) {
      yield put(createErrorNotification('The provided email is invalid.', error))
    } else {
      yield put(createErrorNotification('There is a problem directing you to your identity provider.', error))
    }
  } finally {
    yield put(requestFinished(requestName))
  }
}
