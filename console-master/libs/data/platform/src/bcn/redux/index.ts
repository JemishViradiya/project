import { UesReduxStore } from '@ues-data/shared'

import Reducer from './reducer'
import { rootSaga } from './sagas'
import { ReduxSlice as BcnSlice } from './types'

export const slice = UesReduxStore.registerSlice(BcnSlice, { reducer: Reducer, saga: rootSaga })

export * from './data-layer'
