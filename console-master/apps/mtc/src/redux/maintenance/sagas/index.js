import { takeLatest } from 'redux-saga/effects'

import { MAINTENANCE_REDIRECT } from '../actions'
import { maintenanceSaga } from './maintenance'

export { maintenanceSaga }

export default function* maintenanceWatcher() {
  yield takeLatest(MAINTENANCE_REDIRECT, maintenanceSaga)
}
