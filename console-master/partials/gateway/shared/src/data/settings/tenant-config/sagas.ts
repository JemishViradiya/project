//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { all, call, put, takeLeading } from 'redux-saga/effects'

import { UesSessionApi } from '@ues-data/shared'

import * as actions from './actions'
import { ActionType } from './types'

export function* fetchTenantConfigSaga({ payload: { apiProvider } }: ReturnType<typeof actions.fetchTenantConfigStartAction>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    const { data } = yield call(apiProvider.Tenants.readConfig, tenantId)
    yield put(actions.fetchTenantConfigSuccessAction({ data }))
  } catch (error) {
    yield put(actions.fetchTenantConfigErrorAction(error))
  }
}

export function* fetchTenantHealthSaga({ payload: { apiProvider } }: ReturnType<typeof actions.fetchTenantHealthStartAction>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    const { data } = yield call(apiProvider.Tenants.readHealth, tenantId)
    yield put(actions.fetchTenantHealthSuccessAction({ data }))
  } catch (error) {
    yield put(actions.fetchTenantHealthErrorAction(error))
  }
}

export function* updateTenantConfigSaga({
  payload: { apiProvider, configuration },
}: ReturnType<typeof actions.updateTenantConfigStartAction>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    yield call(apiProvider.Tenants.updateConfig, tenantId, configuration)
    yield put(actions.updateTenantConfigSuccessAction({ data: configuration }))
  } catch (error) {
    yield put(actions.updateTenantConfigErrorAction(error))
  }
}

export const rootSaga = function* () {
  yield all([
    takeLeading(ActionType.FetchTenantConfigStart, fetchTenantConfigSaga),
    takeLeading(ActionType.UpdateTenantConfigStart, updateTenantConfigSaga),
    takeLeading(ActionType.FetchTenantHealthStart, fetchTenantHealthSaga),
  ])
}
