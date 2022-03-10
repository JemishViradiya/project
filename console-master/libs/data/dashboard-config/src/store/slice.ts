import { UesReduxStore } from '@ues-data/shared'

import dashboardReducer from './reducers'
import { ReduxSlice } from './types'

UesReduxStore.registerSlice(ReduxSlice, { reducer: dashboardReducer })
