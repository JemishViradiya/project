import { all, takeLatest } from 'redux-saga/effects'

import { EXTERNAL_AUTH_LOGIN, REQUEST_IDP_REDIRECT, USER_FORGOT_PASSWORD, USER_LOGIN } from '../actions'
import externalLogin from './externalLogin'
import forgotPasswordSaga from './forgotPassword'
import idpRedirect from './idpRedirect'
import loginSaga from './login'

export { loginSaga, forgotPasswordSaga }

export default function* watchers() {
  yield all([
    takeLatest(USER_FORGOT_PASSWORD, forgotPasswordSaga),
    takeLatest(USER_LOGIN, loginSaga),
    takeLatest(REQUEST_IDP_REDIRECT, idpRedirect),
    takeLatest(EXTERNAL_AUTH_LOGIN, externalLogin),
  ])
}
