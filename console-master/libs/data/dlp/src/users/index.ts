import { all, call } from 'redux-saga/effects'

import { UesReduxStore } from '@ues-data/shared'

import ExclusionReducer from './reducer'
import { fetchDevicesSaga, fetchUsersSaga } from './sagas'
import { UsersReduxSlice } from './types'

export function* exclusionSaga() {
  yield all([call(fetchUsersSaga), call(fetchDevicesSaga)])
}

UesReduxStore.registerSlice(UsersReduxSlice, { reducer: ExclusionReducer, saga: exclusionSaga }, { eager: false })

export * from './actions'
export * from './selectors'
export * from './data-layer'
