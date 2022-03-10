import { all, takeLatest } from 'redux-saga/effects'

import { EDIT_SSO_CONFIG, GET_SSO_CONFIG } from '../actions'
import editSsoConfigSaga from './editSsoConfig'
import getSsoConfigSaga from './getSsoConfig'

export { editSsoConfigSaga, getSsoConfigSaga }

export default function* watchers() {
  yield all([takeLatest(EDIT_SSO_CONFIG, editSsoConfigSaga), takeLatest(GET_SSO_CONFIG, getSsoConfigSaga)])
}
