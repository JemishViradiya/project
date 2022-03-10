import { all, call } from 'redux-saga/effects'

import { UesReduxStore } from '@ues-data/shared'

import ExclusionReducer from './reducer'
import {
  associateDataEntitiesSaga,
  createDataEntitiesSaga,
  deleteDataEntitiesSaga,
  editDataEntitiesSaga,
  fetchAssociatedDataEntitiesSaga,
  fetchDataEntitiesByGuidsSaga,
  fetchDataEntitiesSaga,
  getDataEntitySaga,
} from './sagas'
import { DataEntitiesReduxSlice } from './types'

export function* exclusionSaga() {
  yield all([
    call(fetchDataEntitiesSaga),
    call(fetchAssociatedDataEntitiesSaga),
    call(fetchDataEntitiesByGuidsSaga),
    call(getDataEntitySaga),
    call(createDataEntitiesSaga),
    call(associateDataEntitiesSaga),
    call(editDataEntitiesSaga),
    call(deleteDataEntitiesSaga),
  ])
}

export const slice = UesReduxStore.registerSlice(
  DataEntitiesReduxSlice,
  { reducer: ExclusionReducer, saga: exclusionSaga },
  { eager: false },
)
export * from './actions'
export * from './selectors'
export * from './data-layer'
