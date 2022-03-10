/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { all, call, put, takeLeading } from 'redux-saga/effects'

import { BCN_SETTINGS_MAP as SETTINGS_MAP } from '../common'
import type { deleteBcnConnectionStart, getBcnConnectionsStart, getBcnSettingsStart } from './actions'
import {
  deleteBcnConnectionError,
  deleteBcnConnectionSuccess,
  getBcnConnectionsError,
  getBcnConnectionsSuccess,
  getBcnSettingsError,
  getBcnSettingsSuccess,
} from './actions'
import { ActionType } from './types'

export const deleteBcnConnectionSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof deleteBcnConnectionStart>>(
    ActionType.DeleteConnectionStart,
    function* ({ payload: { id, apiProvider } }) {
      try {
        yield call(apiProvider.deleteInstance, id)
        yield put(deleteBcnConnectionSuccess(id))
      } catch (error) {
        yield put(deleteBcnConnectionError(error as Error))
      }
    },
  )
}

export const getBcnConnectionsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof getBcnConnectionsStart>>(
    ActionType.GetConnectionsStart,
    function* ({ payload: { apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.getInstances)
        yield put(getBcnConnectionsSuccess(data))
      } catch (error) {
        yield put(getBcnConnectionsError(error as Error))
      }
    },
  )
}

export const getBcnSettingsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof getBcnSettingsStart>>(ActionType.GetSettingsStart, function* ({ payload: { apiProvider } }) {
    try {
      const { data } = yield call(apiProvider.getSettings, Object.values(SETTINGS_MAP))
      const tenantLevelSettings = {
        ...data.tenantLevelSettings,
        [SETTINGS_MAP.fileCompressionEnabled]: data.tenantLevelSettings[SETTINGS_MAP.fileCompressionEnabled] === 'true',
        [SETTINGS_MAP.loggingFileEnabled]: data.tenantLevelSettings[SETTINGS_MAP.loggingFileEnabled] === 'true',
        [SETTINGS_MAP.sysLogEnabled]: data.tenantLevelSettings[SETTINGS_MAP.sysLogEnabled] === 'true',
      }
      yield put(getBcnSettingsSuccess(tenantLevelSettings))
    } catch (error) {
      yield put(getBcnSettingsError(error as Error))
    }
  })
}

export const rootSaga = function* (): Generator {
  yield all([call(getBcnConnectionsSaga), call(deleteBcnConnectionSaga), call(getBcnSettingsSaga)])
}
