/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { call, put, takeLatest, takeLeading } from 'redux-saga/effects'

import { UesSessionApi } from '@ues-data/shared'

import type { IAppInfo } from '../../types'
import type {
  createApprovedApplicationStart,
  deleteApprovedApplicationsStart,
  editApprovedApplicationStart,
  fetchApprovedApplicationsStart,
  importApprovedApplicationsStart,
} from './actions'
import {
  createApprovedApplicationError,
  createApprovedApplicationSuccess,
  deleteApprovedApplicationsError,
  deleteApprovedApplicationsSuccess,
  editApprovedApplicationError,
  editApprovedApplicationSuccess,
  fetchApprovedApplicationsError,
  fetchApprovedApplicationsSuccess,
  importApprovedApplicationsError,
  importApprovedApplicationsSuccess,
} from './actions'
import { ActionType } from './types'

export const fetchApprovedAppsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof fetchApprovedApplicationsStart>>(
    ActionType.FetchApprovedApplicationsStart,
    function* ({ payload: { queryParams, apiProvider } }) {
      try {
        queryParams.query = { type: 'APPROVED' }
        const { data } = yield call(apiProvider.Applications.search, UesSessionApi.getTenantId(), queryParams)
        data.offset = queryParams.offset
        yield put(fetchApprovedApplicationsSuccess({ result: data }))
      } catch (error) {
        yield put(fetchApprovedApplicationsError(error as Error))
      }
    },
  )
}

export const createApprovedAppsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof createApprovedApplicationStart>>(
    ActionType.CreateApprovedApplicationStart,
    function* ({ payload: { apiProvider, application } }) {
      const data: IAppInfo = application
      data.tenantGuid = UesSessionApi.getTenantId()

      try {
        yield call(apiProvider.Applications.createApproved, data)
        yield put(createApprovedApplicationSuccess())
      } catch (error) {
        yield put(createApprovedApplicationError(error as Error))
      }
    },
  )
}

export const importApprovedAppsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof importApprovedApplicationsStart>>(
    ActionType.ImportApprovedApplicationsStart,
    function* ({ payload: { apiProvider, file } }) {
      try {
        const { data } = yield call(apiProvider.Applications.importApproved, file)
        yield put(importApprovedApplicationsSuccess({ result: data }))
      } catch (error) {
        yield put(importApprovedApplicationsError(error as Error))
      }
    },
  )
}

export const editApprovedAppsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof editApprovedApplicationStart>>(
    ActionType.EditApprovedApplicationStart,
    function* ({ payload: { apiProvider, application } }) {
      const data: IAppInfo = application
      data.tenantGuid = UesSessionApi.getTenantId()

      try {
        yield call(apiProvider.Applications.editApproved, data)
        yield put(editApprovedApplicationSuccess())
      } catch (error) {
        yield put(editApprovedApplicationError(error as Error))
      }
    },
  )
}

export const deleteApprovedAppsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof deleteApprovedApplicationsStart>>(
    ActionType.DeleteApprovedApplicationsStart,
    function* ({ payload: { entityIds, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.Applications.removeMultiple, entityIds)
        yield put(deleteApprovedApplicationsSuccess({ result: data }))
      } catch (error) {
        yield put(deleteApprovedApplicationsError(error as Error))
      }
    },
  )
}
