import { all, call } from 'redux-saga/effects'

import { UesReduxStore } from '@ues-data/shared'

import ExclusionReducer from './reducer'
import {
  createApprovedAppsSaga,
  deleteApprovedAppsSaga,
  editApprovedAppsSaga,
  fetchApprovedAppsSaga,
  importApprovedAppsSaga,
} from './sagas'
import { ReduxSlice as ApprovedAppsSlice } from './types'

export function* exclusionSaga() {
  yield all([
    call(fetchApprovedAppsSaga),
    call(createApprovedAppsSaga),
    call(importApprovedAppsSaga),
    call(editApprovedAppsSaga),
    call(deleteApprovedAppsSaga),
  ])
}

UesReduxStore.registerSlice(ApprovedAppsSlice, { reducer: ExclusionReducer, saga: exclusionSaga }, { eager: true })

export * from './actions'
export * from './selectors'
export * from './data-layer'
