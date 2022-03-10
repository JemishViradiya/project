//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import type { CsvRecordFailure, CsvResult, EntitiesPageableResponse } from '../../../types'
import type { IDeveloperCertificate } from '../../api/dev-certs/dev-certs-api-types'

export default interface DevCertsInterface {
  search(query?: string): Response<EntitiesPageableResponse<IDeveloperCertificate>>

  import(excludeType: string): Response<CsvResult<CsvRecordFailure>>

  create(data: IDeveloperCertificate): Response<IDeveloperCertificate>

  update(data: IDeveloperCertificate): Response<IDeveloperCertificate>

  get(entityId: string): Response<IDeveloperCertificate>

  remove(entityId: string): Response<void>

  removeMultiple(entityIds: string[]): Response<IDeveloperCertificate>

  parseAppFile(): Promise<Response<IDeveloperCertificate>>
}
