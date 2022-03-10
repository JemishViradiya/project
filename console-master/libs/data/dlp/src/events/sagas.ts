/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { call, put, takeLatest } from 'redux-saga/effects'

import type { fetchEventDetailsStart, fetchEventsStart } from './actions'
import { fetchEventDetailsError, fetchEventDetailsSuccess, fetchEventsError, fetchEventsSuccess } from './actions'
import { DlpEventsActionType } from './types'

export const fetchDlpEventsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchEventsStart>>(
    DlpEventsActionType.FetchEventsStart,
    function* ({ payload: { eventsListRequestBody, queryParams, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.readAll, { ...eventsListRequestBody }, queryParams)
        yield put(fetchEventsSuccess(data))
      } catch (error) {
        yield put(fetchEventsError(error as Error))
      }
    },
  )
}

export const fetchDlpEventDetailsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchEventDetailsStart>>(
    DlpEventsActionType.FetchEventDetailsStart,
    function* ({ payload: { eventUUID, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.read, eventUUID)
        yield put(fetchEventDetailsSuccess(data))
      } catch (error) {
        yield put(fetchEventDetailsError(error as Error))
      }
    },
  )
}
