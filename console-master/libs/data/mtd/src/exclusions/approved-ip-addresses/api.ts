import { all, call } from 'redux-saga/effects'

import { UesReduxStore } from '@ues-data/shared'

import ExclusionApprovedIpAddressesReducer from './reducer'
import {
  createApprovedIpAddressesSaga,
  deleteApprovedIpAddressesSaga,
  editApprovedIpAddressesSaga,
  fetchApprovedIpAddressesSaga,
  importApprovedIpAddressesSaga,
} from './sagas'
import { ReduxSlice as ApprovedIpAddressesSlice } from './types'

export function* exclusionApprovedIpAddressesSaga() {
  yield all([
    call(fetchApprovedIpAddressesSaga),
    call(createApprovedIpAddressesSaga),
    call(editApprovedIpAddressesSaga),
    call(deleteApprovedIpAddressesSaga),
    call(importApprovedIpAddressesSaga),
  ])
}

UesReduxStore.registerSlice(ApprovedIpAddressesSlice, {
  reducer: ExclusionApprovedIpAddressesReducer,
  saga: exclusionApprovedIpAddressesSaga,
})

export * from './actions'
export * from './selectors'
export * from './data-layer'
