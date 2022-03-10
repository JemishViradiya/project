import { all, call } from 'redux-saga/effects'

import { UesReduxStore } from '@ues-data/shared'

import ExclusionReducer from './reducer'
import { parseAppFileSaga } from './sagas'
import { ReduxSlice as ParseAppFileSlice } from './types'

export function* exclusionParseAppFileSaga() {
  yield all([call(parseAppFileSaga)])
}

UesReduxStore.registerSlice(ParseAppFileSlice, { reducer: ExclusionReducer, saga: exclusionParseAppFileSaga }, { eager: true })

export * from './actions'
export * from './selectors'
export * from './data-layer'
