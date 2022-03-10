//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { isEqual, pick } from 'lodash-es'
import { createSelector } from 'reselect'

import type { TenantConfigState } from './types'
import { ReduxSlice } from './types'

export const getTenantConfigState = (state): TenantConfigState => state[ReduxSlice]

export const getTenantConfigTasks = createSelector(getTenantConfigState, state => state?.tasks)

export const getTenantConfigurationTask = createSelector(getTenantConfigTasks, tasks => tasks?.fetchTenantConfigTask)

export const getTenantHealthTask = createSelector(getTenantConfigTasks, tasks => tasks?.fetchTenantHealthTask)

export const getUpdateTenantConfigurationTask = createSelector(getTenantConfigTasks, tasks => tasks?.updateTenantConfigTask)

export const getLocalTenantConfig = createSelector(getTenantConfigState, state => state.ui.localTenantConfig)

export const getPrivateDnsZones = createSelector(getLocalTenantConfig, localTenantConfig => localTenantConfig?.privateDnsZones)

export const getPrivateDnsZonesByType = createSelector(getLocalTenantConfig, localTenantConfig => zonesType =>
  localTenantConfig?.privateDnsZones?.[zonesType]?.[0] || [],
)

export const getHasUnsavedTenantChanges = createSelector(
  getTenantConfigurationTask,
  getLocalTenantConfig,
  (tenantInformationTask, localTenantConfig) => (tenantConfigurationKeys: string[] = []) =>
    !isEqual(pick(tenantInformationTask?.data, tenantConfigurationKeys), pick(localTenantConfig, tenantConfigurationKeys)),
)
