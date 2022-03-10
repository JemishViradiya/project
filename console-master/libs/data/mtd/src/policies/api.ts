import { all } from 'redux-saga/effects'

import { UesReduxStore } from '@ues-data/shared'

import {
  watchPoliciesDeleteAsync,
  watchPolicyAsync,
  watchPolicyCreateAsync,
  watchPolicyDeleteAsync,
  watchPolicyUpdateAsync,
} from './actions/Policy'
import { PolicyReducer } from './reducers/Policy'
import { PoliciesReduxSlice } from './selectors'

export function* rootSaga() {
  yield all([
    watchPolicyAsync(),
    watchPolicyCreateAsync(),
    watchPolicyDeleteAsync(),
    watchPoliciesDeleteAsync(),
    watchPolicyUpdateAsync(),
  ])
}

export const slice = UesReduxStore.registerSlice(PoliciesReduxSlice, { reducer: PolicyReducer, saga: rootSaga })

export * from './actions/actions'
export * from './actions/Policy'
export * from './selectors'
