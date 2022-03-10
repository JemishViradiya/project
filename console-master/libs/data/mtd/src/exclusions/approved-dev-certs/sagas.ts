/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { call, put, takeLatest, takeLeading } from 'redux-saga/effects'

import { UesSessionApi } from '@ues-data/shared'

import type { IDeveloperCertificate } from '../../types'
import type {
  createApprovedDeveloperCertificateStart,
  deleteApprovedDeveloperCertificatesStart,
  editApprovedDeveloperCertificateStart,
  fetchApprovedDeveloperCertificatesStart,
  importApprovedDeveloperCertificatesStart,
} from './actions'
import {
  createApprovedDeveloperCertificateError,
  createApprovedDeveloperCertificateSuccess,
  deleteApprovedDeveloperCertificatesError,
  deleteApprovedDeveloperCertificatesSuccess,
  editApprovedDeveloperCertificateError,
  editApprovedDeveloperCertificateSuccess,
  fetchApprovedDeveloperCertificatesError,
  fetchApprovedDeveloperCertificatesSuccess,
  importApprovedDeveloperCertificatesError,
  importApprovedDeveloperCertificatesSuccess,
} from './actions'
import { ActionType } from './types'

export const fetchApprovedDevCertsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof fetchApprovedDeveloperCertificatesStart>>(
    ActionType.FetchApprovedDeveloperCertificatesStart,
    function* ({ payload: { queryParams, apiProvider } }) {
      try {
        queryParams.query = { type: 'APPROVED' }
        const { data } = yield call(apiProvider.DeveloperCertificates.search, UesSessionApi.getTenantId(), queryParams)
        data.offset = queryParams.offset
        yield put(fetchApprovedDeveloperCertificatesSuccess({ result: data }))
      } catch (error) {
        yield put(fetchApprovedDeveloperCertificatesError(error as Error))
      }
    },
  )
}

export const createApprovedDevCertsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof createApprovedDeveloperCertificateStart>>(
    ActionType.CreateApprovedDeveloperCertificateStart,
    function* ({ payload: { apiProvider, developerCertificate } }) {
      const data: IDeveloperCertificate = developerCertificate
      data.tenantGuid = UesSessionApi.getTenantId()

      try {
        yield call(apiProvider.DeveloperCertificates.createApproved, data)
        yield put(createApprovedDeveloperCertificateSuccess())
      } catch (error) {
        yield put(createApprovedDeveloperCertificateError(error as Error))
      }
    },
  )
}

export const editApprovedDevCertsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof editApprovedDeveloperCertificateStart>>(
    ActionType.EditApprovedDeveloperCertificateStart,
    function* ({ payload: { apiProvider, developerCertificate } }) {
      const data: IDeveloperCertificate = developerCertificate
      data.tenantGuid = UesSessionApi.getTenantId()

      try {
        yield call(apiProvider.DeveloperCertificates.editApproved, data)
        yield put(editApprovedDeveloperCertificateSuccess())
      } catch (error) {
        yield put(editApprovedDeveloperCertificateError(error as Error))
      }
    },
  )
}

export const deleteApprovedDevCertsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof deleteApprovedDeveloperCertificatesStart>>(
    ActionType.DeleteApprovedDeveloperCertificatesStart,
    function* ({ payload: { entityIds, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.DeveloperCertificates.removeMultiple, entityIds)
        yield put(deleteApprovedDeveloperCertificatesSuccess({ result: data }))
      } catch (error) {
        yield put(deleteApprovedDeveloperCertificatesError(error as Error))
      }
    },
  )
}

export const importApprovedDevCertsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof importApprovedDeveloperCertificatesStart>>(
    ActionType.ImportApprovedDeveloperCertificatesStart,
    function* ({ payload: { apiProvider, file } }) {
      try {
        const { data } = yield call(apiProvider.DeveloperCertificates.importApproved, file)
        yield put(importApprovedDeveloperCertificatesSuccess({ result: data }))
      } catch (error) {
        yield put(importApprovedDeveloperCertificatesError(error as Error))
      }
    },
  )
}
