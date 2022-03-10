/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { PagableResponse } from '@ues-data/shared'

import type { EvidenceLockerBase } from '../evidence-locker-service'
import type { PageableSortableQueryParams } from '../types'
import type { ApiProvider } from './types'
import { EvidenceLockerActionType } from './types'

// fetch Evidence Locker list
export const fetchEvidenceLockerStart = (
  payload: { queryParams: PageableSortableQueryParams<EvidenceLockerBase> },
  apiProvider: ApiProvider,
) => ({
  type: EvidenceLockerActionType.FetchEvidenceLockerStart,
  payload: { ...payload, apiProvider },
})

export const fetchEvidenceLockerSuccess = (payload: PagableResponse<EvidenceLockerBase>) => ({
  type: EvidenceLockerActionType.FetchEvidenceLockerSuccess,
  payload,
})

export const fetchEvidenceLockerError = (error: Error) => ({
  type: EvidenceLockerActionType.FetchEvidenceLockerError,
  payload: { error },
})
