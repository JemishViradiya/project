//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty, isEqual } from 'lodash-es'
import { createSelector } from 'reselect'

import { isDestinationsValid } from '../../../../utils'
import type { NetworkServicesState } from './types'
import { ReduxSlice } from './types'

export const getNetworkServicesState = (state): NetworkServicesState => state[ReduxSlice]

export const getNetworkServicesTasks = createSelector(getNetworkServicesState, state => state?.tasks)

export const getNetworkServiceTask = createSelector(getNetworkServicesTasks, tasks => tasks?.fetchNetworkService)

export const getLocalNetworkServiceData = createSelector(getNetworkServicesState, state => state?.ui?.localNetworkServiceData)

export const getCreateNetworkServiceTask = createSelector(getNetworkServicesTasks, tasks => tasks?.createNetworkService)

export const getUpdateNetworkServiceTask = createSelector(getNetworkServicesTasks, tasks => tasks?.updateNetworkService)

export const getDeleteNetworkServiceTask = createSelector(getNetworkServicesTasks, tasks => tasks?.deleteNetworkService)

export const getHasUnsavedNetworkServiceChanges = createSelector(
  getNetworkServiceTask,
  getLocalNetworkServiceData,
  (networkServiceTask, localNetworkServiceData) =>
    (!isEmpty(networkServiceTask?.data) || !isEmpty(localNetworkServiceData)) &&
    !isEqual(networkServiceTask?.data, localNetworkServiceData),
)

export const getIsNetworkServiceDefinitionValid = createSelector(getLocalNetworkServiceData, localNetworkServiceData =>
  isDestinationsValid(localNetworkServiceData),
)
