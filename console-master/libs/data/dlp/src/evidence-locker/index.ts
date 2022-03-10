import { all, call } from 'redux-saga/effects'

import { UesReduxStore } from '@ues-data/shared'

import ExclusionReducer from './reducer'
import { fetchEvidenceLockerSaga } from './sagas'
import { EvidenceLockerReduxSlice } from './types'

export function* exclusionSaga() {
  yield all([call(fetchEvidenceLockerSaga)])
}

UesReduxStore.registerSlice(EvidenceLockerReduxSlice, { reducer: ExclusionReducer, saga: exclusionSaga }, { eager: false })

export * from './actions'
export * from './selectors'
export * from './data-layer'
