/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import { all, call, put, takeLeading } from 'redux-saga/effects'

import type {
  addAppConfigStart,
  addConnectionsStart,
  getConnectionsStart,
  getGroupsStart,
  getUEMTenantsStart,
  removeConnectionStart,
  retryConnectionStart,
} from './actions'
import {
  addAppConfigError,
  addAppConfigSuccess,
  addConnectionsError,
  addConnectionsSuccess,
  getConnectionsError,
  getConnectionsSuccess,
  getGroupsError,
  getGroupsSuccess,
  getUEMTenantsError,
  getUEMTenantsSuccess,
  removeConnectionError,
  removeConnectionSuccess,
  retryConnectionError,
  retryConnectionSuccess,
} from './actions'
import { ActionType } from './types'

export const getConnectionsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof getConnectionsStart>>(
    ActionType.GetConnectionsStart,
    function* ({ payload: { apiProvider } }) {
      try {
        const conn = yield call(apiProvider.getConnections)
        yield put(getConnectionsSuccess(conn))
      } catch (error) {
        yield put(getConnectionsError(error as Error))
      }
    },
  )
}

export const addConnectionsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof addConnectionsStart>>(
    ActionType.AddConnectionsStart,
    function* ({ payload: { newConnections, apiProvider } }) {
      try {
        const resp = yield call(apiProvider.addConnections, newConnections)
        yield put(addConnectionsSuccess(resp))
      } catch (error) {
        yield put(addConnectionsError(error as Error))
      }
    },
  )
}

export const removeConnectionSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof removeConnectionStart>>(
    ActionType.RemoveConnectionStart,
    function* ({ payload: { type, force, apiProvider } }) {
      try {
        yield call(apiProvider.removeConnection, type, force)
        yield put(removeConnectionSuccess({ type, force }))
      } catch (error) {
        yield put(removeConnectionError(error as Error))
      }
    },
  )
}

export const getUEMTenantsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof getUEMTenantsStart>>(ActionType.GetUEMTenantsStart, function* ({ payload: { apiProvider } }) {
    try {
      const tenants = yield call(apiProvider.getUEMTenants)
      yield put(getUEMTenantsSuccess(tenants))
    } catch (error) {
      yield put(getUEMTenantsError(error as Error))
    }
  })
}

export const addAppConfigSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof addAppConfigStart>>(
    ActionType.AddAppConfigStart,
    function* ({ payload: { appConfigRequest, type, apiProvider } }) {
      try {
        const resp = yield call(apiProvider.addAppConfig, appConfigRequest, type)
        yield put(addAppConfigSuccess(resp))
      } catch (error) {
        yield put(addAppConfigError(error as Error))
      }
    },
  )
}

export const getGroupsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof getGroupsStart>>(
    ActionType.GetGroupsStart,
    function* ({ payload: { emmType, searchQuery, apiProvider } }) {
      try {
        const response = yield call(apiProvider.getGroups, emmType, searchQuery)
        yield put(getGroupsSuccess(response))
      } catch (error) {
        yield put(getGroupsError(error as Error))
      }
    },
  )
}

export const retryConnectionSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof retryConnectionStart>>(
    ActionType.RetryConnectionStart,
    function* ({ payload: { newConnection, apiProvider } }) {
      try {
        const deleteResponse = yield call(apiProvider.removeConnection, newConnection['type'], true)
        if (deleteResponse['status'] === 204) {
          yield put(removeConnectionSuccess({ type: newConnection['type'], force: true }))
          const addResponse = yield call(apiProvider.addConnections, [newConnection])
          const getConnection = yield call(apiProvider.getConnections)
          yield put(getConnectionsSuccess(getConnection))
          if (addResponse['status'] === 201) {
            yield put(retryConnectionSuccess())
          } else {
            const error = new Error()
            error.message = JSON.stringify(addResponse)
            yield put(retryConnectionError(error as Error))
          }
        }
      } catch (error) {
        yield put(retryConnectionError(error as Error))
      }
    },
  )
}

export const rootSaga = function* (): Generator {
  yield all([
    call(getConnectionsSaga),
    call(addConnectionsSaga),
    call(removeConnectionSaga),
    call(getUEMTenantsSaga),
    call(addAppConfigSaga),
    call(getGroupsSaga),
    call(retryConnectionSaga),
  ])
}
