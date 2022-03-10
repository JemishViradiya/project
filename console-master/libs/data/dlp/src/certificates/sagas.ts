/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import { call, put, takeLatest, takeLeading } from 'redux-saga/effects'

import type { createCertificateStart, deleteCertificateStart, fetchCertificatesStart } from './actions'
import {
  createCertificateError,
  createCertificateSuccess,
  deleteCertificateError,
  deleteCertificateSuccess,
  fetchCertificateError,
  fetchCertificateSuccess,
} from './actions'
import { CertificateActionType } from './types'

export const fetchCertificatesSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchCertificatesStart>>(
    CertificateActionType.FetchCertificatesStart,
    function* ({ payload: { queryParams, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.readAll, queryParams)
        if (queryParams) {
          data.offset = queryParams.offset
        }
        yield put(fetchCertificateSuccess(data))
      } catch (error) {
        yield put(fetchCertificateError(error as Error))
      }
    },
  )
}

export const createCertificateSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof createCertificateStart>>(
    CertificateActionType.CreateCertificateStart,
    function* ({ payload: { apiProvider, certificate } }) {
      try {
        const { data } = yield call(apiProvider.create, certificate)
        yield put(createCertificateSuccess(data))
      } catch (error) {
        yield put(createCertificateError(error as Error))
      }
    },
  )
}

export const deleteCertificateSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof deleteCertificateStart>>(
    CertificateActionType.DeleteCertificateStart,
    function* ({ payload: { alias, apiProvider } }) {
      try {
        yield call(apiProvider.remove, alias)
        yield put(deleteCertificateSuccess())
      } catch (error) {
        yield put(deleteCertificateError(error as Error))
      }
    },
  )
}
