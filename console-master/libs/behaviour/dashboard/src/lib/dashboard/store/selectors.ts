/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createSelector } from 'reselect'

import type { UesReduxState } from '@ues-data/shared'

import type { DashboardProps } from '../types'
import { ReduxSlice } from './types'

export const selectState = (state: UesReduxState<typeof ReduxSlice, DashboardProps>) => state[ReduxSlice]

export const selectIsInitialized = createSelector(
  selectState,
  (state, props: DashboardProps) => props.id,
  (state, id) => state && state.id === id,
)

export const selectError = createSelector(
  selectState,
  (state, props: DashboardProps) => props.id,
  (state, id) => (state ? state.error : undefined),
)

export const selectDashboardId = createSelector(selectState, state => state.id)

export const selectCardState = createSelector(selectState, state => state.cardState)

export const selectCardStateById = id => createSelector(selectState, state => state.cardState[id])

export const selectChartLibrary = createSelector(selectState, state => state.chartLibrary)

export const selectLayoutState = createSelector(selectState, state => state.layoutState)

export const selectGlobalTime = createSelector(selectState, state => state.globalTime)

export const selectNowTime = createSelector(selectState, state => state.globalTime.nowTime)

export const selectChartsRemovable = createSelector(selectState, state => state.chartsRemovable)

export const selectTitle = createSelector(selectState, state => state.title)

export const selectEditable = createSelector(selectState, state => state.editable)
