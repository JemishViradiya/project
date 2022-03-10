import { all, call } from 'redux-saga/effects'

import { UesReduxStore } from '@ues-data/shared'

import ExclusionRestrictedAppsReducer from './reducer'
import {
  createRestrictedAppsSaga,
  deleteRestrictedAppsSaga,
  editRestrictedAppsSaga,
  fetchRestrictedAppsSaga,
  importRestrictedAppsSaga,
} from './sagas'
import { ReduxSlice as RestrictedAppsSlice } from './types'

export function* exclusionRestrictedAppsSaga() {
  yield all([
    call(fetchRestrictedAppsSaga),
    call(createRestrictedAppsSaga),
    call(importRestrictedAppsSaga),
    call(editRestrictedAppsSaga),
    call(deleteRestrictedAppsSaga),
  ])
}

UesReduxStore.registerSlice(
  RestrictedAppsSlice,
  { reducer: ExclusionRestrictedAppsReducer, saga: exclusionRestrictedAppsSaga },
  { eager: true },
)

export * from './actions'
export * from './selectors'
export * from './data-layer'
