//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { PagableResponse, Response } from '@ues-data/shared-types'

import { axiosInstance, tenantBaseUrl } from '../config.rest'
import type { DataEntity, PageableSortableQueryParams } from '../types'
import type { AssociateDataEntities } from './data-entities-types'
import type DataEntitiesInterface from './data-entity-interface'

export const makeDataEntityEndpoint = (urlPart?: string): string => (urlPart ? `${urlPart}` : ``)

export const makeDataEntityUrl = (urlPart?: string): string => `${tenantBaseUrl}/dataEntities/${makeDataEntityEndpoint(urlPart)}`

class DataEntitiesClass implements DataEntitiesInterface {
  create(dataEntity: DataEntity): Response<DataEntity | Partial<DataEntity>> {
    return axiosInstance().post(makeDataEntityUrl(), dataEntity)
  }
  associateDataEntity(dataEntityGuids: string[]): Response<unknown> {
    const associateDataEntities: AssociateDataEntities = {
      add: dataEntityGuids,
    }
    console.log('associateDataEntity API = ', associateDataEntities)
    return axiosInstance().patch(makeDataEntityUrl(), associateDataEntities)
  }
  read(dataEntityGuid: string): Response<DataEntity | Partial<DataEntity>> {
    return axiosInstance().get(makeDataEntityUrl(dataEntityGuid))
  }
  readAll(
    params?: PageableSortableQueryParams<DataEntity>,
  ): Response<PagableResponse<DataEntity> | Partial<PagableResponse<DataEntity>>> {
    return axiosInstance().get(makeDataEntityUrl(), { params: params })
  }
  readAllByGuids(dataEntityGuids: string[]): Response<Partial<DataEntity>[] | DataEntity[]> {
    return axiosInstance().post(makeDataEntityUrl('byGuids'), dataEntityGuids)
  }
  readAssociated(): Response<PagableResponse<DataEntity> | Partial<PagableResponse<DataEntity>>> {
    return axiosInstance().get(makeDataEntityUrl('byTenant'))
  }
  update(dataEntity: Partial<DataEntity>): Response<DataEntity | Partial<DataEntity>> {
    return axiosInstance().put(makeDataEntityUrl(dataEntity.guid), dataEntity)
  }
  remove(dataEntityGuid: string): Response<unknown> {
    return axiosInstance().delete(makeDataEntityUrl(dataEntityGuid))
  }
}

const DataEntitiesApi = new DataEntitiesClass()

export { DataEntitiesApi }
