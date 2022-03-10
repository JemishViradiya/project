/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'

import {
  DirectoryCreatePermissions,
  DirectoryDeletePermissions,
  DirectoryReadPermissions,
  DirectoryUpdatePermissions,
} from '../../shared/permissions'
import { Directory } from '../directory'
import { DirectoryMock } from '../directory-mock'
import type { DirectoryInstance } from '../directory-types'
import {
  addCompanyDirectoryStart,
  cancelSyncDirectoryStart,
  editCompanyDirectoryStart,
  getCompanyDirectoriesStart,
  removeCompanyDirectoryStart,
  syncDirectoryStart,
} from './actions'
import {
  getAddCompanyDirectoryTask,
  getCancelSyncDirectoryTask,
  getCompanyDirectoriesTask,
  getEditCompanyDirectoryTask,
  getRemoveCompanyDirectoryTask,
  getSyncDirectoryTask,
} from './selectors'
import type { CompanyDirectoryState, Task } from './types'
import { ReduxSlice } from './types'

export const isTaskResolved = (currentTask?: Task, previousTask?: Task): boolean =>
  previousTask && currentTask && previousTask.loading === true && currentTask.loading === false

export const mutationRemoveDirectory: ReduxMutation<
  void,
  Parameters<typeof removeCompanyDirectoryStart>[0],
  CompanyDirectoryState['tasks']['removeDirectory']
> = {
  mutation: payload => removeCompanyDirectoryStart(payload, Directory),
  mockMutation: payload => removeCompanyDirectoryStart(payload, DirectoryMock),
  selector: () => getRemoveCompanyDirectoryTask,
  slice: ReduxSlice,
  permissions: DirectoryDeletePermissions,
}

export const mutationAddDirectory: ReduxMutation<
  DirectoryInstance,
  Parameters<typeof addCompanyDirectoryStart>[0],
  CompanyDirectoryState['tasks']['addDirectory']
> = {
  mutation: payload => addCompanyDirectoryStart(payload, Directory),
  mockMutation: payload => addCompanyDirectoryStart(payload, DirectoryMock),
  selector: () => getAddCompanyDirectoryTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: DirectoryCreatePermissions,
}

export const queryCompanyDirectories: ReduxQuery<
  DirectoryInstance[],
  Parameters<typeof getCompanyDirectoriesStart>[0],
  ReturnType<typeof getCompanyDirectoriesTask>
> = {
  query: payload => getCompanyDirectoriesStart(payload, Directory),
  mockQuery: payload => getCompanyDirectoriesStart(payload, DirectoryMock),
  selector: () => getCompanyDirectoriesTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: DirectoryReadPermissions,
}

export const mutationEditDirectory: ReduxMutation<
  DirectoryInstance,
  Parameters<typeof editCompanyDirectoryStart>[0],
  CompanyDirectoryState['tasks']['editDirectory']
> = {
  mutation: payload => editCompanyDirectoryStart(payload, Directory),
  mockMutation: payload => editCompanyDirectoryStart(payload, DirectoryMock),
  selector: () => getEditCompanyDirectoryTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: DirectoryUpdatePermissions,
}

export const mutationCancelSyncDirectory: ReduxMutation<
  void,
  Parameters<typeof cancelSyncDirectoryStart>[0],
  CompanyDirectoryState['tasks']['cancelSyncDirectory']
> = {
  mutation: payload => cancelSyncDirectoryStart(payload, Directory),
  mockMutation: payload => cancelSyncDirectoryStart(payload, DirectoryMock),
  selector: () => getCancelSyncDirectoryTask,
  slice: ReduxSlice,
  permissions: DirectoryUpdatePermissions,
}

export const mutationSyncDirectory: ReduxMutation<
  DirectoryInstance,
  Parameters<typeof syncDirectoryStart>[0],
  CompanyDirectoryState['tasks']['syncDirectory']
> = {
  mutation: payload => syncDirectoryStart(payload, Directory),
  mockMutation: payload => syncDirectoryStart(payload, DirectoryMock),
  selector: () => getSyncDirectoryTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: DirectoryUpdatePermissions,
}
