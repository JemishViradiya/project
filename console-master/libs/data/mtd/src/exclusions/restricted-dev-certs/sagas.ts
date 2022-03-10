/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { all, call, put, takeLatest, takeLeading } from 'redux-saga/effects'

import { UesSessionApi } from '@ues-data/shared'

import type { IDeveloperCertificate } from '../../types'
import type {
  createRestrictedDeveloperCertificateStart,
  deleteRestrictedDeveloperCertificatesStart,
  editRestrictedDeveloperCertificateStart,
  fetchRestrictedDeveloperCertificatesStart,
  importRestrictedDeveloperCertificatesStart,
} from './actions'
import {
  createRestrictedDeveloperCertificateError,
  createRestrictedDeveloperCertificateSuccess,
  deleteRestrictedDeveloperCertificatesError,
  deleteRestrictedDeveloperCertificatesSuccess,
  editRestrictedDeveloperCertificateError,
  editRestrictedDeveloperCertificateSuccess,
  fetchRestrictedDeveloperCertificatesError,
  fetchRestrictedDeveloperCertificatesSuccess,
  importRestrictedDeveloperCertificatesError,
  importRestrictedDeveloperCertificatesSuccess,
} from './actions'
import { ActionType } from './types'

export const fetchRestrictedDevCertsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof fetchRestrictedDeveloperCertificatesStart>>(
    ActionType.FetchRestrictedDeveloperCertificatesStart,
    function* ({ payload: { queryParams, apiProvider } }) {
      try {
        queryParams.query = { type: 'RESTRICTED' }
        const { data } = yield call(apiProvider.DeveloperCertificates.search, UesSessionApi.getTenantId(), queryParams)
        data.offset = queryParams.offset
        yield put(fetchRestrictedDeveloperCertificatesSuccess({ result: data }))
      } catch (error) {
        yield put(fetchRestrictedDeveloperCertificatesError(error as Error))
      }
    },
  )
}

export const createRestrictedDevCertsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof createRestrictedDeveloperCertificateStart>>(
    ActionType.CreateRestrictedDeveloperCertificateStart,
    function* ({ payload: { apiProvider, developerCertificate } }) {
      const data: IDeveloperCertificate = developerCertificate
      data.tenantGuid = UesSessionApi.getTenantId()

      try {
        yield call(apiProvider.DeveloperCertificates.createRestricted, data)
        yield put(createRestrictedDeveloperCertificateSuccess())
      } catch (error) {
        yield put(createRestrictedDeveloperCertificateError(error as Error))
      }
    },
  )
}

export const editRestrictedDevCertsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof editRestrictedDeveloperCertificateStart>>(
    ActionType.EditRestrictedDeveloperCertificateStart,
    function* ({ payload: { apiProvider, developerCertificate } }) {
      const data: IDeveloperCertificate = developerCertificate
      data.tenantGuid = UesSessionApi.getTenantId()

      try {
        yield call(apiProvider.DeveloperCertificates.editRestricted, data)
        yield put(editRestrictedDeveloperCertificateSuccess())
      } catch (error) {
        yield put(editRestrictedDeveloperCertificateError(error as Error))
      }
    },
  )
}

export const deleteRestrictedDevCertsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof deleteRestrictedDeveloperCertificatesStart>>(
    ActionType.DeleteRestrictedDeveloperCertificatesStart,
    function* ({ payload: { entityIds, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.DeveloperCertificates.removeMultiple, entityIds)
        yield put(deleteRestrictedDeveloperCertificatesSuccess({ result: data }))
      } catch (error) {
        yield put(deleteRestrictedDeveloperCertificatesError(error as Error))
      }
    },
  )
}

export const importRestrictedDevCertsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof importRestrictedDeveloperCertificatesStart>>(
    ActionType.ImportRestrictedDeveloperCertificatesStart,
    function* ({ payload: { apiProvider, file } }) {
      try {
        const { data } = yield call(apiProvider.DeveloperCertificates.importRestricted, file)
        yield put(importRestrictedDeveloperCertificatesSuccess({ result: data }))
      } catch (error) {
        yield put(importRestrictedDeveloperCertificatesError(error as Error))
      }
    },
  )
}

export const rootSaga = function* (): Generator {
  yield all([
    call(fetchRestrictedDevCertsSaga),
    call(createRestrictedDevCertsSaga),
    call(editRestrictedDevCertsSaga),
    call(deleteRestrictedDevCertsSaga),
  ])
}
