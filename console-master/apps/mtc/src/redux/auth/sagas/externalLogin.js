import { call, put } from 'redux-saga/effects'

import { createErrorNotification } from '@mtc/redux-partials'

import Storage from '../../../Storage'
import { loginUserSuccess } from '../actions'
import postLogin from './postLogin'

export default function* externalLoginSaga({ payload }) {
  try {
    yield call(Storage.storeBearerToken, { data: payload.token })
    yield call(Storage.setLoggedInAccount, payload.email)
    yield put(loginUserSuccess(payload.token, payload.email))
    postLogin(payload.token)
  } catch (error) {
    yield put(createErrorNotification('There was an issue logging you in.', error))
  }
}
