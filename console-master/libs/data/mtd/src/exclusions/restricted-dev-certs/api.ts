import { all, call } from 'redux-saga/effects'

import { UesReduxStore } from '@ues-data/shared'

import RestrictedDeveloperCertificatesReducer from './reducer'
import {
  createRestrictedDevCertsSaga,
  deleteRestrictedDevCertsSaga,
  editRestrictedDevCertsSaga,
  fetchRestrictedDevCertsSaga,
  importRestrictedDevCertsSaga,
} from './sagas'
import { ReduxSlice as RestrictedDevCertsSlice } from './types'

export const ExclusionRestrictedDeveloperCertificatesReducer = RestrictedDeveloperCertificatesReducer
export function* exclusionRestrictedDeveloperCertificatesSaga() {
  yield all([
    call(fetchRestrictedDevCertsSaga),
    call(createRestrictedDevCertsSaga),
    call(editRestrictedDevCertsSaga),
    call(deleteRestrictedDevCertsSaga),
    call(importRestrictedDevCertsSaga),
  ])
}

export const slice = UesReduxStore.registerSlice(
  RestrictedDevCertsSlice,
  {
    reducer: ExclusionRestrictedDeveloperCertificatesReducer,
    saga: exclusionRestrictedDeveloperCertificatesSaga,
  },
  { eager: true },
)

export * from './actions'
export * from './selectors'
export * from './data-layer'
