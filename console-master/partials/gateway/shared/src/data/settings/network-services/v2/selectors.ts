//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { createSelector } from 'reselect'

import type { NetworkServicesState } from './types'
import { ReduxSlice } from './types'

export const getNetworkServicesState = (state): NetworkServicesState => state[ReduxSlice]

export const getNetworkServicesTasks = createSelector(getNetworkServicesState, state => state?.tasks)

export const getNetworkServices = createSelector(getNetworkServicesTasks, tasks => tasks?.networkServices?.data)

export const getNetworkServicesTask = createSelector(getNetworkServicesTasks, tasks => tasks?.networkServices)

export const getCreateNetworkServiceTask = createSelector(getNetworkServicesTasks, tasks => tasks?.createNetworkService)

export const getUpdateNetworkServiceTask = createSelector(getNetworkServicesTasks, tasks => tasks?.updateNetworkService)

export const getDeleteNetworkServiceTask = createSelector(getNetworkServicesTasks, tasks => tasks?.deleteNetworkService)
