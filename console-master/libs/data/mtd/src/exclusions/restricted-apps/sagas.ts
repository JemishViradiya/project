/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { all, call, put, takeLatest, takeLeading } from 'redux-saga/effects'

import { UesSessionApi } from '@ues-data/shared'

import type { IAppInfo } from '../../types'
import type {
  createRestrictedApplicationStart,
  deleteRestrictedApplicationsStart,
  editRestrictedApplicationStart,
  fetchRestrictedApplicationsStart,
  importRestrictedApplicationsStart,
} from './actions'
import {
  createRestrictedApplicationError,
  createRestrictedApplicationSuccess,
  deleteRestrictedApplicationsError,
  deleteRestrictedApplicationsSuccess,
  editRestrictedApplicationError,
  editRestrictedApplicationSuccess,
  fetchRestrictedApplicationsError,
  fetchRestrictedApplicationsSuccess,
  importRestrictedApplicationsError,
  importRestrictedApplicationsSuccess,
} from './actions'
import { ActionType } from './types'

export const fetchRestrictedAppsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof fetchRestrictedApplicationsStart>>(
    ActionType.FetchRestrictedApplicationsStart,
    function* ({ payload: { queryParams, apiProvider } }) {
      try {
        queryParams.query = { type: 'RESTRICTED' }
        const { data } = yield call(apiProvider.Applications.search, UesSessionApi.getTenantId(), queryParams)
        data.offset = queryParams.offset
        yield put(fetchRestrictedApplicationsSuccess({ result: data }))
      } catch (error) {
        yield put(fetchRestrictedApplicationsError(error as Error))
      }
    },
  )
}

export const createRestrictedAppsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof createRestrictedApplicationStart>>(
    ActionType.CreateRestrictedApplicationStart,
    function* ({ payload: { apiProvider, application } }) {
      const data: IAppInfo = application
      data.tenantGuid = UesSessionApi.getTenantId()

      try {
        yield call(apiProvider.Applications.createRestricted, data)
        yield put(createRestrictedApplicationSuccess())
      } catch (error) {
        yield put(createRestrictedApplicationError(error as Error))
      }
    },
  )
}

export const importRestrictedAppsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof importRestrictedApplicationsStart>>(
    ActionType.ImportRestrictedApplicationsStart,
    function* ({ payload: { apiProvider, file } }) {
      try {
        const { data } = yield call(apiProvider.Applications.importRestricted, file)
        yield put(importRestrictedApplicationsSuccess({ result: data }))
      } catch (error) {
        yield put(importRestrictedApplicationsError(error as Error))
      }
    },
  )
}

export const editRestrictedAppsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof editRestrictedApplicationStart>>(
    ActionType.EditRestrictedApplicationStart,
    function* ({ payload: { apiProvider, application } }) {
      const data: IAppInfo = application
      data.tenantGuid = UesSessionApi.getTenantId()

      try {
        yield call(apiProvider.Applications.editRestricted, data)
        yield put(editRestrictedApplicationSuccess())
      } catch (error) {
        yield put(editRestrictedApplicationError(error as Error))
      }
    },
  )
}

export const deleteRestrictedAppsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof deleteRestrictedApplicationsStart>>(
    ActionType.DeleteRestrictedApplicationsStart,
    function* ({ payload: { entityIds, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.Applications.removeMultiple, entityIds)
        yield put(deleteRestrictedApplicationsSuccess({ result: data }))
      } catch (error) {
        yield put(deleteRestrictedApplicationsError(error as Error))
      }
    },
  )
}

export const rootSaga = function* (): Generator {
  yield all([
    call(fetchRestrictedAppsSaga),
    call(createRestrictedAppsSaga),
    call(editRestrictedAppsSaga),
    call(deleteRestrictedAppsSaga),
  ])
}
