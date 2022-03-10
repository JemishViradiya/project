/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReduxQuery } from '@ues-data/shared'
import type { PagableResponse } from '@ues-data/shared-types'
import { Permission } from '@ues-data/shared-types'

import type { EvidenceLockerBase } from '../evidence-locker-service'
import { EvidenceLockerApi, EvidenceLockerMockApi } from '../evidence-locker-service'
import { fetchEvidenceLockerStart } from './actions'
import { getEvidenceLockerTask } from './selectors'
import type { EvidenceLockerState, TaskId } from './types'
import { EvidenceLockerReduxSlice } from './types'

const permissions = new Set([Permission.BIP_FILESUMMARY_READ])

export const queryEvidenceLockerList: ReduxQuery<
  PagableResponse<EvidenceLockerBase>,
  Parameters<typeof fetchEvidenceLockerStart>[0],
  EvidenceLockerState['tasks'][TaskId.GetEvidenceLocker]
> = {
  query: payload => fetchEvidenceLockerStart(payload, EvidenceLockerApi),
  mockQuery: payload => fetchEvidenceLockerStart(payload, EvidenceLockerMockApi),
  selector: () => getEvidenceLockerTask,
  dataProp: 'result',
  slice: EvidenceLockerReduxSlice,
  permissions,
}
