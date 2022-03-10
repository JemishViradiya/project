import { all, call } from 'redux-saga/effects'

import { UesReduxStore } from '@ues-data/shared'

import ExclusionReducer from './reducer'
import {
  fetchExfiltrationEventsSaga,
  getEvidenceLockerInfoSaga,
  getNumberActiveDevicesSaga,
  getNumberActiveUsersSaga,
  getSensitiveFilesOnEndpointsSaga,
  getTopEventsSaga,
  getTotalSensitiveFilesOnEndpointsSaga,
} from './sagas'
import { DashboardReduxSlice } from './types'

export function* exclusionSaga() {
  yield all([
    call(getTopEventsSaga),
    call(fetchExfiltrationEventsSaga),
    call(getEvidenceLockerInfoSaga),
    call(getTotalSensitiveFilesOnEndpointsSaga),
    call(getSensitiveFilesOnEndpointsSaga),
    call(getNumberActiveUsersSaga),
    call(getNumberActiveDevicesSaga),
  ])
}
UesReduxStore.registerSlice(DashboardReduxSlice, { reducer: ExclusionReducer, saga: exclusionSaga }, { eager: false })

export * from './actions'
export * from './selectors'
export * from './data-layer'
