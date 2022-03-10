/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { createSelector } from 'reselect'

import type { ConnectionState } from './types'
import { ReduxSlice } from './types'

const getState = (state: { [k in typeof ReduxSlice]: ConnectionState }) => state[ReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getConnectionsTask = createSelector(getTasks, tasks => tasks?.connectionList)

export const addConnectionsTask = createSelector(getTasks, tasks => tasks?.addConnectionList)

export const getRemoveConnectionTask = createSelector(getTasks, tasks => tasks?.removeConnection)

export const getUEMTenantsTask = createSelector(getTasks, tasks => tasks?.uemTenantList)

export const addAppConfigTask = createSelector(getTasks, tasks => tasks?.addAppConfig)

export const getGroupsTask = createSelector(getTasks, tasks => tasks?.groupList)

export const retryConnectionTask = createSelector(getTasks, tasks => tasks?.retryConnection)
