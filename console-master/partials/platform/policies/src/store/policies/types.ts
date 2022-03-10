import type { ActivationProfile, PlatformApi, PlatformApiMock } from '@ues-data/platform'

export const ReduxSlice = 'app.platform.policies'

export interface Task<TResult = unknown> {
  loading?: boolean
  error?: Error
  result?: TResult
}

export interface ErrorWithResponse extends Error {
  data?: any
}

export const isTaskResolved = (currentTask?: Task, previousTask?: Task): boolean =>
  previousTask && currentTask && previousTask.loading === true && currentTask.loading === false

export interface PoliciesState {
  tasks?: {
    policy: Task<ActivationProfile>
    policyAssignedUsers: Task<Record<string, unknown>[]>
    createPolicy: Task<ActivationProfile>
    updatePolicy: Task
    deletePolicy: Task
  }
  ui?: {
    localPolicyData?: ActivationProfile
  }
}

export type ApiProvider = typeof PlatformApi | typeof PlatformApiMock

export const ActionType = {
  FetchPolicyStart: `${ReduxSlice}/fetch-policy-start`,
  FetchPolicyError: `${ReduxSlice}/fetch-policy-error`,
  FetchPolicySuccess: `${ReduxSlice}/fetch-policy-success`,
  ClearPolicy: `${ReduxSlice}/clear-policy`,

  CreatePolicyStart: `${ReduxSlice}/create-policy-start`,
  CreatePolicyError: `${ReduxSlice}/create-policy-error`,
  CreatePolicySuccess: `${ReduxSlice}/create-policy-success`,

  UpdatePolicyStart: `${ReduxSlice}/update-policy-start`,
  UpdatePolicyError: `${ReduxSlice}/update-policy-error`,
  UpdatePolicySuccess: `${ReduxSlice}/update-policy-success`,

  DeletePolicyStart: `${ReduxSlice}/delete-policy-start`,
  DeletePolicyError: `${ReduxSlice}/delete-policy-error`,
  DeletePolicySuccess: `${ReduxSlice}/delete-policy-success`,

  DeleteMultiplePoliciesStart: `${ReduxSlice}/delete-multiple-policies-start`,
  DeleteMultiplePoliciesError: `${ReduxSlice}/delete-multiple-policies-error`,
  DeleteMultiplePoliciesSuccess: `${ReduxSlice}/delete-multiple-policies-success`,

  UpdateLocalPolicyData: `${ReduxSlice}/update-local-policy-data`,
}

// eslint-disable-next-line no-redeclare
export type ActionType = string
