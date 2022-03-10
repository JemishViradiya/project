/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

import type {
  fetchExfiltrationEventsStart,
  getEvidenceLockerInfoStart,
  getNumberActiveDevicesStart,
  getNumberActiveUsersStart,
  getSensitiveFilesOnEndpointsStart,
  getTopEventsStart,
  getTotalSensitiveFilesOnEndpointsStart,
} from './actions'
import {
  fetchExfiltrationEventsError,
  fetchExfiltrationEventsSuccess,
  getEvidenceLockerInfoError,
  getEvidenceLockerInfoSuccess,
  getNumberActiveDevicesError,
  getNumberActiveDevicesSuccess,
  getNumberActiveUsersError,
  getNumberActiveUsersSuccess,
  getSensitiveFilesOnEndpointsError,
  getSensitiveFilesOnEndpointsSuccess,
  getTopEventsError,
  getTopEventsSuccess,
  getTotalSensitiveFilesOnEndpointsError,
  getTotalSensitiveFilesOnEndpointsSuccess,
} from './actions'
import { DashboardActionType } from './types'

export const getTopEventsSaga = function* (): Generator {
  yield takeEvery<ReturnType<typeof getTopEventsStart>>(
    DashboardActionType.GetTopEventsStart,
    function* ({ payload: { reportCategory, queryParams, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.readTopEvents, reportCategory, queryParams)
        yield put(getTopEventsSuccess({ [reportCategory]: data }))
      } catch (error) {
        yield put(getTopEventsError(error as Error))
      }
    },
  )
}

export const fetchExfiltrationEventsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchExfiltrationEventsStart>>(
    DashboardActionType.FetchExfiltrationEventsStart,
    function* ({ payload: { queryParams, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.readExfiltrationTypeEvents, queryParams)
        yield put(fetchExfiltrationEventsSuccess(data))
      } catch (error) {
        yield put(fetchExfiltrationEventsError(error as Error))
      }
    },
  )
}

export const getEvidenceLockerInfoSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof getEvidenceLockerInfoStart>>(
    DashboardActionType.GetEvidenceLockerInfoStart,
    function* ({ payload: { apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.readEvidenceLockerInfo)
        yield put(getEvidenceLockerInfoSuccess(data))
      } catch (error) {
        yield put(getEvidenceLockerInfoError(error as Error))
      }
    },
  )
}

export const getTotalSensitiveFilesOnEndpointsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof getTotalSensitiveFilesOnEndpointsStart>>(
    DashboardActionType.GetTotalSensitiveFilesOnEndpointsStart,
    function* ({ payload: { apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.readTotalSensitiveFilesOnEndpoints)
        yield put(getTotalSensitiveFilesOnEndpointsSuccess(data))
      } catch (error) {
        yield put(getTotalSensitiveFilesOnEndpointsError(error as Error))
      }
    },
  )
}

export const getSensitiveFilesOnEndpointsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof getSensitiveFilesOnEndpointsStart>>(
    DashboardActionType.GetSensitiveFilesOnEndpointsStart,
    function* ({ payload: { reportCategory, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.readSensitiveFilesOnEndpoints, reportCategory)
        yield put(getSensitiveFilesOnEndpointsSuccess(data))
      } catch (error) {
        yield put(getSensitiveFilesOnEndpointsError(error as Error))
      }
    },
  )
}

export const getNumberActiveUsersSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof getNumberActiveUsersStart>>(
    DashboardActionType.GetNumberActiveUsersStart,
    function* ({ payload: { apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.readNumberActiveUsers)
        yield put(getNumberActiveUsersSuccess(data))
      } catch (error) {
        yield put(getNumberActiveUsersError(error as Error))
      }
    },
  )
}

export const getNumberActiveDevicesSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof getNumberActiveDevicesStart>>(
    DashboardActionType.GetNumberActiveDevicesStart,
    function* ({ payload: { apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.readNumberActiveDevices)
        yield put(getNumberActiveDevicesSuccess(data))
      } catch (error) {
        yield put(getNumberActiveDevicesError(error as Error))
      }
    },
  )
}
