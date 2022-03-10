import { UesReduxStore } from '@ues-data/shared'

import Reducer from './reducer'
import { rootSaga } from './sagas'
import { ReduxSlice as GroupsSlice } from './types'

export const slice = UesReduxStore.registerSlice(GroupsSlice, { reducer: Reducer, saga: rootSaga })

export * from './data-layer'
export * from './actions'
export * from './selectors'
