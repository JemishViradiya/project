//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Policy, ReconciliationEntityId } from '@ues-data/gateway'
import type { UesReduxSlices } from '@ues-data/shared'

import type { Task } from '../../utils'
import type * as actions from './actions'

export enum TaskId {
  Policy = 'policy',
  AddPolicy = 'addPolicy',
  UpdatePolicy = 'updatePolicy',
  DeletePolicy = 'deletePolicy',
  DeletePolicies = 'deletePolicies',
}

export interface PoliciesState {
  tasks: {
    [TaskId.Policy]?: Task<Partial<Policy>>
    [TaskId.AddPolicy]?: Task<ReconciliationEntityId>
    [TaskId.UpdatePolicy]?: Task
    [TaskId.DeletePolicy]?: Task
    [TaskId.DeletePolicies]?: Task
  }
  ui?: {
    localPolicyData?: Partial<Policy>
  }
}

export type PoliciesActions =
  | ReturnType<typeof actions.fetchPolicyStart>
  | ReturnType<typeof actions.fetchPolicySuccess>
  | ReturnType<typeof actions.fetchPolicyError>
  | ReturnType<typeof actions.addPolicyStart>
  | ReturnType<typeof actions.addPolicySuccess>
  | ReturnType<typeof actions.addPolicyError>
  | ReturnType<typeof actions.updatePolicyStart>
  | ReturnType<typeof actions.updatePolicySuccess>
  | ReturnType<typeof actions.updatePolicyError>
  | ReturnType<typeof actions.deletePolicyStart>
  | ReturnType<typeof actions.deletePolicySuccess>
  | ReturnType<typeof actions.deletePolicyError>
  | ReturnType<typeof actions.deletePoliciesStart>
  | ReturnType<typeof actions.deletePoliciesSuccess>
  | ReturnType<typeof actions.deletePoliciesError>
  | ReturnType<typeof actions.updateLocalPolicyData>
  | ReturnType<typeof actions.clearPolicy>

export const ReduxSlice: UesReduxSlices = 'app.gateway.policies'

export enum ActionType {
  FetchPolicyStart = 'app.gateway.policies/fetch-policy-start',
  FetchPolicyError = 'app.gateway.policies/fetch-policy-error',
  FetchPolicySuccess = 'app.gateway.policies/fetch-policy-success',
  ClearPolicy = 'app.gateway.policies/clear-policy',

  AddPolicyStart = 'app.gateway.policies/add-policy-start',
  AddPolicyError = 'app.gateway.policies/add-policy-error',
  AddPolicySuccess = 'app.gateway.policies/add-policy-success',

  UpdatePolicyStart = 'app.gateway.policies/update-policy-start',
  UpdatePolicyError = 'app.gateway.policies/update-policy-error',
  UpdatePolicySuccess = 'app.gateway.policies/update-policy-success',

  DeletePolicyStart = 'app.gateway.policies/delete-policy-start',
  DeletePolicyError = 'app.gateway.policies/delete-policy-error',
  DeletePolicySuccess = 'app.gateway.policies/delete-policy-success',

  DeletePoliciesStart = 'app.gateway.policies/delete-policies-start',
  DeletePoliciesError = 'app.gateway.policies/delete-policies-error',
  DeletePoliciesSuccess = 'app.gateway.policies/delete-policies-success',

  UpdateLocalPolicyData = 'app.gateway.policies/update-local-policy-data',
}
