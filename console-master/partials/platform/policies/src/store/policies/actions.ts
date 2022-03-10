/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { ActivationProfile } from '@ues-data/platform'

import type { ApiProvider, Task } from './types'
import { ActionType } from './types'

export const fetchPolicyStart = (payload: { entityId: string | undefined }, apiProvider: ApiProvider) => ({
  type: ActionType.FetchPolicyStart,
  payload: { ...payload, apiProvider },
})

export const fetchPolicySuccess = (payload: Task<ActivationProfile>) => ({
  type: ActionType.FetchPolicySuccess,
  payload,
})

export const fetchPolicyError = (error: Error) => ({
  type: ActionType.FetchPolicyError,
  payload: { error },
})

export const createPolicyStart = (payload: ActivationProfile, apiProvider: ApiProvider) => ({
  type: ActionType.CreatePolicyStart,
  payload: { apiProvider, profile: payload },
})

export const createPolicySuccess = (payload: ActivationProfile) => ({
  type: ActionType.CreatePolicySuccess,
  payload,
})

export const createPolicyError = (error: Error) => ({
  type: ActionType.CreatePolicyError,
  payload: { error },
})

export const updatePolicyStart = (payload: ActivationProfile, apiProvider: ApiProvider) => ({
  type: ActionType.UpdatePolicyStart,
  payload: { apiProvider, profile: payload },
})

export const updatePolicySuccess = () => ({
  type: ActionType.UpdatePolicySuccess,
})

export const updatePolicyError = (error: Error) => ({
  type: ActionType.UpdatePolicyError,
  payload: { error },
})

export const deletePolicyStart = (payload: { entityId: string }, apiProvider: ApiProvider) => ({
  type: ActionType.DeletePolicyStart,
  payload: { ...payload, apiProvider },
})

export const deletePolicySuccess = () => ({
  type: ActionType.DeletePolicySuccess,
})

export const deletePolicyError = (error: Error) => ({
  type: ActionType.DeletePolicyError,
  payload: { error },
})

export const deleteMultiplePoliciesStart = (payload: { entityIds: string[] }, apiProvider: ApiProvider) => ({
  type: ActionType.DeleteMultiplePoliciesStart,
  payload: { ...payload, apiProvider },
})

export const deleteMultiplePoliciesSuccess = () => ({
  type: ActionType.DeleteMultiplePoliciesSuccess,
})

export const deleteMultiplePoliciesError = (error: Error) => ({
  type: ActionType.DeleteMultiplePoliciesError,
  payload: { error },
})

export const updateLocalPolicyData = (payload: Partial<ActivationProfile> | undefined) => ({
  type: ActionType.UpdateLocalPolicyData,
  payload,
})

export const clearPolicy = () => ({ type: ActionType.ClearPolicy })
