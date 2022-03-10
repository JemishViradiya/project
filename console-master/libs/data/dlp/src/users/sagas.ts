/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { call, put, takeLatest } from 'redux-saga/effects'

import type { fetchDevicesStart, fetchUsersStart } from './actions'
import { fetchDevicesError, fetchDevicesSuccess, fetchUsersError, fetchUsersSuccess } from './actions'
import { UsersActionType } from './types'

export const fetchUsersSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchUsersStart>>(
    UsersActionType.FetchUsersStart,
    function* ({ payload: { queryParams, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.readAll, queryParams)
        yield put(fetchUsersSuccess(data))
      } catch (error) {
        yield put(fetchUsersError(error as Error))
      }
    },
  )
}

export const fetchDevicesSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchDevicesStart>>(
    UsersActionType.FetchDevicesStart,
    function* ({ payload: { userId, apiProvider } }) {
      try {
        const devicesIds = []
        const { data } = yield call(apiProvider.readDevices, userId)
        data?.map(element => devicesIds.push(element?.deviceId))

        const { data: devicesInfoData } = yield call(apiProvider.readDevicesInfo, devicesIds)

        data?.map(element => {
          if (devicesInfoData[element?.deviceId]) {
            Object.assign(element, { devicesInfo: JSON.parse(devicesInfoData[element?.deviceId]) })
          }
          return element
        })
        yield put(fetchDevicesSuccess(data))
      } catch (error) {
        yield put(fetchDevicesError(error as Error))
      }
    },
  )
}
