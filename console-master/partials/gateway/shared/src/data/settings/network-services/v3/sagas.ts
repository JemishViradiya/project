//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { all, call, put, select, takeLeading } from 'redux-saga/effects'

import type { NetworkServicesV3 } from '@ues-data/gateway'
import { UesSessionApi } from '@ues-data/shared'

import * as actions from './actions'
import { getLocalNetworkServiceData } from './selectors'
import { ActionType } from './types'

export const fetchNetworkServiceSaga = function* ({
  payload: { id, apiProvider },
}: ReturnType<typeof actions.fetchNetworkServiceStart>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    const { data } = yield call(apiProvider.NetworkServicesV3.readOne, tenantId, id)
    yield put(actions.fetchNetworkServiceSuccess({ data }))
  } catch (error) {
    yield put(actions.fetchNetworkServiceError(error as Error))
  }
}

export const createNetworkServiceSaga = function* ({
  payload: { apiProvider },
}: ReturnType<typeof actions.createNetworkServiceStart>) {
  const localNetworkServiceData: NetworkServicesV3.NetworkServiceEntity = yield select(getLocalNetworkServiceData)

  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    const { data } = yield call(apiProvider.NetworkServicesV3.create, tenantId, localNetworkServiceData)
    yield put(
      actions.createNetworkServiceSuccess({
        id: data.id,
        networkServiceConfig: localNetworkServiceData,
      }),
    )
  } catch (error) {
    yield put(actions.createNetworkServiceError(error as Error))
  }
}

export const updateNetworkServiceSaga = function* ({
  payload: { apiProvider },
}: ReturnType<typeof actions.updateNetworkServiceStart>) {
  const localNetworkServiceData: NetworkServicesV3.NetworkServiceEntity = yield select(getLocalNetworkServiceData)

  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    yield call(apiProvider.NetworkServicesV3.update, tenantId, localNetworkServiceData.id, localNetworkServiceData)
    yield put(
      actions.updateNetworkServiceSuccess({
        id: localNetworkServiceData.id,
        networkServiceConfig: localNetworkServiceData,
      }),
    )
  } catch (error) {
    yield put(actions.updateNetworkServiceError(error as Error))
  }
}

export const deleteNetworkServiceSaga = function* ({
  payload: { id, apiProvider },
}: ReturnType<typeof actions.deleteNetworkServiceStart>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    yield call(apiProvider.NetworkServicesV3.remove, tenantId, id)
    yield put(actions.deleteNetworkServiceSuccess({ id }))
  } catch (error) {
    yield put(actions.deleteNetworkServiceError(error as Error))
  }
}

export const rootSaga = function* (): Generator {
  yield all([
    takeLeading(ActionType.FetchNetworkServiceStart, fetchNetworkServiceSaga),
    takeLeading(ActionType.CreateNetworkServiceStart, createNetworkServiceSaga),
    takeLeading(ActionType.UpdateNetworkServiceStart, updateNetworkServiceSaga),
    takeLeading(ActionType.DeleteNetworkServiceStart, deleteNetworkServiceSaga),
  ])
}
