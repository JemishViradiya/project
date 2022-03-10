//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { PagableResponse, Response } from '@ues-data/shared-types'

import type { PageableSortableQueryParams } from '../types'
import type { EvidenceLockerBase } from './evidence-locker-types'

export default interface EvidenceLockerInterface {
  /**
   * Get pageable view of Evidence Locker list
   * @param params The query params
   */
  readAll(
    params?: PageableSortableQueryParams<EvidenceLockerBase>,
  ): Response<Partial<PagableResponse<EvidenceLockerBase>> | PagableResponse<EvidenceLockerBase>>
}
