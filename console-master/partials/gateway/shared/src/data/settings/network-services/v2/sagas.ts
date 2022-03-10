//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { all, call, put, select, takeLeading } from 'redux-saga/effects'

import type { NetworkServicesV2 } from '@ues-data/gateway'
import { UesSessionApi } from '@ues-data/shared'

import * as actions from './actions'
import { getNetworkServices } from './selectors'
import { ActionType } from './types'

export const fetchNetworkServicesSaga = function* ({
  payload: { networkServiceId, apiProvider },
}: ReturnType<typeof actions.fetchNetworkServicesStart>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    const { data } = yield call(apiProvider.NetworkServicesV2.read, tenantId, networkServiceId)
    yield put(actions.fetchNetworkServicesSuccess({ data }))
  } catch (error) {
    yield put(actions.fetchNetworkServicesError(error as Error))
  }
}

export const createNetworkServiceSaga = function* ({
  payload: { networkServiceConfig, apiProvider },
}: ReturnType<typeof actions.createNetworkServiceStart>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    const { data } = yield call(apiProvider.NetworkServicesV2.create, tenantId, networkServiceConfig)
    yield put(
      actions.createNetworkServiceSuccess({
        networkServiceId: data.id,
        networkServiceConfig: networkServiceConfig,
      }),
    )
  } catch (error) {
    yield put(actions.createNetworkServiceError(error as Error))
  }
}

export const updateNetworkServiceSaga = function* ({
  payload: { networkServiceConfig, networkServiceId, apiProvider },
}: ReturnType<typeof actions.updateNetworkServiceStart>) {
  const networkServicesData: NetworkServicesV2.NetworkServiceEntity[] = yield select(getNetworkServices)
  const [networkServiceData] = networkServicesData.filter(item => item.id === networkServiceId)

  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    yield call(apiProvider.NetworkServicesV2.update, tenantId, networkServiceId, { ...networkServiceData, ...networkServiceConfig })
    yield put(
      actions.updateNetworkServiceSuccess({
        networkServiceId,
        networkServiceConfig,
      }),
    )
  } catch (error) {
    yield put(actions.updateNetworkServiceError(error as Error))
  }
}

export const deleteNetworkServiceSaga = function* ({
  payload: { networkServiceId, apiProvider },
}: ReturnType<typeof actions.deleteNetworkServiceStart>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    yield call(apiProvider.NetworkServicesV2.remove, tenantId, networkServiceId)
    yield put(actions.deleteNetworkServiceSuccess({ networkServiceId }))
  } catch (error) {
    yield put(actions.deleteNetworkServiceError(error as Error))
  }
}

export const rootSaga = function* (): Generator {
  yield all([
    takeLeading(ActionType.FetchNetworkServicesStart, fetchNetworkServicesSaga),
    takeLeading(ActionType.CreateNetworkServiceStart, createNetworkServiceSaga),
    takeLeading(ActionType.UpdateNetworkServiceStart, updateNetworkServiceSaga),
    takeLeading(ActionType.DeleteNetworkServiceStart, deleteNetworkServiceSaga),
  ])
}
