import { all, call } from 'redux-saga/effects'

import { UesReduxStore } from '@ues-data/shared'

import ExclusionReducer from './reducer'
import { fetchDlpEventDetailsSaga, fetchDlpEventsSaga } from './sagas'
import { DlpEventsReduxSlice } from './types'

export function* exclusionSaga() {
  yield all([call(fetchDlpEventsSaga), call(fetchDlpEventDetailsSaga)])
}

UesReduxStore.registerSlice(DlpEventsReduxSlice, { reducer: ExclusionReducer, saga: exclusionSaga }, { eager: false })

export * from './actions'
export * from './selectors'
export * from './data-layer'
