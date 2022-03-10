/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { call, put, takeLatest, takeLeading } from 'redux-saga/effects'

import type { Policy } from '../policy-service'
import type {
  createPolicyStart,
  deletePolicyStart,
  editPolicyStart,
  fetchPoliciesByGuidsStart,
  fetchPoliciesStart,
  getDefaultPolicyStart,
  getPolicySettingDefinitionStart,
  getPolicyStart,
  setDefaultPolicyStart,
} from './actions'
import {
  createPolicyError,
  createPolicySuccess,
  deletePolicyError,
  deletePolicySuccess,
  editPolicyError,
  editPolicySuccess,
  fetchPoliciesByGuidsError,
  fetchPoliciesByGuidsSuccess,
  fetchPoliciesError,
  fetchPoliciesSuccess,
  getDefaultPolicyError,
  getDefaultPolicySuccess,
  getPolicyError,
  getPolicySettingDefinitionError,
  getPolicySettingDefinitionSuccess,
  getPolicySuccess,
  setDefaultPolicyError,
  setDefaultPolicySuccess,
} from './actions'
import { PolicyActionType } from './types'

export const fetchPoliciesSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchPoliciesStart>>(
    PolicyActionType.FetchPoliciesStart,
    function* ({ payload: { policyType, queryParams, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.readAll, policyType, queryParams)
        if (queryParams) {
          data.offset = queryParams.offset
        }
        yield put(fetchPoliciesSuccess(data))
      } catch (error) {
        yield put(fetchPoliciesError(error as Error))
      }
    },
  )
}

export const fetchPoliciesByGuidsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof fetchPoliciesByGuidsStart>>(
    PolicyActionType.FetchPoliciesByGuidsStart,
    function* ({ payload: { guidList, queryParams, apiProvider } }) {
      try {
        // Check for API calls with empty guidList array in order to avoid errors
        if (!guidList.length) return
        const { data } = yield call(apiProvider.readAllByGuids, guidList, queryParams)
        if (queryParams) {
          data.offset = queryParams.offset
        }
        yield put(fetchPoliciesByGuidsSuccess(data))
      } catch (error) {
        yield put(fetchPoliciesByGuidsError(error as Error))
      }
    },
  )
}

export const getPolicySaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof getPolicyStart>>(
    PolicyActionType.GetPolicyStart,
    function* ({ payload: { policyId, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.read, policyId)
        yield put(getPolicySuccess(data))
      } catch (error) {
        yield put(getPolicyError(error as Error))
      }
    },
  )
}

export const createPoliciesSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof createPolicyStart>>(
    PolicyActionType.CreatePolicyStart,
    function* ({ payload: { apiProvider, policy } }) {
      try {
        const { data } = yield call(apiProvider.create, policy)
        yield put(createPolicySuccess(data))
      } catch (error) {
        yield put(createPolicyError(error as Error))
      }
    },
  )
}

export const editPoliciesSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof editPolicyStart>>(
    PolicyActionType.EditPolicyStart,
    function* ({ payload: { apiProvider, policy } }) {
      try {
        const { data } = yield call(apiProvider.update, policy)
        yield put(editPolicySuccess(data))
      } catch (error) {
        yield put(editPolicyError(error as Error))
      }
    },
  )
}

export const deletePoliciesSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof deletePolicyStart>>(
    PolicyActionType.DeletePolicyStart,
    function* ({ payload: { policyId, apiProvider } }) {
      try {
        yield call(apiProvider.remove, policyId)
        yield put(deletePolicySuccess())
      } catch (error) {
        yield put(deletePolicyError(error as Error))
      }
    },
  )
}

export const getDefaultPolicySaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof getDefaultPolicyStart>>(
    PolicyActionType.GetDefaultPolicyStart,
    function* ({ payload: { type, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.getDefaultPolicy, type)
        yield put(getDefaultPolicySuccess(data))
      } catch (error) {
        yield put(getDefaultPolicyError(error as Error))
      }
    },
  )
}

export const setDefaultPolicySaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof setDefaultPolicyStart>>(
    PolicyActionType.SetDefaultPolicyStart,
    function* ({ payload: { apiProvider, policyId, type } }) {
      try {
        yield call(apiProvider.setDefaultPolicy, type, policyId)
        yield put(setDefaultPolicySuccess())
      } catch (error) {
        yield put(setDefaultPolicyError(error as Error))
      }
    },
  )
}

export const getPolicySettingDefinitionSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof getPolicySettingDefinitionStart>>(
    PolicyActionType.GetPolicySettingDefinitionStart,
    function* ({ payload: { type, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.getPolicySettingDefinition, type)
        yield put(getPolicySettingDefinitionSuccess(data))
      } catch (error) {
        yield put(getPolicySettingDefinitionError(error as Error))
      }
    },
  )
}
