/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { PagableResponse } from '@ues-data/shared-types'

import type { EvidenceLockerApi, EvidenceLockerBase, EvidenceLockerMockApi } from '../evidence-locker-service'

export type ApiProvider = typeof EvidenceLockerApi | typeof EvidenceLockerMockApi

export const EvidenceLockerReduxSlice = 'app.dlp.evidenceLocker'

export interface Task<TResult = unknown> {
  loading?: boolean
  error?: Error
  result?: TResult
}

export enum TaskId {
  GetEvidenceLocker = 'getEvidenceLocker',
}

export interface EvidenceLockerState {
  tasks?: {
    getEvidenceLocker: Task<PagableResponse<EvidenceLockerBase>>
  }
}

export const EvidenceLockerActionType = {
  FetchEvidenceLockerStart: `${EvidenceLockerReduxSlice}/fetch-evidenceLocker-start`,
  FetchEvidenceLockerError: `${EvidenceLockerReduxSlice}/fetch-evidenceLocker-error`,
  FetchEvidenceLockerSuccess: `${EvidenceLockerReduxSlice}/fetch-evidenceLocker-success`,
}

// eslint-disable-next-line no-redeclare
export type EvidenceLockerActionType = string
