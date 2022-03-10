import { take } from 'redux-saga/effects'

import { FEATURE_SET } from '../../feature/actions'

export function* maintenanceSaga() {
  // Wait for features to be set before checking for the maintenance redirect feature
  const action = yield take(FEATURE_SET)
  if (action.payload.maintenance) {
    window.location.assign('http://maintenance.cylance.com/')
  }
}
