//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { UesReduxStore } from '@ues-data/shared'

import reducer from './reducer'
import { rootSaga } from './sagas'
import { ReduxSlice } from './types'

UesReduxStore.registerSlice(ReduxSlice, { reducer, saga: rootSaga })

export * from './actions'
export * from './selectors'
export * from './data-layer'
