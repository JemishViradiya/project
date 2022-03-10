import { all, call } from 'redux-saga/effects'

import { UesReduxStore } from '@ues-data/shared'

import { TenantConfigsReduxSlice } from './configs-types'
import TenantConfigsReducer from './reducer'
import {
  fetchConfigsSaga,
  fetchFileSettingsSaga,
  fetchRemediationSettingsSaga,
  updateConfigsSaga,
  updateFileSettingsSaga,
  updateRemediationSettingsSaga,
} from './sagas'

export function* TenantConfigsSaga() {
  yield all([
    call(fetchConfigsSaga),
    call(updateConfigsSaga),
    call(fetchFileSettingsSaga),
    call(updateFileSettingsSaga),
    call(fetchRemediationSettingsSaga),
    call(updateRemediationSettingsSaga),
  ])
}

UesReduxStore.registerSlice(TenantConfigsReduxSlice, { reducer: TenantConfigsReducer, saga: TenantConfigsSaga })

export * from './actions'
export * from './selectors'
export * from './data-layer'
