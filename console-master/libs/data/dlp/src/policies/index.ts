import { all, call } from 'redux-saga/effects'

import { UesReduxStore } from '@ues-data/shared'

import ExclusionReducer from './reducer'
import {
  createPoliciesSaga,
  deletePoliciesSaga,
  editPoliciesSaga,
  fetchPoliciesByGuidsSaga,
  fetchPoliciesSaga,
  getDefaultPolicySaga,
  getPolicySaga,
  getPolicySettingDefinitionSaga,
  setDefaultPolicySaga,
} from './sagas'
import { PoliciesReduxSlice } from './types'

export function* exclusionSaga() {
  yield all([
    call(fetchPoliciesSaga),
    call(fetchPoliciesByGuidsSaga),
    call(getPolicySaga),
    call(createPoliciesSaga),
    call(editPoliciesSaga),
    call(deletePoliciesSaga),
    call(getDefaultPolicySaga),
    call(setDefaultPolicySaga),
    call(getPolicySettingDefinitionSaga),
  ])
}

UesReduxStore.registerSlice(PoliciesReduxSlice, { reducer: ExclusionReducer, saga: exclusionSaga }, { eager: false })

export * from './actions'
export * from './selectors'
export * from './data-layer'
