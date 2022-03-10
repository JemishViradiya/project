/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'
import type { PagableResponse } from '@ues-data/shared-types'
import { Permission } from '@ues-data/shared-types'

import { DataEntitiesApi, DataEntitiesMockApi } from '../data-entity-service'
import type { DataEntity } from '../types'
import {
  assotiateDataEntitiesStart,
  createDataEntityStart,
  deleteDataEntityStart,
  editDataEntityStart,
  fetchAssotiatedDataEntitiesStart,
  fetchDataEntitiesByGuidsStart,
  fetchDataEntitiesStart,
  getDataEntityStart,
} from './actions'
import {
  getAssociateDataEntitiesTask,
  getAssociatedTask,
  getCreateDataEntityTask,
  getDataEntitiesByGuidsTask,
  getDataEntitiesTask,
  getDataEntityTask,
  getDeleteDataEntityTask,
  getEditDataEntityTask,
} from './selectors'
import type { DataEntitiesState, TaskId } from './types'
import { DataEntitiesReduxSlice } from './types'

const permissions = new Set([Permission.BIP_SETTINGS_READ])

export const queryDataEntities: ReduxQuery<
  PagableResponse<DataEntity>,
  Parameters<typeof fetchDataEntitiesStart>[0],
  DataEntitiesState['tasks'][TaskId.DataEntities] //Task<DataEntityEntitiesResponse>
> = {
  query: payload => fetchDataEntitiesStart(payload, DataEntitiesApi),
  mockQuery: payload => fetchDataEntitiesStart(payload, DataEntitiesMockApi),
  selector: () => getDataEntitiesTask,
  dataProp: 'result',
  slice: DataEntitiesReduxSlice,
  permissions,
}

export const queryAssociatedDataEntities: ReduxQuery<
  PagableResponse<DataEntity>,
  Parameters<typeof fetchAssotiatedDataEntitiesStart>[0],
  DataEntitiesState['tasks'][TaskId.AssociatedDataEntities]
> = {
  query: () => fetchAssotiatedDataEntitiesStart(DataEntitiesApi),
  mockQuery: () => fetchAssotiatedDataEntitiesStart(DataEntitiesMockApi),
  selector: () => getAssociatedTask,
  dataProp: 'result',
  slice: DataEntitiesReduxSlice,
  permissions,
}

export const queryDataEntitiesByGuids: ReduxQuery<
  DataEntity[],
  Parameters<typeof fetchDataEntitiesByGuidsStart>[0],
  DataEntitiesState['tasks'][TaskId.GetDataEntitiesByGuid]
> = {
  query: payload => fetchDataEntitiesByGuidsStart(payload, DataEntitiesApi),
  mockQuery: payload => fetchDataEntitiesByGuidsStart(payload, DataEntitiesMockApi),
  selector: () => getDataEntitiesByGuidsTask,
  dataProp: 'result',
  slice: DataEntitiesReduxSlice,
  permissions,
}

export const queryDataEntity: ReduxQuery<
  DataEntity,
  Parameters<typeof getDataEntityStart>[0],
  DataEntitiesState['tasks'][TaskId.GetDataEntity]
> = {
  query: payload => getDataEntityStart(payload, DataEntitiesApi),
  mockQuery: payload => getDataEntityStart(payload, DataEntitiesMockApi),
  selector: () => getDataEntityTask,
  dataProp: 'result',
  slice: DataEntitiesReduxSlice,
  permissions,
}

export const mutationCreateDataEntity: ReduxMutation<
  DataEntity,
  Parameters<typeof createDataEntityStart>[0],
  DataEntitiesState['tasks'][TaskId.CreateDataEntity]
> = {
  mutation: payload => createDataEntityStart(payload, DataEntitiesApi),
  mockMutation: payload => createDataEntityStart(payload, DataEntitiesMockApi),
  selector: () => getCreateDataEntityTask,
  dataProp: 'result',
  slice: DataEntitiesReduxSlice,
}

export const mutationAssotiateDataEntities: ReduxMutation<
  void,
  Parameters<typeof assotiateDataEntitiesStart>[0],
  DataEntitiesState['tasks'][TaskId.AssociateDataEntities] //Task
> = {
  mutation: payload => assotiateDataEntitiesStart(payload, DataEntitiesApi),
  mockMutation: payload => assotiateDataEntitiesStart(payload, DataEntitiesMockApi),
  selector: () => getAssociateDataEntitiesTask,
  slice: DataEntitiesReduxSlice,
}

export const mutationEditDataEntity: ReduxMutation<
  DataEntity,
  Parameters<typeof editDataEntityStart>[0],
  DataEntitiesState['tasks'][TaskId.EditDataEntity]
> = {
  mutation: payload => editDataEntityStart(payload, DataEntitiesApi),
  mockMutation: payload => editDataEntityStart(payload, DataEntitiesMockApi),
  selector: () => getEditDataEntityTask,
  slice: DataEntitiesReduxSlice,
}

export const mutationDeleteDataEntity: ReduxMutation<
  void,
  Parameters<typeof deleteDataEntityStart>[0],
  DataEntitiesState['tasks'][TaskId.DeleteDataEntity]
> = {
  mutation: payload => deleteDataEntityStart(payload, DataEntitiesApi),
  mockMutation: payload => deleteDataEntityStart(payload, DataEntitiesMockApi),
  selector: () => getDeleteDataEntityTask,
  slice: DataEntitiesReduxSlice,
}
