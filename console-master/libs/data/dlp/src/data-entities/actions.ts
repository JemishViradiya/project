/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { PagableResponse } from '@ues-data/shared'

import type { DataEntity, PageableSortableQueryParams } from '../types'
import type { ApiProvider } from './types'
import { DataEntityActionType } from './types'

//fetch dataEntities
export const fetchDataEntitiesStart = (payload: PageableSortableQueryParams<DataEntity>, apiProvider: ApiProvider) => ({
  type: DataEntityActionType.FetchDataEntitiesStart,
  payload: { queryParams: payload, apiProvider },
})

export const fetchDataEntitiesSuccess = (payload: PagableResponse<DataEntity>) => ({
  type: DataEntityActionType.FetchDataEntitiesSuccess,
  payload,
})

export const fetchDataEntitiesError = (error: Error) => ({
  type: DataEntityActionType.FetchDataEntitiesError,
  payload: { error },
})

//fetch dataEntities by guids
export const fetchDataEntitiesByGuidsStart = (payload: { dataEntityGuids: string[] }, apiProvider: ApiProvider) => ({
  type: DataEntityActionType.GetDataEntitiesByGuidsStart,
  payload: { ...payload, apiProvider },
})

export const fetchDataEntitiesByGuidsSuccess = (payload: DataEntity[]) => ({
  type: DataEntityActionType.GetDataEntitiesByGuidsSuccess,
  payload,
})

export const fetchDataEntitiesByGuidsError = (error: Error) => ({
  type: DataEntityActionType.GetDataEntitiesByGuidsError,
  payload: { error },
})

//fetch assotiated dataEntities
export const fetchAssotiatedDataEntitiesStart = (apiProvider: ApiProvider) => ({
  type: DataEntityActionType.GetAssociatedDataEntitiesStart,
  payload: { apiProvider },
})

export const fetchAssotiatedDataEntitiesSuccess = (payload: PagableResponse<DataEntity>) => ({
  type: DataEntityActionType.GetAssociatedDataEntitiesSuccess,
  payload,
})

export const fetchAssotiatedDataEntitiesError = (error: Error) => ({
  type: DataEntityActionType.GetAssociatedDataEntitiesError,
  payload: { error },
})

//get dataEntity
export const getDataEntityStart = (payload: { dataEntityGuid: string }, apiProvider: ApiProvider) => ({
  type: DataEntityActionType.GetDataEntityStart,
  payload: { ...payload, apiProvider },
})

export const getDataEntitySuccess = (payload: DataEntity) => ({
  type: DataEntityActionType.GetDataEntitySuccess,
  payload,
})

export const getDataEntityError = (error: Error) => ({
  type: DataEntityActionType.GetDataEntityError,
  payload: { error },
})

//create dataEntity
export const createDataEntityStart = (payload: DataEntity, apiProvider: ApiProvider) => ({
  type: DataEntityActionType.CreateDataEntityStart,
  payload: { apiProvider, dataEntity: payload },
})

export const createDataEntitySuccess = (payload: DataEntity) => ({
  type: DataEntityActionType.CreateDataEntitySuccess,
  payload,
})

export const createDataEntityError = (error: Error) => ({
  type: DataEntityActionType.CreateDataEntityError,
  payload: { error },
})

//assotiate dataEntities
export const assotiateDataEntitiesStart = (payload: { dataEntityGuids: string[] }, apiProvider: ApiProvider) => ({
  type: DataEntityActionType.AssociateDataEntitiesStart,
  payload: { ...payload, apiProvider },
})

export const assotiateDataEntitiesSuccess = () => ({
  type: DataEntityActionType.AssociateDataEntitiesSuccess,
})

export const assotiateDataEntitiesError = (error: Error) => ({
  type: DataEntityActionType.AssociateDataEntitiesError,
  payload: { error },
})

//edit dataEntity
export const editDataEntityStart = (payload: DataEntity, apiProvider: ApiProvider) => ({
  type: DataEntityActionType.EditDataEntityStart,
  payload: { apiProvider, dataEntity: payload },
})

export const editDataEntitySuccess = (payload: DataEntity) => ({
  type: DataEntityActionType.EditDataEntitySuccess,
  payload,
})

export const editDataEntityError = (error: Error) => ({
  type: DataEntityActionType.EditDataEntityError,
  payload: { error },
})

//delete dataEntity
export const deleteDataEntityStart = (payload: { dataEntityGuid: string }, apiProvider: ApiProvider) => ({
  type: DataEntityActionType.DeleteDataEntityStart,
  payload: { ...payload, apiProvider },
})

export const deleteDataEntitySuccess = () => ({
  type: DataEntityActionType.DeleteDataEntitySuccess,
})

export const deleteDataEntityError = (error: Error) => ({
  type: DataEntityActionType.DeleteDataEntityError,
  payload: { error },
})

export const updateLocalDataEntity = (payload: DataEntity) => ({
  type: DataEntityActionType.UpdateLocalDataEntity,
  payload,
})

export const clearDataEntity = () => ({
  type: DataEntityActionType.ClearDataEntity,
})
