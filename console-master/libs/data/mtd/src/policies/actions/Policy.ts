/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { call, put, takeLatest } from 'redux-saga/effects'

import { UesAxiosClient } from '@ues-data/shared'

import { POLICY_ACTIONS } from './actions'

export function* watchPolicyAsync() {
  yield takeLatest<any>(POLICY_ACTIONS.POLICY_FIND_REQUESTED, getPolicyAsync)
}

export function* watchPolicyDeleteAsync() {
  yield takeLatest<any>(POLICY_ACTIONS.POLICY_DELETE_REQUESTED, deletePolicyAsync)
}

export function* watchPoliciesDeleteAsync() {
  yield takeLatest<any>(POLICY_ACTIONS.POLICIES_DELETE_REQUESTED, deletePoliciesAsync)
}

export function* watchPolicyCreateAsync() {
  yield takeLatest<any>(POLICY_ACTIONS.POLICY_CREATE_REQUESTED, createPolicyAsync)
}

export function* watchPolicyUpdateAsync() {
  yield takeLatest<any>(POLICY_ACTIONS.POLICY_UPDATE_REQUESTED, updatePolicyAsync)
}

export function ResetPolicy() {
  return {
    type: POLICY_ACTIONS.POLICY_RESET_REQUESTED,
  }
}

export function ResetError() {
  return {
    type: POLICY_ACTIONS.POLICY_RESET_ERROR,
  }
}

export function SetPolicy(policy) {
  return {
    type: POLICY_ACTIONS.POLICY_SET_REQUESTED,
    payload: policy,
  }
}

export function SetFormDirty(isFormDirty) {
  return {
    type: POLICY_ACTIONS.POLICY_SET_FORM_DIRTY,
    payload: isFormDirty,
  }
}

export function FindPolicy(id) {
  return {
    type: POLICY_ACTIONS.POLICY_FIND_REQUESTED,
    payload: id,
  }
}

export function DeletePolicy(id) {
  return {
    type: POLICY_ACTIONS.POLICY_DELETE_REQUESTED,
    payload: id,
  }
}

export function DeletePolicies(ids) {
  return {
    type: POLICY_ACTIONS.POLICIES_DELETE_REQUESTED,
    payload: ids,
  }
}

export function UpdatePolicy(data, setSubmitting) {
  return {
    type: POLICY_ACTIONS.POLICY_UPDATE_REQUESTED,
    payload: data,
    setSubmitting,
  }
}

export function CreatePolicy(data, setSubmitting) {
  return {
    type: POLICY_ACTIONS.POLICY_CREATE_REQUESTED,
    payload: data,
    setSubmitting,
  }
}

export function* getPolicyAsync({ payload: id }) {
  try {
    const policy = yield call(PolicyApi.getPolicy, id)
    yield put(PolicySuccess(policy))
  } catch (error) {
    console.log('getPolicyAsync error: ', error)
    yield put(PolicyError(error))
  }
}

export function* deletePolicyAsync({ payload: id }) {
  try {
    yield call(PolicyApi.deletePolicy, id)
    yield put(PolicyDeleteSuccess({ id }))
  } catch (error) {
    console.log('deletePolicyAsync error: ', error)
    yield put(PolicyDeleteError(error))
  }
}

export function* deletePoliciesAsync({ payload: ids }) {
  try {
    const deletePayload = yield call(PolicyApi.deletePolicies, ids)
    yield put(PoliciesDeleteSuccess(deletePayload))
  } catch (error) {
    console.log('deletePoliciesAsync error: ', error)
    yield put(PoliciesDeleteError(error))
  }
}

export function* getPoliciesAsync() {
  try {
    const policies = yield call(PolicyApi.getPolicies)
    yield put(PoliciesSuccess(policies))
  } catch (error) {
    console.log('getPoliciesAsync error: ', error)
    yield put(PoliciesError(error))
  }
}

export function* updatePolicyAsync({ payload: data, setSubmitting }) {
  try {
    const policy = yield call(PolicyApi.updatePolicy, data)
    yield put(PolicyUpdateSuccess({ policy, setSubmitting }))
  } catch (error) {
    console.log('updatePolicyAsync error: ', error)
    yield put(PolicyUpdateError(data, error, setSubmitting))
  }
}

export function* createPolicyAsync({ payload: data, setSubmitting }) {
  try {
    const policy = yield call(PolicyApi.createPolicy, data)
    yield put(PolicyCreateSuccess({ policy, setSubmitting }))
  } catch (error) {
    console.log('createPolicyAsync error: ', { data, error, setSubmitting })
    yield put(PolicyCreateError(data, error, setSubmitting))
  }
}

export function PolicySuccess(policy) {
  return {
    type: POLICY_ACTIONS.POLICY_FIND_SUCCESS,
    payload: policy,
  }
}

export function PolicyError(error) {
  return {
    type: POLICY_ACTIONS.POLICY_FIND_ERROR,
    payload: { error },
  }
}

export function PolicyDeleteSuccess(policy) {
  return {
    type: POLICY_ACTIONS.POLICY_DELETE_SUCCESS,
    payload: policy,
  }
}

export function PoliciesSuccess(payload) {
  return {
    type: POLICY_ACTIONS.POLICIES_LIST_SUCCESS,
    payload,
  }
}

export function PoliciesError(error) {
  return {
    type: POLICY_ACTIONS.POLICIES_LIST_ERROR,
    payload: { error },
  }
}

export function PoliciesDeleteSuccess(deletePayload) {
  return {
    type: POLICY_ACTIONS.POLICIES_DELETE_SUCCESS,
    payload: deletePayload,
  }
}

export function PolicyCreateSuccess(data) {
  return {
    type: POLICY_ACTIONS.POLICY_CREATE_SUCCESS,
    payload: data,
  }
}

export function PolicyCreateError(data, error, setSubmitting) {
  return {
    type: POLICY_ACTIONS.POLICY_CREATE_ERROR,
    payload: { data, error, setSubmitting },
  }
}

export function PolicyDeleteError(error) {
  return {
    type: POLICY_ACTIONS.POLICY_DELETE_ERROR,
    payload: { error },
  }
}

export function PoliciesDeleteError(error) {
  return {
    type: POLICY_ACTIONS.POLICIES_DELETE_ERROR,
    payload: { error },
  }
}

export function PolicyUpdateSuccess({ policy, setSubmitting }) {
  return {
    type: POLICY_ACTIONS.POLICY_UPDATE_SUCCESS,
    payload: { policy, setSubmitting },
  }
}

export function PolicyUpdateError(policy, error, setSubmitting) {
  return {
    type: POLICY_ACTIONS.POLICY_UPDATE_ERROR,
    payload: { policy, error, setSubmitting },
  }
}

export const PolicyApi = {
  getPolicy: async id => {
    const policy = await UesAxiosClient().get(`/mtd/v1/policies/${id}`, {})
    return policy.data
  },
  deletePolicy: async id => {
    await UesAxiosClient().delete(`/mtd/v1/policies/${id}`, {})
  },
  deletePolicies: async ids => {
    const deletePayload = await UesAxiosClient().delete(`/mtd/v1/policies`, { data: ids })
    return deletePayload.data
  },
  getPolicies: async () => {
    const policies = await UesAxiosClient().get(`/mtd/v1/policies`, {})
    return policies.data
  },
  updatePolicy: async data => {
    const policy = await UesAxiosClient().put(`/mtd/v1/policies/${data['id']}`, data, {})
    return policy.data
  },
  createPolicy: async data => {
    const policy = await UesAxiosClient().post(`/mtd/v1/policies/`, data, {})
    return policy.data
  },
}
