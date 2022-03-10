//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { all, call, put, select, takeLeading } from 'redux-saga/effects'

import { UesSessionApi } from '@ues-data/shared'

import * as actions from './actions'
import { getLocalConnectorConfig } from './selectors'
import { ActionType } from './types'

export function* fetchConnectorsSaga({ payload: { apiProvider } }: ReturnType<typeof actions.fetchConnectorsStartAction>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    const { data } = yield call(apiProvider.Connectors.read, tenantId)
    yield put(actions.fetchConnectorsSuccessAction({ data }))
  } catch (error) {
    yield put(actions.fetchConnectorsErrorAction(error))
  }
}

export function* fetchConnectorSaga({ payload: { id, apiProvider } }: ReturnType<typeof actions.fetchConnectorStartAction>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    const { data } = yield call(apiProvider.Connectors.read, tenantId, id)
    yield put(actions.fetchConnectorSuccessAction({ data }))
  } catch (error) {
    yield put(actions.fetchConnectorErrorAction(error))
  }
}

export function* deleteConnectorSaga({ payload: { apiProvider, id } }: ReturnType<typeof actions.deleteConnectorStartAction>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    yield call(apiProvider.Connectors.remove, tenantId, id)
    yield put(actions.deleteConnectorSuccessAction())
  } catch (error) {
    yield put(actions.deleteConnectorErrorAction(error))
  }
}

export function* updateConnectorSaga({ payload: { apiProvider } }: ReturnType<typeof actions.updateConnectorStartAction>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    const localConnectorConfig = yield select(getLocalConnectorConfig)
    yield call(apiProvider.Connectors.update, tenantId, localConnectorConfig?.connectorId, localConnectorConfig)
    yield put(actions.updateConnectorSuccessAction({ data: localConnectorConfig }))
  } catch (error) {
    yield put(actions.updateConnectorErrorAction(error))
  }
}

export function* createConnectorSaga({
  payload: { apiProvider, connectorConfig },
}: ReturnType<typeof actions.createConnectorStartAction>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    const { data } = yield call(apiProvider.Connectors.create, tenantId, connectorConfig)
    yield put(actions.createConnectorSuccessAction({ data }))
  } catch (error) {
    yield put(actions.createConnectorErrorAction(error))
  }
}

export const rootSaga = function* () {
  yield all([
    takeLeading(ActionType.FetchConnectorsStart, fetchConnectorsSaga),
    takeLeading(ActionType.FetchConnectorStart, fetchConnectorSaga),
    takeLeading(ActionType.DeleteConnectorStart, deleteConnectorSaga),
    takeLeading(ActionType.UpdateConnectorStart, updateConnectorSaga),
    takeLeading(ActionType.CreateConnectorStart, createConnectorSaga),
  ])
}
