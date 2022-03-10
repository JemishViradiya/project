/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { PagableResponse } from '@ues-data/shared-types'

import type { Policy, POLICY_TYPE, PolicyValue } from '../policy-service/policies-types'
import type { PageableSortableQueryParams } from '../types'
import type { ApiProvider } from './types'
import { PolicyActionType } from './types'

//fetch policies
export const fetchPoliciesStart = (
  // policyType: POLICY_TYPE,
  payload: { policyType: POLICY_TYPE; queryParams: PageableSortableQueryParams<Policy> },
  apiProvider: ApiProvider,
) => ({
  type: PolicyActionType.FetchPoliciesStart,
  payload: { ...payload, apiProvider },
})

export const fetchPoliciesSuccess = (payload: PagableResponse<Policy>) => ({
  type: PolicyActionType.FetchPoliciesSuccess,
  payload,
})

export const fetchPoliciesError = (error: Error) => ({
  type: PolicyActionType.FetchPoliciesError,
  payload: { error },
})

//fetch policies by guids
export const fetchPoliciesByGuidsStart = (
  payload: { guidList: string[]; queryParams: PageableSortableQueryParams<Policy> },
  apiProvider: ApiProvider,
) => ({
  type: PolicyActionType.FetchPoliciesByGuidsStart,
  payload: { ...payload, apiProvider },
})

export const fetchPoliciesByGuidsSuccess = (payload: PagableResponse<Policy>) => ({
  type: PolicyActionType.FetchPoliciesByGuidsSuccess,
  payload,
})

export const fetchPoliciesByGuidsError = (error: Error) => ({
  type: PolicyActionType.FetchPoliciesByGuidsError,
  payload: { error },
})

//get policy
export const getPolicyStart = (payload: { policyId: string }, apiProvider: ApiProvider) => ({
  type: PolicyActionType.GetPolicyStart,
  payload: { ...payload, apiProvider },
})

export const getPolicySuccess = (payload: Policy) => ({
  type: PolicyActionType.GetPolicySuccess,
  payload,
})

export const getPolicyError = (error: Error) => ({
  type: PolicyActionType.GetPolicyError,
  payload: { error },
})

//create policy
export const createPolicyStart = (payload: Policy, apiProvider: ApiProvider) => ({
  type: PolicyActionType.CreatePolicyStart,
  payload: { apiProvider, policy: payload },
})

export const createPolicySuccess = (payload: Policy) => ({
  type: PolicyActionType.CreatePolicySuccess,
  payload,
})

export const createPolicyError = (error: Error) => ({
  type: PolicyActionType.CreatePolicyError,
  payload: { error },
})

//edit policy
export const editPolicyStart = (payload: Policy, apiProvider: ApiProvider) => ({
  type: PolicyActionType.EditPolicyStart,
  payload: { apiProvider, policy: payload },
})

export const editPolicySuccess = (payload: Policy) => ({
  type: PolicyActionType.EditPolicySuccess,
  payload,
})

export const editPolicyError = (error: Error) => ({
  type: PolicyActionType.EditPolicyError,
  payload: { error },
})

//delete policy
export const deletePolicyStart = (payload: { policyId: string }, apiProvider: ApiProvider) => ({
  type: PolicyActionType.DeletePolicyStart,
  payload: { ...payload, apiProvider },
})

export const deletePolicySuccess = () => ({
  type: PolicyActionType.DeletePolicySuccess,
})

export const deletePolicyError = (error: Error) => ({
  type: PolicyActionType.DeletePolicyError,
  payload: { error },
})

//get default policy
export const getDefaultPolicyStart = (payload: { type: POLICY_TYPE }, apiProvider: ApiProvider) => ({
  type: PolicyActionType.GetDefaultPolicyStart,
  payload: { ...payload, apiProvider },
})

export const getDefaultPolicySuccess = (payload: string) => ({
  type: PolicyActionType.GetDefaultPolicySuccess,
  payload,
})

export const getDefaultPolicyError = (error: Error) => ({
  type: PolicyActionType.GetDefaultPolicyError,
  payload: { error },
})

//set default policy
export const setDefaultPolicyStart = (payload: { policyId: string; type: POLICY_TYPE }, apiProvider: ApiProvider) => ({
  type: PolicyActionType.SetDefaultPolicyStart,
  payload: { ...payload, apiProvider },
})

export const setDefaultPolicySuccess = () => ({
  type: PolicyActionType.SetDefaultPolicySuccess,
})

export const setDefaultPolicyError = (error: Error) => ({
  type: PolicyActionType.SetDefaultPolicyError,
  payload: { error },
})

//get policy setting definition
export const getPolicySettingDefinitionStart = (payload: { type: POLICY_TYPE }, apiProvider: ApiProvider) => ({
  type: PolicyActionType.GetPolicySettingDefinitionStart,
  payload: { ...payload, apiProvider },
})

export const getPolicySettingDefinitionSuccess = (payload: PolicyValue) => ({
  type: PolicyActionType.GetPolicySettingDefinitionSuccess,
  payload,
})

export const getPolicySettingDefinitionError = (error: Error) => ({
  type: PolicyActionType.GetPolicySettingDefinitionError,
  payload: { error },
})

export const updateLocalPolicyData = (payload: Partial<PolicyValue & Policy>) => ({
  type: PolicyActionType.UpdateLocalPolicyData,
  payload,
})

export const clearPolicy = () => ({
  type: PolicyActionType.ClearPolicy,
})
