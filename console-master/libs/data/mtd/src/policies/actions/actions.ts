/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
export enum POLICY_ACTIONS {
  POLICY_FIND_SUCCESS = 'POLICY_FIND_SUCCESS',
  POLICY_FIND_ERROR = 'POLICY_FIND_ERROR',
  POLICY_FIND_REQUESTED = 'POLICY_FIND_REQUESTED',

  POLICY_DELETE_SUCCESS = 'POLICY_DELETE_SUCCESS',
  POLICY_DELETE_ERROR = 'POLICY_DELETE_ERROR',
  POLICY_DELETE_REQUESTED = 'POLICY_DELETE_REQUESTED',

  POLICIES_LIST_SUCCESS = 'POLICY_FIND_SUCCESS',
  POLICIES_LIST_ERROR = 'POLICY_FIND_ERROR',
  POLICIES_LIST_REQUESTED = 'POLICY_FIND_REQUESTED',

  POLICIES_DELETE_SUCCESS = 'POLICIES_DELETE_SUCCESS',
  POLICIES_DELETE_ERROR = 'POLICIES_DELETE_ERROR',
  POLICIES_DELETE_REQUESTED = 'POLICIES_DELETE_REQUESTED',

  POLICY_CREATE_SUCCESS = 'POLICY_CREATE_SUCCESS',
  POLICY_CREATE_ERROR = 'POLICY_CREATE_ERROR',
  POLICY_CREATE_REQUESTED = 'POLICY_CREATE_REQUESTED',

  POLICY_UPDATE_SUCCESS = 'POLICY_UPDATE_SUCCESS',
  POLICY_UPDATE_ERROR = 'POLICY_UPDATE_ERROR',
  POLICY_UPDATE_REQUESTED = 'POLICY_UPDATE_REQUESTED',

  POLICY_RESET_REQUESTED = 'POLICY_RESET_REQUESTED',
  POLICY_SET_REQUESTED = 'POLICY_SET_REQUESTED',
  POLICY_RESET_ERROR = 'POLICY_RESET_ERROR',
  POLICY_SET_FORM_DIRTY = 'POLICY_SET_FORM_DIRTY',
}

export interface rootState<T = unknown> {
  policy: {
    loading: boolean
    creating: boolean
    error?: Error
    redirect: boolean
    data: T
    policyToCreate: T
    isFormDirty: boolean
  }
}