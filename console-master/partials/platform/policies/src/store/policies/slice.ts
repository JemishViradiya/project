import { UesReduxStore } from '@ues-data/shared'

import { ReduxSlice } from './types'

console.warn('slice', ReduxSlice)
export default UesReduxStore.registerSlice(ReduxSlice, async () => ({
  reducer: (await import('./reducer')).default,
  saga: (await import('./sagas')).rootSaga,
}))
