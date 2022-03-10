//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { all, call, put, select, takeLeading } from 'redux-saga/effects'

import type { Policy } from '@ues-data/gateway'
import { UesSessionApi } from '@ues-data/shared'

import * as actions from './actions'
import { getLocalPolicyData } from './selectors'
import { ActionType } from './types'
import { makePolicyPayload } from './utils'

export const fetchPolicySaga = function* ({
  payload: { id, entityType, apiProvider },
}: ReturnType<typeof actions.fetchPolicyStart>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    const { data } = yield call(apiProvider.Policies.readOne, tenantId, id, entityType)
    yield put(actions.fetchPolicySuccess({ data }))
  } catch (error) {
    yield put(actions.fetchPolicyError(error as Error))
  }
}

export const addPolicySaga = function* ({ payload: { entityType, apiProvider } }: ReturnType<typeof actions.addPolicyStart>) {
  const localPolicyData: Policy = yield select(getLocalPolicyData)
  const policyPayload: Policy = yield call(makePolicyPayload, { ...localPolicyData, entityType })
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    const { data } = yield call(apiProvider.Policies.create, tenantId, policyPayload)
    yield put(actions.addPolicySuccess({ data }))
  } catch (error) {
    yield put(actions.addPolicyError(error as Error))
  }
}

export const updatePolicySaga = function* ({ payload: { apiProvider } }: ReturnType<typeof actions.updatePolicyStart>) {
  const localPolicyData: Policy = yield select(getLocalPolicyData)
  const policyPayload: Policy = yield call(makePolicyPayload, localPolicyData)
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    yield call(apiProvider.Policies.update, tenantId, localPolicyData.id, policyPayload)
    yield put(actions.updatePolicySuccess())
  } catch (error) {
    yield put(actions.updatePolicyError(error as Error))
  }
}

export const deletePolicySaga = function* ({ payload: { id, apiProvider } }: ReturnType<typeof actions.deletePolicyStart>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    yield call(apiProvider.Policies.remove, tenantId, id)
    yield put(actions.deletePolicySuccess())
  } catch (error) {
    yield put(actions.deletePolicyError(error as Error))
  }
}

export const deletePoliciesSaga = function* ({ payload: { ids, apiProvider } }: ReturnType<typeof actions.deletePoliciesStart>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    yield call(apiProvider.Policies.removeMany, tenantId, ids)
    yield put(actions.deletePoliciesSuccess())
  } catch (error) {
    yield put(actions.deletePoliciesError(error as Error))
  }
}

export const rootSaga = function* (): Generator {
  yield all([
    takeLeading(ActionType.FetchPolicyStart, fetchPolicySaga),
    takeLeading(ActionType.AddPolicyStart, addPolicySaga),
    takeLeading(ActionType.UpdatePolicyStart, updatePolicySaga),
    takeLeading(ActionType.DeletePolicyStart, deletePolicySaga),
    takeLeading(ActionType.DeletePoliciesStart, deletePoliciesSaga),
  ])
}
