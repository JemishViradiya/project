import { UesReduxStore } from '@ues-data/shared'

import { EppDashboardReduxSlice } from './constants'
import reducer from './reducer'
import saga from './sagas'

UesReduxStore.registerSlice(EppDashboardReduxSlice, {
  reducer,
  saga,
})
