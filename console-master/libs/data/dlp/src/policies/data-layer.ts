/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'
import type { PagableResponse } from '@ues-data/shared-types'
import { Permission } from '@ues-data/shared-types'

import type { Policy, PolicyValue } from '../policy-service'
import { PoliciesApi, PoliciesMockApi } from '../policy-service'
import {
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
  getCreatePolicyTask,
  getDefaultPolicyTask,
  getDeletePolicyTask,
  getEditPolicyTask,
  getPoliciesByGuidsTask,
  getPoliciesTask,
  getPolicySettingDefinitionTask,
  getPolicyTask,
  getSetDefaultPolicyTask,
} from './selectors'
import type { PoliciesState, TaskId } from './types'
import { PoliciesReduxSlice } from './types'

const policyListPermissions = new Set([Permission.BIP_POLICY_LIST])
const policyPermissions = new Set([Permission.BIP_POLICY_READ])

export const queryPolicies: ReduxQuery<
  PagableResponse<Policy>,
  Parameters<typeof fetchPoliciesStart>[0],
  PoliciesState['tasks'][TaskId.Policies]
> = {
  query: payload => fetchPoliciesStart(payload, PoliciesApi),
  mockQuery: payload => fetchPoliciesStart(payload, PoliciesMockApi),
  selector: () => getPoliciesTask,
  dataProp: 'result',
  slice: PoliciesReduxSlice,
  permissions: policyListPermissions,
}

export const queryPoliciesByGuids: ReduxQuery<
  PagableResponse<Policy>,
  Parameters<typeof fetchPoliciesByGuidsStart>[0],
  PoliciesState['tasks'][TaskId.PoliciesByGuids]
> = {
  query: payload => fetchPoliciesByGuidsStart(payload, PoliciesApi),
  mockQuery: payload => fetchPoliciesByGuidsStart(payload, PoliciesMockApi),
  selector: () => getPoliciesByGuidsTask,
  dataProp: 'result',
  slice: PoliciesReduxSlice,
  permissions: policyListPermissions,
}

export const queryPolicy: ReduxQuery<Policy, Parameters<typeof getPolicyStart>[0], PoliciesState['tasks'][TaskId.GetPolicy]> = {
  query: payload => getPolicyStart(payload, PoliciesApi),
  mockQuery: payload => getPolicyStart(payload, PoliciesMockApi),
  selector: () => getPolicyTask,
  dataProp: 'result',
  slice: PoliciesReduxSlice,
  permissions: policyPermissions,
}

export const mutationCreatePolicy: ReduxMutation<
  Policy,
  Parameters<typeof createPolicyStart>[0],
  PoliciesState['tasks'][TaskId.CreatePolicy]
> = {
  mutation: payload => createPolicyStart(payload, PoliciesApi),
  mockMutation: payload => createPolicyStart(payload, PoliciesMockApi),
  selector: () => getCreatePolicyTask,
  dataProp: 'result',
  slice: PoliciesReduxSlice,
}

export const mutationEditPolicy: ReduxMutation<
  Policy,
  Parameters<typeof editPolicyStart>[0],
  PoliciesState['tasks'][TaskId.EditPolicy]
> = {
  mutation: payload => editPolicyStart(payload, PoliciesApi),
  mockMutation: payload => editPolicyStart(payload, PoliciesMockApi),
  selector: () => getEditPolicyTask,
  slice: PoliciesReduxSlice,
}

export const mutationDeletePolicy: ReduxMutation<
  void,
  Parameters<typeof deletePolicyStart>[0],
  PoliciesState['tasks'][TaskId.DeletePolicy]
> = {
  mutation: payload => deletePolicyStart(payload, PoliciesApi),
  mockMutation: payload => deletePolicyStart(payload, PoliciesMockApi),
  selector: () => getDeletePolicyTask,
  slice: PoliciesReduxSlice,
}

export const queryGetDefaultPolicy: ReduxQuery<
  string,
  Parameters<typeof getDefaultPolicyStart>[0],
  PoliciesState['tasks'][TaskId.GetDefaultPolicy]
> = {
  query: payload => getDefaultPolicyStart(payload, PoliciesApi),
  mockQuery: payload => getDefaultPolicyStart(payload, PoliciesMockApi),
  selector: () => getDefaultPolicyTask,
  dataProp: 'result',
  slice: PoliciesReduxSlice,
  permissions: policyPermissions,
}

export const mutationSetDefaultPolicy: ReduxMutation<
  void,
  Parameters<typeof setDefaultPolicyStart>[0],
  PoliciesState['tasks'][TaskId.SetDefaultPolicy]
> = {
  mutation: payload => setDefaultPolicyStart(payload, PoliciesApi),
  mockMutation: payload => setDefaultPolicyStart(payload, PoliciesMockApi),
  selector: () => getSetDefaultPolicyTask,
  slice: PoliciesReduxSlice,
}

export const queryPolicySettingDefinition: ReduxQuery<
  PolicyValue,
  Parameters<typeof getPolicySettingDefinitionStart>[0],
  PoliciesState['tasks'][TaskId.GetPolicySettingDefinition]
> = {
  query: payload => getPolicySettingDefinitionStart(payload, PoliciesApi),
  mockQuery: payload => getPolicySettingDefinitionStart(payload, PoliciesMockApi),
  selector: () => getPolicySettingDefinitionTask,
  dataProp: 'result',
  slice: PoliciesReduxSlice,
  permissions: policyPermissions,
}
