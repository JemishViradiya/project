//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEqual, pick } from 'lodash-es'
import { createSelector } from 'reselect'

import type { NetworkProtectionConfigState } from './types'
import { ReduxSlice } from './types'

export const getNetworkProtectionConfigState = (state): NetworkProtectionConfigState => state[ReduxSlice]

export const getNetworkProtectionConfigTasks = createSelector(getNetworkProtectionConfigState, state => state?.tasks)

export const getNetworkProtectionConfigTask = createSelector(
  getNetworkProtectionConfigTasks,
  tasks => tasks?.fetchNetworkProtectionConfigTask,
)

export const getUpdateNetworkProtectionConfigTask = createSelector(
  getNetworkProtectionConfigTasks,
  tasks => tasks?.updateNetworkProtectionConfigTask,
)

export const getLocalNetworkProtectionConfig = createSelector(
  getNetworkProtectionConfigState,
  state => state.ui.localNetworkProtectionConfig,
)

export const getHasUnsavedNetworkProtectionChanges = createSelector(
  getNetworkProtectionConfigTask,
  getLocalNetworkProtectionConfig,
  (networkProtectionInformationTask, localNetworkProtectionConfig) => (networkProtectionConfigKeys: string[] = []) =>
    !isEqual(
      pick(networkProtectionInformationTask?.data, networkProtectionConfigKeys),
      pick(localNetworkProtectionConfig, networkProtectionConfigKeys),
    ),
)
