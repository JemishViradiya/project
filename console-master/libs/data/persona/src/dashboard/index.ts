import { UesReduxStore } from '@ues-data/shared'

import DashboardReducer from './reducer'
import DashboardSagas from './sagas'
import { DashboardReduxSlice } from './types'

UesReduxStore.registerSlice(DashboardReduxSlice, { reducer: DashboardReducer, saga: DashboardSagas }, { eager: false })

export * as dashboardActions from './actions'
export * as dashboardSelectors from './types'
export * from './data-layer'
export * from './types'
export * from './selectors'
