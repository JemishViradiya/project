import { UesReduxStore } from '@ues-data/shared'

import { ReduxSlice } from './types'

export default UesReduxStore.registerSlice(ReduxSlice, async () => ({
  reducer: (await import('./reducer')).default,
  saga: (await import('./sagas')).rootSaga,
}))

export * from './actions'
export * from './selectors'
export * from './data-layer'
