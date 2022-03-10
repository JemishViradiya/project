import { UesReduxStore } from '@ues-data/shared'

import { DeploymentsReduxSlice } from './constants'
import reducer from './reducer'
import saga from './sagas'

UesReduxStore.registerSlice(DeploymentsReduxSlice, {
  reducer,
  saga,
})
