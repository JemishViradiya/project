import { all, call } from 'redux-saga/effects'

import { UesReduxStore } from '@ues-data/shared'

import ExclusionApprovedDeveloperCertificatesReducer from './reducer'
import {
  createApprovedDevCertsSaga,
  deleteApprovedDevCertsSaga,
  editApprovedDevCertsSaga,
  fetchApprovedDevCertsSaga,
  importApprovedDevCertsSaga,
} from './sagas'
import { ReduxSlice as ApprovedDevCertsSlice } from './types'

export function* exclusionApprovedDeveloperCertificatesSaga() {
  yield all([
    call(fetchApprovedDevCertsSaga),
    call(createApprovedDevCertsSaga),
    call(editApprovedDevCertsSaga),
    call(deleteApprovedDevCertsSaga),
    call(importApprovedDevCertsSaga),
  ])
}

export const slice = UesReduxStore.registerSlice(
  ApprovedDevCertsSlice,
  {
    reducer: ExclusionApprovedDeveloperCertificatesReducer,
    saga: exclusionApprovedDeveloperCertificatesSaga,
  },
  { eager: true },
)

export * from './actions'
export * from './selectors'
export * from './data-layer'
