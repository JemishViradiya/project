/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReduxQuery } from '@ues-data/shared'
import type { PagableResponse } from '@ues-data/shared-types'
import { Permission } from '@ues-data/shared-types'

import type { FileInventoryBase, FileInventoryDetails } from '../file-inventory-service'
import { FileInventoryApi, FileInventoryMockApi } from '../file-inventory-service'
import { fetchFileDetailsStart, fetchFileInventoryStart } from './actions'
import { getFileDetailsTask, getFileInventoryTask } from './selectors'
import type { FileInventoryState, TaskId } from './types'
import { FileInventoryReduxSlice } from './types'

const permissions = new Set([Permission.BIP_FILESUMMARY_READ, Permission.ECS_USERS_READ, Permission.BIP_DEVICE_READ])

export const queryFileInventoryList: ReduxQuery<
  PagableResponse<FileInventoryBase>,
  Parameters<typeof fetchFileInventoryStart>[0],
  FileInventoryState['tasks'][TaskId.GetFileInventory]
> = {
  query: payload => fetchFileInventoryStart(payload, FileInventoryApi),
  mockQuery: payload => fetchFileInventoryStart(payload, FileInventoryMockApi),
  selector: () => getFileInventoryTask,
  dataProp: 'result',
  slice: FileInventoryReduxSlice,
  permissions,
}

export const queryFileDetails: ReduxQuery<
  FileInventoryDetails,
  Parameters<typeof fetchFileDetailsStart>[0],
  FileInventoryState['tasks'][TaskId.GetFileDetails]
> = {
  query: payload => fetchFileDetailsStart(payload, FileInventoryApi),
  mockQuery: payload => fetchFileDetailsStart(payload, FileInventoryMockApi),
  selector: () => getFileDetailsTask,
  dataProp: 'result',
  slice: FileInventoryReduxSlice,
  permissions,
}
