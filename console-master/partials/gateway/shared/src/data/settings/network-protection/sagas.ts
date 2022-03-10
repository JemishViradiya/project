//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { all, call, put, takeLeading } from 'redux-saga/effects'

import { UesSessionApi } from '@ues-data/shared'

import * as actions from './actions'
import { ActionType } from './types'

export function* fetchNetworkProtectionConfigSaga({
  payload: { apiProvider },
}: ReturnType<typeof actions.fetchNetworkProtectionConfigStartAction>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    const { data } = yield call(apiProvider.NetworkProtection.read, tenantId)
    yield put(actions.fetchNetworkProtectionConfigSuccessAction({ data }))
  } catch (error) {
    yield put(actions.fetchNetworkProtectionConfigErrorAction(error))
  }
}

export function* updateNetworkProtectionConfigSaga({
  payload: { apiProvider, configuration },
}: ReturnType<typeof actions.updateNetworkProtectionConfigStartAction>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    yield call(apiProvider.NetworkProtection.update, tenantId, configuration)
    yield put(actions.updateNetworkProtectionConfigSuccessAction({ data: configuration }))
  } catch (error) {
    yield put(actions.updateNetworkProtectionConfigErrorAction(error as Error))
  }
}

export const rootSaga = function* (): Generator {
  yield all([
    takeLeading(ActionType.FetchNetworkProtectionConfigStart, fetchNetworkProtectionConfigSaga),
    takeLeading(ActionType.UpdateNetworkProtectionConfigStart, updateNetworkProtectionConfigSaga),
  ])
}
