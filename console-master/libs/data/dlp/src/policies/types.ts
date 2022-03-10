/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { PagableResponse } from '@ues-data/shared-types'

import type { LocalPolicyData, PoliciesApi, PoliciesMockApi, Policy, PolicyValue } from '../policy-service'

export type ApiProvider = typeof PoliciesApi | typeof PoliciesMockApi

export const PoliciesReduxSlice = 'app.dlp.policies'

export interface Task<TResult = unknown> {
  loading?: boolean
  error?: Error
  result?: TResult
}

export enum TaskId {
  Policies = 'policies',
  PoliciesByGuids = 'policiesByGuids',
  GetPolicy = 'getPolicy',
  CreatePolicy = 'createPolicy',
  EditPolicy = 'editPolicy',
  DeletePolicy = 'deletePolicy',
  GetDefaultPolicy = 'getDefaultPolicy',
  SetDefaultPolicy = 'setDefaultPolicy',
  GetPolicySettingDefinition = 'getPolicySettingDefinition',
}

export interface PoliciesState {
  tasks?: {
    policies: Task<PagableResponse<Policy>>
    policiesByGuids: Task<PagableResponse<Policy>>
    getPolicy: Task<Policy>
    createPolicy: Task<Policy>
    editPolicy: Task
    deletePolicy: Task
    getDefaultPolicy: Task<string>
    setDefaultPolicy: Task
    getPolicySettingDefinition: Task<PolicyValue>
  }
  ui?: {
    localPolicyData?: Partial<LocalPolicyData>
  }
}

export const PolicyActionType = {
  FetchPoliciesStart: `${PoliciesReduxSlice}/fetch-policies-start`,
  FetchPoliciesError: `${PoliciesReduxSlice}/fetch-policies-error`,
  FetchPoliciesSuccess: `${PoliciesReduxSlice}/fetch-policies-success`,
  ClearPolicy: `${PoliciesReduxSlice}/clear-policy`,

  FetchPoliciesByGuidsStart: `${PoliciesReduxSlice}/fetch-policies-by-guids-start`,
  FetchPoliciesByGuidsError: `${PoliciesReduxSlice}/fetch-policies-by-guids-error`,
  FetchPoliciesByGuidsSuccess: `${PoliciesReduxSlice}/fetch-policies-by-guids-success`,

  GetPolicyStart: `${PoliciesReduxSlice}/get-policy-start`,
  GetPolicyError: `${PoliciesReduxSlice}/get-policy-error`,
  GetPolicySuccess: `${PoliciesReduxSlice}/get-policy-success`,

  CreatePolicyStart: `${PoliciesReduxSlice}/create-policy-start`,
  CreatePolicyError: `${PoliciesReduxSlice}/create-policy-error`,
  CreatePolicySuccess: `${PoliciesReduxSlice}/create-policy-success`,

  EditPolicyStart: `${PoliciesReduxSlice}/edit-policy-start`,
  EditPolicyError: `${PoliciesReduxSlice}/edit-policy-error`,
  EditPolicySuccess: `${PoliciesReduxSlice}/edit-policy-success`,

  DeletePolicyStart: `${PoliciesReduxSlice}/delete-policy-start`,
  DeletePolicyError: `${PoliciesReduxSlice}/delete-policy-error`,
  DeletePolicySuccess: `${PoliciesReduxSlice}/delete-policy-success`,

  GetDefaultPolicyStart: `${PoliciesReduxSlice}/getDefault-policy-start`,
  GetDefaultPolicyError: `${PoliciesReduxSlice}/getDefault-policy-error`,
  GetDefaultPolicySuccess: `${PoliciesReduxSlice}/getDefault-policy-success`,

  SetDefaultPolicyStart: `${PoliciesReduxSlice}/setDefault-policy-start`,
  SetDefaultPolicyError: `${PoliciesReduxSlice}/setDefault-policy-error`,
  SetDefaultPolicySuccess: `${PoliciesReduxSlice}/setDefault-policy-success`,

  GetPolicySettingDefinitionStart: `${PoliciesReduxSlice}/get-policy-setting-definition-start`,
  GetPolicySettingDefinitionError: `${PoliciesReduxSlice}/get-policy-setting-definition-error`,
  GetPolicySettingDefinitionSuccess: `${PoliciesReduxSlice}/get-policy-setting-definition-success`,

  UpdateLocalPolicyData: `${PoliciesReduxSlice}/update-local-policy-data`,
}

// eslint-disable-next-line no-redeclare
export type PolicyActionType = string
