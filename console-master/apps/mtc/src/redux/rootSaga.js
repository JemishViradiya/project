import { all, spawn } from 'redux-saga/effects'

import { account, partner } from '@mtc/redux-partials'

import auth from './auth/sagas'
import feature from './feature/sagas'
import maintenance from './maintenance/sagas'
import role from './role/sagas'
import tenant from './tenant/sagas'

export default function* rootSaga() {
  yield all([spawn(auth), spawn(maintenance), spawn(feature), spawn(role), spawn(tenant), spawn(account), spawn(partner)])
}
