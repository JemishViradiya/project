import { all, call } from 'redux-saga/effects'

import { UesReduxStore } from '@ues-data/shared'

import ExclusionRestrictedDomainsReducer from './reducer'
import {
  createRestrictedDomainsSaga,
  deleteMultipleRestrictedDomainsSaga,
  deleteRestrictedDomainsSaga,
  editRestrictedDomainsSaga,
  fetchRestrictedDomainsSaga,
  importRestrictedDomainsSaga,
} from './sagas'
import { ReduxSlice as RestrictedDomainsSlice } from './types'

export function* exclusionRestrictedDomainsSaga() {
  yield all([
    call(fetchRestrictedDomainsSaga),
    call(createRestrictedDomainsSaga),
    call(editRestrictedDomainsSaga),
    call(deleteRestrictedDomainsSaga),
    call(deleteMultipleRestrictedDomainsSaga),
    call(importRestrictedDomainsSaga),
  ])
}

UesReduxStore.registerSlice(RestrictedDomainsSlice, {
  reducer: ExclusionRestrictedDomainsReducer,
  saga: exclusionRestrictedDomainsSaga,
})

export * from './actions'
export * from './selectors'
export * from './data-layer'
