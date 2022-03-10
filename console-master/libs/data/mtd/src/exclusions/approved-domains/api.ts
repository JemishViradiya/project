import { all, call } from 'redux-saga/effects'

import { UesReduxStore } from '@ues-data/shared'

import ExclusionApprovedDomainsReducer from './reducer'
import {
  createApprovedDomainsSaga,
  deleteApprovedDomainsSaga,
  deleteMultipleApprovedDomainsSaga,
  editApprovedDomainsSaga,
  fetchApprovedDomainsSaga,
  importApprovedDomainsSaga,
} from './sagas'
import { ReduxSlice as ApprovedDomainsSlice } from './types'

export function* exclusionApprovedDomainsSaga() {
  yield all([
    call(fetchApprovedDomainsSaga),
    call(createApprovedDomainsSaga),
    call(editApprovedDomainsSaga),
    call(deleteApprovedDomainsSaga),
    call(deleteMultipleApprovedDomainsSaga),
    call(importApprovedDomainsSaga),
  ])
}

UesReduxStore.registerSlice(ApprovedDomainsSlice, {
  reducer: ExclusionApprovedDomainsReducer,
  saga: exclusionApprovedDomainsSaga,
})

export * from './actions'
export * from './selectors'
export * from './data-layer'
