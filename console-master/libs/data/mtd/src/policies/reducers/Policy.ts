/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Action } from 'redux'

import { POLICY_ACTIONS } from '../actions/actions'

const policyInitialValues = {
  loading: true,
  creating: false,
  error: null,
  redirect: false,
  deleting: false,
  data: {},
  policyToCreate: null,
  isFormDirty: false,
  deletePayload: null,
}

export function PolicyReducer(
  state = policyInitialValues,
  action: Action<POLICY_ACTIONS> & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any
  },
) {
  //console.log("PolicyReducer: " + action.type);
  switch (action.type) {
    case POLICY_ACTIONS.POLICY_FIND_SUCCESS:
      return { ...state, data: action.payload, loading: false, isFormDirty: false }
    case POLICY_ACTIONS.POLICY_FIND_ERROR:
      return { ...state, error: action.payload.error, loading: false }

    case POLICY_ACTIONS.POLICY_UPDATE_SUCCESS:
      action.payload.setSubmitting(false)
      return {
        ...state,
        data: action.payload.policy,
        loading: false,
        redirect: true,
        isFormDirty: false,
      }

    case POLICY_ACTIONS.POLICY_UPDATE_ERROR:
      action.payload.setSubmitting(false)
      return {
        ...state,
        data: action.payload.policy,
        error: action.payload.error,
        loading: false,
      }

    case POLICY_ACTIONS.POLICY_CREATE_SUCCESS:
      action.payload.setSubmitting(false)
      return {
        ...state,
        data: action.payload.policy,
        redirect: true,
        creating: false,
        isFormDirty: false,
      }

    case POLICY_ACTIONS.POLICY_CREATE_ERROR:
      action.payload.setSubmitting(false)
      return {
        ...state,
        error: action.payload.error,
        creating: false,
        loading: false,
      }

    case POLICY_ACTIONS.POLICY_FIND_REQUESTED:
    case POLICY_ACTIONS.POLICY_CREATE_REQUESTED:
      return {
        ...state,
        error: null,
        loading: true,
        creating: true,
        redirect: false,
        isFormDirty: false,
      }

    case POLICY_ACTIONS.POLICY_UPDATE_REQUESTED:
      return {
        ...state,
        error: null,
        loading: true,
        data: action.payload,
        creating: true,
        redirect: false,
        isFormDirty: false,
      }

    case POLICY_ACTIONS.POLICY_SET_FORM_DIRTY:
      return { ...state, isFormDirty: action.payload }

    case POLICY_ACTIONS.POLICY_RESET_ERROR:
      return {
        ...state,
        error: null,
        deletePayload: null,
      }

    case POLICY_ACTIONS.POLICY_RESET_REQUESTED:
      return {
        ...state,
        error: null,
        loading: true,
        creating: false,
        redirect: false,
        data: {},
        policyToCreate: null,
        isFormDirty: false,
        deletePayload: null,
      }
    case POLICY_ACTIONS.POLICY_DELETE_REQUESTED:
      return {
        ...state,
        error: null,
        deleting: true,
        redirect: false,
        loading: true,
      }

    case POLICY_ACTIONS.POLICIES_DELETE_REQUESTED:
      console.log('POLICY_ACTIONS.POLICIES_DELETE_REQUESTED')
      return {
        ...state,
        error: null,
        deleting: true,
        loading: true,
        deletePayload: null,
      }

    case POLICY_ACTIONS.POLICY_DELETE_SUCCESS:
      return {
        ...state,
        deleting: false,
        idToDelete: null,
        redirect: true,
        loading: false,
        isFormDirty: false,
      }

    case POLICY_ACTIONS.POLICIES_DELETE_SUCCESS:
      console.log('POLICY_ACTIONS.POLICIES_DELETE_SUCCESS: ', state)
      return {
        ...state,
        deleting: false,
        idToDelete: null,
        loading: false,
        isFormDirty: false,
        deletePayload: action.payload,
      }

    case POLICY_ACTIONS.POLICY_DELETE_ERROR:
      return {
        ...state,
        error: action.payload.error,
        deleting: false,
        idToDelete: null,
        redirect: false,
        loading: false,
      }
    case POLICY_ACTIONS.POLICIES_DELETE_ERROR:
      return {
        ...state,
        error: action.payload.error,
        deleting: false,
        idToDelete: null,
        loading: false,
        deletePayload: null,
      }

    case POLICY_ACTIONS.POLICY_SET_REQUESTED:
      return {
        ...state,
        policyToCreate: action.payload,
      }

    default:
      return state
  }
}
