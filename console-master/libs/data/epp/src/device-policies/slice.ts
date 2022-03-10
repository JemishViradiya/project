import { UesReduxStore } from '@ues-data/shared'

import { DevicePoliciesReduxSlice } from './constants'
import reducer from './reducer'
import saga from './sagas'

UesReduxStore.registerSlice(DevicePoliciesReduxSlice, {
  reducer,
  saga,
})
