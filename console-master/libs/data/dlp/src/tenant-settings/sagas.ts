/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import { call, put, takeLatest } from 'redux-saga/effects'

import type { CONFIG_KEY } from '../tenant-settings-service/configs-types'
import type {
  fetchConfigsStart,
  fetchFileSettingsStart,
  fetchRemediationSettingsStart,
  updateConfigsStart,
  updateFileSettingsStart,
  updateRemediationSettingsStart,
} from './actions'
import {
  fetchConfigsError,
  fetchConfigsSuccess,
  fetchFileSettingsError,
  fetchFileSettingsSuccess,
  fetchRemediationSettingsError,
  fetchRemediationSettingsSuccess,
  updateConfigsError,
  updateConfigsSuccess,
  updateFileSettingsError,
  updateFileSettingsSuccess,
  updateRemediationSettingsError,
  updateRemediationSettingsSuccess,
} from './actions'
import { ConfigsActionType } from './configs-types'

export const fetchConfigsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchConfigsStart>>(
    ConfigsActionType.FetchConfigsStart,
    function* ({ payload: { apiProvider } }) {
      let fileSettingsData = {}
      let fileSettings403Error = false
      try {
        const { data } = yield call(apiProvider.readAll)
        try {
          const { data } = yield call(apiProvider.getFileSettings)
          fileSettingsData = data
        } catch (error) {
          fileSettings403Error = error.response.status === 403
          if (!fileSettings403Error) {
            yield put(fetchConfigsError(error as Error))
          }
        } finally {
          yield put(fetchConfigsSuccess(data.concat(normalizeResponse(fileSettingsData))))
        }
      } catch (error) {
        if (error && !fileSettings403Error) {
          yield put(fetchConfigsError(error as Error))
        }
      }
    },
  )
}

const normalizeResponse = data => {
  return !data?.properties
    ? data
    : Object.keys(data.properties).map(k => {
        return { key: k as CONFIG_KEY, value: data.properties[k] }
      })
}

export const updateConfigsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof updateConfigsStart>>(
    ConfigsActionType.UpdateConfigsStart,
    function* ({ payload: { data, apiProvider } }) {
      try {
        yield call(apiProvider.update, data)
        yield put(updateConfigsSuccess())
      } catch (error) {
        yield put(updateConfigsError(error as Error))
      }
    },
  )
}

export const fetchFileSettingsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchFileSettingsStart>>(
    ConfigsActionType.FetchFileSettingsStart,
    function* ({ payload: { apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.getFileSettings)
        // workaround
        const normilizedData = !data?.properties ? data : data.properties
        yield put(fetchFileSettingsSuccess(normilizedData))
      } catch (error) {
        yield put(fetchFileSettingsError(error as Error))
      }
    },
  )
}

export const updateFileSettingsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof updateFileSettingsStart>>(
    ConfigsActionType.UpdateFileSettingsStart,
    function* ({ payload: { data, apiProvider } }) {
      try {
        //TODO update data - request body. Instead of array it will be nested obj {properties: {'key': 'string value'}
        yield call(apiProvider.updateFileSetting, data)
        yield put(updateFileSettingsSuccess())
      } catch (error) {
        yield put(updateFileSettingsError(error as Error))
      }
    },
  )
}

export const fetchRemediationSettingsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchRemediationSettingsStart>>(
    ConfigsActionType.FetchRemediationSettingsStart,
    function* ({ payload: { apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.getRemediationSettings)

        yield put(fetchRemediationSettingsSuccess(data))
      } catch (error) {
        yield put(fetchRemediationSettingsError(error as Error))
      }
    },
  )
}

export const updateRemediationSettingsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof updateRemediationSettingsStart>>(
    ConfigsActionType.UpdateRemediationSettingsStart,
    function* ({ payload: { apiProvider, ...settings } }) {
      try {
        const { data } = yield call(apiProvider.updateRemediationSettings, settings)
        yield put(updateRemediationSettingsSuccess(data))
      } catch (error) {
        yield put(updateRemediationSettingsError(error as Error))
      }
    },
  )
}
