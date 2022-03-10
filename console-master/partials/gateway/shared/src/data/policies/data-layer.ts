//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Policy, ReconciliationEntityId } from '@ues-data/gateway'
import { GatewayApi, GatewayApiMock } from '@ues-data/gateway'
import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'

import { addPolicyStart, deletePoliciesStart, deletePolicyStart, fetchPolicyStart, updatePolicyStart } from './actions'
import {
  POLICY_CREATE_PERMISSIONS_MAP,
  POLICY_DELETE_PERMISSIONS_MAP,
  POLICY_READ_PERMISSIONS_MAP,
  POLICY_UPDATE_PERMISSIONS_MAP,
} from './permissions'
import { getAddPolicyTask, getDeletePoliciesTask, getDeletePolicyTask, getPolicyTask, getUpdatePolicyTask } from './selectors'

export const queryPolicy: ReduxQuery<Policy, Parameters<typeof fetchPolicyStart>[0], ReturnType<typeof getPolicyTask>> = {
  query: payload => fetchPolicyStart(payload, GatewayApi),
  mockQuery: payload => fetchPolicyStart(payload, GatewayApiMock),
  permissions: payload => new Set([POLICY_READ_PERMISSIONS_MAP[payload.entityType]]),
  selector: () => getPolicyTask,
}

export const mutationAddPolicy: ReduxMutation<
  ReconciliationEntityId,
  Parameters<typeof addPolicyStart>[0],
  ReturnType<typeof getAddPolicyTask>
> = {
  mutation: payload => addPolicyStart(payload, GatewayApi),
  mockMutation: payload => addPolicyStart(payload, GatewayApiMock),
  permissions: payload => new Set([POLICY_CREATE_PERMISSIONS_MAP[payload.entityType]]),
  selector: () => getAddPolicyTask,
}

export const mutationUpdatePolicy: ReduxMutation<
  ReconciliationEntityId,
  Parameters<typeof updatePolicyStart>[0],
  ReturnType<typeof getUpdatePolicyTask>
> = {
  mutation: payload => updatePolicyStart(payload, GatewayApi),
  mockMutation: payload => updatePolicyStart(payload, GatewayApiMock),
  permissions: payload => new Set([POLICY_UPDATE_PERMISSIONS_MAP[payload.entityType]]),
  selector: () => getUpdatePolicyTask,
}

export const mutationDeletePolicy: ReduxMutation<
  unknown,
  Parameters<typeof deletePolicyStart>[0],
  ReturnType<typeof getDeletePolicyTask>
> = {
  mutation: payload => deletePolicyStart(payload, GatewayApi),
  mockMutation: payload => deletePolicyStart(payload, GatewayApiMock),
  permissions: payload => new Set([POLICY_DELETE_PERMISSIONS_MAP[payload.entityType]]),
  selector: () => getDeletePolicyTask,
}

export const mutationDeletePolicies: ReduxMutation<
  unknown,
  Parameters<typeof deletePoliciesStart>[0],
  ReturnType<typeof getDeletePoliciesTask>
> = {
  mutation: payload => deletePoliciesStart(payload, GatewayApi),
  mockMutation: payload => deletePoliciesStart(payload, GatewayApiMock),
  permissions: payload => new Set([POLICY_DELETE_PERMISSIONS_MAP[payload.entityType]]),
  selector: () => getDeletePoliciesTask,
}
