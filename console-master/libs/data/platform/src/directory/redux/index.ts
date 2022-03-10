import { UesReduxStore } from '@ues-data/shared'

import Reducer from './reducer'
import { rootSaga } from './sagas'
import { ReduxSlice } from './types'

export const slice = UesReduxStore.registerSlice(ReduxSlice, { reducer: Reducer, saga: rootSaga })

export * from './data-layer'
export * from './actions'
export * from './selectors'
