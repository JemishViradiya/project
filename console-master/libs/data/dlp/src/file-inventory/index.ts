import { all, call } from 'redux-saga/effects'

import { UesReduxStore } from '@ues-data/shared'

import ExclusionReducer from './reducer'
import { fetchFileDetailsSaga, fetchFileInventorySaga } from './sagas'
import { FileInventoryReduxSlice } from './types'

export function* exclusionSaga() {
  yield all([call(fetchFileInventorySaga), call(fetchFileDetailsSaga)])
}

UesReduxStore.registerSlice(FileInventoryReduxSlice, { reducer: ExclusionReducer, saga: exclusionSaga }, { eager: false })

export * from './actions'
export * from './selectors'
export * from './data-layer'
