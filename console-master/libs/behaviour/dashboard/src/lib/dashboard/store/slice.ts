/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { UesReduxStore } from '@ues-data/shared'

import { rootSaga } from './sagas'
import { ReduxSlice } from './types'

UesReduxStore.registerSlice(ReduxSlice, async () => ({
  reducer: (await import('./reducers')).default,
  saga: rootSaga,
}))
