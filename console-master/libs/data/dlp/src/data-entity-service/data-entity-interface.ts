//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { PagableResponse, Response } from '@ues-data/shared-types'

import type { DataEntity, PageableSortableQueryParams } from '../types'

export default interface DataEntitiesInterface {
  /**
   * Creates a new dataEntity for this tenant
   * @param dataEntity The initial dataEntity
   */
  create(dataEntity: DataEntity): Response<Partial<DataEntity> | DataEntity>

  /**
   * Associate DataEntities to the Tenant
   * @param dataEntityGuids The dataEntity guids
   */
  associateDataEntity(dataEntityGuids: string[]): Response

  /**
   * Get the dataEntity data
   * @param dataEntityGuid The dataEntity guid
   */
  read(dataEntityGuid: string): Response<Partial<DataEntity> | DataEntity>

  /**
   * Get all dataEntities
   * @param params The query params
   */
  readAll(
    params?: PageableSortableQueryParams<DataEntity>,
  ): Response<Partial<PagableResponse<DataEntity>> | PagableResponse<DataEntity>>

  /**
   * Get all dataEntities by guids
   * @param dataEntityGuids The dataEntity guids
   */
  readAllByGuids(dataEntityGuids: string[]): Response<Partial<DataEntity>[] | DataEntity[]>

  /**
   * Get all associated dataEntities
   */
  readAssociated(): Response<Partial<PagableResponse<DataEntity>> | PagableResponse<DataEntity>>

  /**
   * Updates the dataEntity data
   * @param dataEntity The updated dataEntity data
   */
  update(dataEntity: Partial<DataEntity>): Response<Partial<DataEntity> | DataEntity>

  /**
   * Deletes the dataEntity data
   * @param dataEntityGuid The dataEntity guid
   */
  remove(dataEntityGuid: string): Response
}
