import { UesReduxStore } from '@ues-data/shared'

import ExclusionReducer from './reducer'
import exclusionSaga from './sagas'
import { UsersReduxSlice } from './types'

UesReduxStore.registerSlice(UsersReduxSlice, { reducer: ExclusionReducer, saga: exclusionSaga }, { eager: false })

export * as usersActions from './actions'
export * as usersSelectors from './selectors'
export * from './data-layer'
export * from './types'
export * from './utils'
export * from './constants'
