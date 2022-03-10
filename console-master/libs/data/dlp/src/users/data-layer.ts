/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReduxQuery } from '@ues-data/shared'
import type { PagableResponse } from '@ues-data/shared-types'
import { Permission } from '@ues-data/shared-types'

import type { DevicesBase, UsersBase } from '../users-service'
import { UsersApi, UsersMockApi } from '../users-service'
import { fetchDevicesStart, fetchUsersStart } from './actions'
import { getDevicesTask, getUsersTask } from './selectors'
import type { TaskId, UsersState } from './types'
import { UsersReduxSlice } from './types'

const permissions = new Set([Permission.ECS_USERS_READ, Permission.ECS_DIRECTORY_READ])
const devicesPermissions = new Set([Permission.ECS_USERS_READ])

export const queryUsersList: ReduxQuery<
  PagableResponse<UsersBase>,
  Parameters<typeof fetchUsersStart>[0],
  UsersState['tasks'][TaskId.GetUsers]
> = {
  query: payload => fetchUsersStart(payload, UsersApi),
  mockQuery: payload => fetchUsersStart(payload, UsersMockApi),
  selector: () => getUsersTask,
  dataProp: 'result',
  slice: UsersReduxSlice,
  permissions,
}

export const queryDevices: ReduxQuery<
  DevicesBase[],
  Parameters<typeof fetchDevicesStart>[0],
  UsersState['tasks'][TaskId.GetDevices]
> = {
  query: payload => fetchDevicesStart(payload, UsersApi),
  mockQuery: payload => fetchDevicesStart(payload, UsersMockApi),
  selector: () => getDevicesTask,
  dataProp: 'result',
  slice: UsersReduxSlice,
  permissions: devicesPermissions,
}
