//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Policy, ReconciliationEntityId, ReconciliationEntityType } from '@ues-data/gateway'

import type { ApiProvider } from '../../types'
import type { Task } from '../../utils'
import { createAction } from '../../utils'
import { ActionType } from './types'

export const fetchPolicyStart = (payload: { id: string; entityType: ReconciliationEntityType }, apiProvider: ApiProvider) =>
  createAction(ActionType.FetchPolicyStart, { ...payload, apiProvider })

export const fetchPolicySuccess = (payload: Task<Policy>) => createAction(ActionType.FetchPolicySuccess, payload)

export const fetchPolicyError = (error: Error) => createAction(ActionType.FetchPolicyError, { error })

export const addPolicyStart = (payload: { entityType: ReconciliationEntityType }, apiProvider: ApiProvider) =>
  createAction(ActionType.AddPolicyStart, { ...payload, apiProvider })

export const addPolicySuccess = (payload: Task<ReconciliationEntityId>) => createAction(ActionType.AddPolicySuccess, payload)

export const addPolicyError = (error: Error) => createAction(ActionType.AddPolicyError, { error })

export const updatePolicyStart = (payload: { entityType: ReconciliationEntityType }, apiProvider: ApiProvider) =>
  createAction(ActionType.UpdatePolicyStart, { ...payload, apiProvider })

export const updatePolicySuccess = () => createAction(ActionType.UpdatePolicySuccess)

export const updatePolicyError = (error: Error) => createAction(ActionType.UpdatePolicyError, { error })

export const deletePolicyStart = (payload: { id: string; entityType: ReconciliationEntityType }, apiProvider: ApiProvider) =>
  createAction(ActionType.DeletePolicyStart, { ...payload, apiProvider })

export const deletePolicySuccess = () => createAction(ActionType.DeletePolicySuccess)

export const deletePolicyError = (error: Error) => createAction(ActionType.DeletePolicyError, { error })

export const deletePoliciesStart = (payload: { ids: string[]; entityType: ReconciliationEntityType }, apiProvider: ApiProvider) =>
  createAction(ActionType.DeletePoliciesStart, { ...payload, apiProvider })

export const deletePoliciesSuccess = () => createAction(ActionType.DeletePoliciesSuccess)

export const deletePoliciesError = (error: Error) => createAction(ActionType.DeletePoliciesError, { error })

export const updateLocalPolicyData = (payload: Partial<Policy> | undefined) =>
  createAction(ActionType.UpdateLocalPolicyData, payload)

export const clearPolicy = () => createAction(ActionType.ClearPolicy)
