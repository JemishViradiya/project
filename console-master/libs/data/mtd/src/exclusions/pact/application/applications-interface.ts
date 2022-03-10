//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import type { CsvRecordFailure, CsvResult, EntitiesPageableResponse, IAppInfo } from '../../../types'

export default interface ApplicationsInterface {
  search(query?: string): Response<EntitiesPageableResponse<IAppInfo>>

  import(excludeType: string): Response<CsvResult<CsvRecordFailure>>

  create(data: IAppInfo): Response<IAppInfo>

  update(data: IAppInfo): Response<IAppInfo>

  get(entityId: string): Response<IAppInfo>

  remove(entityId: string): Response<void>

  removeMultiple(entityIds: string[]): Response<IAppInfo>

  parseAppFile(): Promise<Response<IAppInfo>>
}
