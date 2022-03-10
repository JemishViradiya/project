/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { call, put, takeLatest } from 'redux-saga/effects'

import { EventsServiceClass, EventsServiceClassMock } from '../common-service/events'
import type { fetchEvidenceLockerStart } from './actions'
import { fetchEvidenceLockerError, fetchEvidenceLockerSuccess } from './actions'
import { EvidenceLockerActionType } from './types'

export const fetchEvidenceLockerSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchEvidenceLockerStart>>(
    EvidenceLockerActionType.FetchEvidenceLockerStart,
    function* ({ payload: { queryParams, apiProvider } }) {
      try {
        const CommonEventsService =
          apiProvider?.constructor?.name === 'EvidenceLockerMockClass' ? EventsServiceClassMock : EventsServiceClass

        const { data: evidenceLockerData } = yield call(apiProvider.readAll, queryParams)
        if (evidenceLockerData.elements.length) {
          const fileHashes = evidenceLockerData?.elements?.map(f => f?.fileHash)
          const { data: countsByEventData } = yield call(CommonEventsService.readEventCount, fileHashes)
          const evidenceLockerDataWithCount = evidenceLockerData?.elements?.map(f => {
            const count = countsByEventData?.items.fileHashes?.find(el => el?.item === f.fileHash)?.count ?? 0
            return { ...f, count }
          })
          yield put(fetchEvidenceLockerSuccess({ ...evidenceLockerData, elements: evidenceLockerDataWithCount }))
        } else {
          yield put(fetchEvidenceLockerSuccess(evidenceLockerData))
        }
      } catch (error) {
        yield put(fetchEvidenceLockerError(error as Error))
      }
    },
  )
}
