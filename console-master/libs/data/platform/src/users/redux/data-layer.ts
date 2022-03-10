/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { PagableResponse, ReduxQuery } from '@ues-data/shared'

import { UserReadPermissions } from '../../shared/permissions'
import type { User } from '../common'
import { Users, UsersMock, usersMock } from '../common'
import { fetchUsersStart } from './actions'
import { getFetchUsersTask } from './selectors'
import type { Task } from './types'
import { ReduxSlice } from './types'

export const isTaskResolved = (currentTask?: Task, previousTask?: Task): boolean =>
  previousTask && currentTask && previousTask.loading === true && currentTask.loading === false

export const queryUsers: ReduxQuery<
  PagableResponse<User>,
  Parameters<typeof fetchUsersStart>[0],
  ReturnType<typeof getFetchUsersTask>
> = {
  id: 'platform.users.queryUsers.redux',
  query: payload => fetchUsersStart(payload, Users),
  mockQuery: payload => fetchUsersStart(payload, UsersMock),
  mockQueryFn: () => usersMock,
  selector: () => getFetchUsersTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: UserReadPermissions,
}
