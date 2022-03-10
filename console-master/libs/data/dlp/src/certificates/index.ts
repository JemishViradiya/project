import { all, call } from 'redux-saga/effects'

import { UesReduxStore } from '@ues-data/shared'

import CertificateReducer from './reducer'
import { createCertificateSaga, deleteCertificateSaga, fetchCertificatesSaga } from './sagas'
import { CertificatesReduxSlice } from './types'

export function* certificateSaga() {
  yield all([call(fetchCertificatesSaga), call(createCertificateSaga), call(deleteCertificateSaga)])
}

UesReduxStore.registerSlice(CertificatesReduxSlice, { reducer: CertificateReducer, saga: certificateSaga })

export * from './actions'
export * from './selectors'
export * from './data-layer'
