//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import type { CsvRecordFailure, CsvResult, EntitiesPageableResponse } from '../../../types'
import type { IWebAddress } from '../../api/web-addresses/web-addresses-api-types'

export default interface WebAddressesInterface {
  search(query?: string): Response<EntitiesPageableResponse<IWebAddress>>

  import(addressType: string, excludeType: string): Response<CsvResult<CsvRecordFailure>>

  create(data: IWebAddress): Response<IWebAddress>

  update(data: IWebAddress): Response<IWebAddress>

  get(entityId: string): Response<IWebAddress>

  remove(entityId: string): Response<void>

  removeMultiple(entityIds: string[]): Response<IWebAddress>
}
