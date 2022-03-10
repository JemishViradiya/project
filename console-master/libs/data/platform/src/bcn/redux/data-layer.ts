/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'

import { BCNDeletePermissions, BCNReadPermissions } from '../../shared/permissions'
import type { BcnConfigSettings, BCNConnection } from '../common'
import { Bcn, BcnMock } from '../common'
import { deleteBcnConnectionStart, getBcnConnectionsStart, getBcnSettingsStart } from './actions'
import { getBcnSettingsTask, getConnectionsTask, getDeleteConnectionTask } from './selectors'
import type { BcnState, Task } from './types'
import { ReduxSlice } from './types'

export const isTaskResolved = (currentTask?: Task, previousTask?: Task): boolean =>
  previousTask && currentTask && previousTask.loading === true && currentTask.loading === false

export const mutationDeleteConnection: ReduxMutation<
  { id: string },
  Parameters<typeof deleteBcnConnectionStart>[0],
  BcnState['tasks']['deleteInstance']
> = {
  mutation: payload => deleteBcnConnectionStart(payload, Bcn),
  mockMutation: payload => deleteBcnConnectionStart(payload, BcnMock),
  selector: () => getDeleteConnectionTask,
  slice: ReduxSlice,
  permissions: BCNDeletePermissions,
}

export const queryConnections: ReduxQuery<
  BCNConnection[],
  Parameters<typeof getBcnConnectionsStart>[0],
  ReturnType<typeof getConnectionsTask>
> = {
  query: payload => getBcnConnectionsStart(Bcn),
  mockQuery: payload => getBcnConnectionsStart(BcnMock),
  selector: () => getConnectionsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: BCNReadPermissions,
}

export const querySettings: ReduxQuery<
  BcnConfigSettings,
  Parameters<typeof getBcnSettingsStart>[0],
  ReturnType<typeof getBcnSettingsTask>
> = {
  query: payload => getBcnSettingsStart(Bcn),
  mockQuery: payload => getBcnSettingsStart(BcnMock),
  selector: () => getBcnSettingsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: BCNReadPermissions,
}

export { setLocalBcnSettings } from './actions'
export { getBcnSettings } from './selectors'
