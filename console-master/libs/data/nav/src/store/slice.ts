/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { UesReduxStore } from '@ues-data/shared'

import reducer from './reducer'
import { rootSaga } from './sagas'
import { ReduxSlice } from './types'

UesReduxStore.registerSlice(ReduxSlice, { reducer: reducer, saga: rootSaga })
