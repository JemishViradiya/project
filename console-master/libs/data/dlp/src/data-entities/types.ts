/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { PagableResponse } from '@ues-data/shared-types'

import type { DataEntitiesApi, DataEntitiesMockApi } from '../data-entity-service'
import type { DataEntity } from '../types'

export type ApiProvider = typeof DataEntitiesApi | typeof DataEntitiesMockApi

export const DataEntitiesReduxSlice = 'app.dlp.dataEntities'

export interface Task<TResult = unknown> {
  loading?: boolean
  error?: Error
  result?: TResult
}

export enum TaskId {
  DataEntities = 'dataEntities',
  AssociatedDataEntities = 'getAssociatedDataEntities',
  GetDataEntitiesByGuid = 'getDataEntitiesByGuids',
  GetDataEntity = 'getDataEntity',
  CreateDataEntity = 'createDataEntity',
  AssociateDataEntities = 'associateDataEntities',
  EditDataEntity = 'editDataEntity',
  DeleteDataEntity = 'deleteDataEntity',
}

export interface DataEntitiesState {
  tasks?: {
    dataEntities: Task<PagableResponse<DataEntity>>
    getAssociatedDataEntities: Task<PagableResponse<DataEntity>>
    getDataEntitiesByGuids: Task<DataEntity[]>
    getDataEntity: Task<DataEntity>
    createDataEntity: Task<DataEntity>
    associateDataEntities: Task
    editDataEntity: Task
    deleteDataEntity: Task
  }
  ui?: {
    localDataEntity?: Partial<DataEntity>
  }
}

export const DataEntityActionType = {
  FetchDataEntitiesStart: `${DataEntitiesReduxSlice}/fetch-data-entities-start`,
  FetchDataEntitiesError: `${DataEntitiesReduxSlice}/fetch-data-entities-error`,
  FetchDataEntitiesSuccess: `${DataEntitiesReduxSlice}/fetch-data-entities-success`,
  ClearDataEntity: `${DataEntitiesReduxSlice}/clear-data-entity`,

  GetAssociatedDataEntitiesStart: `${DataEntitiesReduxSlice}/get-associated-data-entities-start`,
  GetAssociatedDataEntitiesError: `${DataEntitiesReduxSlice}/get-associated-data-entities-error`,
  GetAssociatedDataEntitiesSuccess: `${DataEntitiesReduxSlice}/get-associated-data-entities-success`,

  GetDataEntitiesByGuidsStart: `${DataEntitiesReduxSlice}/get-data-entities-byGuids-start`,
  GetDataEntitiesByGuidsError: `${DataEntitiesReduxSlice}/get-data-entities-byGuids-error`,
  GetDataEntitiesByGuidsSuccess: `${DataEntitiesReduxSlice}/get-data-entities-byGuids-success`,

  GetDataEntityStart: `${DataEntitiesReduxSlice}/get-data-entity-start`,
  GetDataEntityError: `${DataEntitiesReduxSlice}/get-data-entity-error`,
  GetDataEntitySuccess: `${DataEntitiesReduxSlice}/get-data-entity-success`,

  CreateDataEntityStart: `${DataEntitiesReduxSlice}/create-data-entity-start`,
  CreateDataEntityError: `${DataEntitiesReduxSlice}/create-data-entity-error`,
  CreateDataEntitySuccess: `${DataEntitiesReduxSlice}/create-data-entity-success`,

  AssociateDataEntitiesStart: `${DataEntitiesReduxSlice}/associate-data-entities-start`,
  AssociateDataEntitiesError: `${DataEntitiesReduxSlice}/associate-data-entities-error`,
  AssociateDataEntitiesSuccess: `${DataEntitiesReduxSlice}/associate-data-entities-success`,

  EditDataEntityStart: `${DataEntitiesReduxSlice}/edit-data-entity-start`,
  EditDataEntityError: `${DataEntitiesReduxSlice}/edit-data-entity-error`,
  EditDataEntitySuccess: `${DataEntitiesReduxSlice}/edit-data-entity-success`,

  DeleteDataEntityStart: `${DataEntitiesReduxSlice}/delete-data-entity-start`,
  DeleteDataEntityError: `${DataEntitiesReduxSlice}/delete-data-entity-error`,
  DeleteDataEntitySuccess: `${DataEntitiesReduxSlice}/delete-data-entity-success`,

  UpdateLocalDataEntity: `${DataEntitiesReduxSlice}/update-local-data-entity`,
}

// eslint-disable-next-line no-redeclare
export type DataEntityActionType = string
