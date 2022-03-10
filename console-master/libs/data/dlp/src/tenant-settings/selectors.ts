import { createSelector } from 'reselect'

import type { TenantConfigsState } from './configs-types'
import { TenantConfigsReduxSlice } from './configs-types'

const getState = (state: { [k in typeof TenantConfigsReduxSlice]: TenantConfigsState }) => state[TenantConfigsReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getFetchConfigsTask = createSelector(getTasks, tasks => tasks?.fetchConfigs)

export const getUpdateConfigsTask = createSelector(getTasks, tasks => tasks?.updateConfigs)

export const getFetchFileSettingsTask = createSelector(getTasks, tasks => tasks?.fetchFileSettings)

export const getUpdateFileSettingsTask = createSelector(getTasks, tasks => tasks?.updateFileSettings)

export const getRemediationSettingsTask = createSelector(getTasks, tasks => tasks?.fetchRemediationSettings)

export const getUpdateRemediationSettingsTask = createSelector(getTasks, tasks => tasks?.updateRemediationSettings)
