//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import type { ReducerHandlers } from '../../utils'
import { createReducer, taskHandlersCreator, updateTasks } from '../../utils'
import type { PoliciesActions, PoliciesState } from './types'
import { ActionType, TaskId } from './types'

export const defaultState: PoliciesState = {
  tasks: { [TaskId.Policy]: { loading: false, data: {} } },
  ui: { localPolicyData: {} },
}

const createTaskHandlers = taskHandlersCreator<PoliciesState, PoliciesActions>()

const updatePolicyTaskData = state => updateTasks(state, [[TaskId.Policy, { data: state.ui.localPolicyData }]])

const handlers: ReducerHandlers<PoliciesState, PoliciesActions> = {
  ...createTaskHandlers(TaskId.Policy, {
    start: [ActionType.FetchPolicyStart],
    error: [ActionType.FetchPolicyError],
    success: [
      ActionType.FetchPolicySuccess,
      (state, action) => ({
        ...state,
        ui: { ...state.ui, localPolicyData: { ...action.payload.data } },
      }),
    ],
  }),

  ...createTaskHandlers(TaskId.AddPolicy, {
    start: [ActionType.AddPolicyStart],
    error: [ActionType.AddPolicyError],
    success: [ActionType.AddPolicySuccess, updatePolicyTaskData],
  }),

  ...createTaskHandlers(TaskId.UpdatePolicy, {
    start: [ActionType.UpdatePolicyStart],
    error: [ActionType.UpdatePolicyError],
    success: [ActionType.UpdatePolicySuccess, updatePolicyTaskData],
  }),

  ...createTaskHandlers(TaskId.DeletePolicy, {
    start: [ActionType.DeletePolicyStart],
    error: [ActionType.DeletePolicyError],
    success: [
      ActionType.DeletePolicySuccess,
      state => ({
        ...updateTasks(state, [[TaskId.Policy, { data: {} }]]),
        ui: { ...state.ui, localPolicyData: {} },
      }),
    ],
  }),

  ...createTaskHandlers(TaskId.DeletePolicies, {
    start: [ActionType.DeletePoliciesStart],
    error: [ActionType.DeletePoliciesError],
    success: [ActionType.DeletePoliciesSuccess],
  }),

  [ActionType.UpdateLocalPolicyData]: (state, action) => ({
    ...state,
    ui: {
      ...state.ui,
      localPolicyData:
        action.payload === undefined ? { ...state.tasks.policy.data } : { ...state.ui.localPolicyData, ...action.payload },
    },
  }),

  [ActionType.ClearPolicy]: state => ({
    ...updateTasks(state, [[TaskId.Policy, { data: {} }]]),
    ui: { ...state.ui, localPolicyData: {} },
  }),
}

export default createReducer(defaultState, handlers)
