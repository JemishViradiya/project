import { createSelector } from 'reselect'

import type { DashboardProps } from '@ues-data/dashboard'
import type { UesReduxState } from '@ues-data/shared'

import { ReduxSlice } from './types'

export const selectDashboardConfigs = (state: UesReduxState<typeof ReduxSlice, DashboardProps[]>) => state?.[ReduxSlice]

export const selectIsInitialized = createSelector(selectDashboardConfigs, state => Array.isArray(state))
