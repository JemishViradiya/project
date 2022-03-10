import { all, call } from 'redux-saga/effects'

import { UesReduxStore } from '@ues-data/shared'

import ExclusionRestrictedIpAddressesReducer from './reducer'
import {
  createRestrictedIpAddressesSaga,
  deleteRestrictedIpAddressesSaga,
  editRestrictedIpAddressesSaga,
  fetchRestrictedIpAddressesSaga,
  importRestrictedIpAddressesSaga,
} from './sagas'
import { ReduxSlice as RestrictedIpAddressesSlice } from './types'

export function* exclusionRestrictedIpAddressesSaga() {
  yield all([
    call(fetchRestrictedIpAddressesSaga),
    call(createRestrictedIpAddressesSaga),
    call(editRestrictedIpAddressesSaga),
    call(deleteRestrictedIpAddressesSaga),
    call(importRestrictedIpAddressesSaga),
  ])
}

UesReduxStore.registerSlice(RestrictedIpAddressesSlice, {
  reducer: ExclusionRestrictedIpAddressesReducer,
  saga: exclusionRestrictedIpAddressesSaga,
})

export * from './actions'
export * from './selectors'
export * from './data-layer'
