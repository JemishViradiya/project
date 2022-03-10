import { all, call } from 'redux-saga/effects'

import { UesReduxStore } from '@ues-data/shared'

import ExclusionReducer from './reducer'
import {
  createBrowserDomainsSaga,
  deleteBrowserDomainsSaga,
  editBrowserDomainsSaga,
  fetchBrowserDomainsSaga,
  getBrowserDomainSaga,
  validateBrowserDomainSaga,
} from './sagas'
import { BrowserDomainsReduxSlice } from './types'

export function* exclusionSaga() {
  yield all([
    call(fetchBrowserDomainsSaga),
    call(getBrowserDomainSaga),
    call(createBrowserDomainsSaga),
    call(editBrowserDomainsSaga),
    call(deleteBrowserDomainsSaga),
    call(validateBrowserDomainSaga),
  ])
}

UesReduxStore.registerSlice(BrowserDomainsReduxSlice, { reducer: ExclusionReducer, saga: exclusionSaga }, { eager: false })

export * from './actions'
export * from './selectors'
export * from './data-layer'
