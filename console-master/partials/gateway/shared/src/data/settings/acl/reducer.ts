//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { mergeWith } from 'lodash-es'

import { DEFAULT_ACL_RULE_DATA } from '../../../config'
import type { ReducerHandlers } from '../../../utils'
import { createReducer, taskHandlersCreator, updateTasks } from '../../../utils'
import type { AclRulesActions, AclRulesState } from './types'
import { ActionType, TaskId } from './types'
import {
  addRecord,
  makePageableAclRulesStateAfter,
  makePageableAclRulesStateBefore,
  mergeCustomizer,
  removeRecord,
  resetLocalAclDraftState,
  updateRanks,
  updateRecord,
} from './utils'

export const defaultState: AclRulesState = {
  tasks: {
    ...Object.values(TaskId).reduce((acc, taskId) => ({ ...acc, [taskId]: { loading: false } }), {}),
    [TaskId.FetchAclRule]: { loading: false, data: DEFAULT_ACL_RULE_DATA },
  },
  ui: {
    localAclRuleData: DEFAULT_ACL_RULE_DATA,
    listRankModeEnabled: false,
    localAclRulesData: [],
  },
}

const createTaskHandlers = taskHandlersCreator<AclRulesState, AclRulesActions>()

const handlers: ReducerHandlers<AclRulesState, AclRulesActions> = {
  ...createTaskHandlers(TaskId.FetchDraftAclRules, {
    start: [ActionType.FetchDraftAclRulesStart, makePageableAclRulesStateBefore],
    error: [ActionType.FetchDraftAclRulesError],
    success: [ActionType.FetchDraftAclRulesSuccess, makePageableAclRulesStateAfter],
  }),

  ...createTaskHandlers(TaskId.FetchCommittedAclRules, {
    start: [ActionType.FetchCommittedAclRulesStart, makePageableAclRulesStateBefore],
    error: [ActionType.FetchCommittedAclRulesError],
    success: [ActionType.FetchCommittedAclRulesSuccess, makePageableAclRulesStateAfter],
  }),

  ...createTaskHandlers(TaskId.FetchDraftAclRulesProfile, {
    start: [ActionType.FetchDraftAclRulesProfileStart],
    error: [ActionType.FetchDraftAclRulesProfileError],
    success: [ActionType.FetchDraftAclRulesProfileSuccess],
  }),

  ...createTaskHandlers(TaskId.FetchCommittedAclRulesProfile, {
    start: [ActionType.FetchCommittedAclRulesProfileStart],
    error: [ActionType.FetchCommittedAclRulesProfileError],
    success: [ActionType.FetchCommittedAclRulesProfileSuccess],
  }),

  ...createTaskHandlers(TaskId.FetchAclRule, {
    start: [ActionType.FetchAclRuleStart],
    error: [ActionType.FetchAclRuleError],
    success: [
      ActionType.FetchAclRuleSuccess,
      (state, action) => ({ ...state, ui: { ...state.ui, localAclRuleData: { ...action.payload.data } } }),
    ],
  }),

  ...createTaskHandlers(TaskId.AddAclRule, {
    start: [ActionType.AddAclRuleStart],
    error: [ActionType.AddAclRuleError],
    success: [ActionType.AddAclRuleSuccess, (state, action) => addRecord(state, action.payload)],
  }),

  ...createTaskHandlers(TaskId.UpdateAclRule, {
    start: [ActionType.UpdateAclRuleStart],
    error: [ActionType.UpdateAclRuleError],
    success: [ActionType.UpdateAclRuleSuccess, (state, action) => updateRecord(state, action.payload)],
  }),

  ...createTaskHandlers(TaskId.DeleteAclRule, {
    start: [ActionType.DeleteAclRuleStart],
    error: [ActionType.DeleteAclRuleError],
    success: [ActionType.DeleteAclRuleSuccess, (state, action) => removeRecord(state, action.payload)],
  }),

  ...createTaskHandlers(TaskId.UpdateAclRulesRank, {
    start: [ActionType.UpdateAclRulesRankStart],
    error: [ActionType.UpdateAclRulesRankError],
    success: [ActionType.UpdateAclRulesRankSuccess, (state, action) => updateRanks(state, action.payload)],
  }),

  ...createTaskHandlers(TaskId.CommitDraft, {
    start: [ActionType.CommitDraftStart],
    error: [ActionType.CommitDraftError],
    success: [ActionType.CommitDraftSuccess, resetLocalAclDraftState],
  }),

  ...createTaskHandlers(TaskId.DiscardDraft, {
    start: [ActionType.DiscardDraftStart],
    error: [ActionType.DiscardDraftError],
    success: [ActionType.DiscardDraftSuccess, resetLocalAclDraftState],
  }),

  ...createTaskHandlers(TaskId.CreateDraft, {
    start: [ActionType.CreateDraftStart],
    error: [
      ActionType.CreateDraftError,
      state =>
        updateTasks(state, [
          [TaskId.AddAclRule, { loading: false }],
          [TaskId.UpdateAclRule, { loading: false }],
          [TaskId.DeleteAclRule, { loading: false }],
        ]),
    ],
    success: [
      ActionType.CreateDraftSuccess,
      state =>
        updateTasks(state, [
          [TaskId.FetchDraftAclRules, { data: [] }],
          [TaskId.FetchDraftAclRulesProfile, { data: state.tasks.fetchCommittedAclRulesProfile?.data, error: {} }],
        ]),
    ],
  }),

  [ActionType.UpdateLocalAclRuleData]: (state, action) => ({
    ...state,
    ui: {
      ...state.ui,
      localAclRuleData:
        action.payload === undefined
          ? { ...state.tasks[TaskId.FetchAclRule].data }
          : { ...mergeWith({}, DEFAULT_ACL_RULE_DATA, state.ui.localAclRuleData, action.payload, mergeCustomizer) },
    },
  }),

  [ActionType.ToggleListRankMode]: state => ({
    ...state,
    ui: { ...state.ui, listRankModeEnabled: !state.ui.listRankModeEnabled },
  }),

  [ActionType.ClearAclRule]: state => ({
    ...updateTasks(state, [[TaskId.FetchAclRule, { data: {}, error: undefined }]]),
    ui: { ...state.ui, localAclRuleData: DEFAULT_ACL_RULE_DATA },
  }),
}

export default createReducer(defaultState, handlers)
