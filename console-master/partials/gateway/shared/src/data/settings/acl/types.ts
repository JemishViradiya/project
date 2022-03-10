//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { AclRule, AclRulesProfile, PageableRequestParams } from '@ues-data/gateway'
import type { PagableResponse, UesReduxSlices } from '@ues-data/shared'

import type { Task } from '../../../utils'
import type * as actions from './actions'

export enum TaskId {
  FetchDraftAclRules = 'fetchDraftAclRules',
  FetchCommittedAclRules = 'fetchCommittedAclRules',
  FetchDraftAclRulesProfile = 'fetchDraftAclRulesProfile',
  FetchCommittedAclRulesProfile = 'fetchCommittedAclRulesProfile',
  FetchAclRule = 'fetchAclRule',
  AddAclRule = 'addAclRule',
  UpdateAclRule = 'updateAclRule',
  DeleteAclRule = 'deleteAclRule',
  CommitDraft = 'commitDraft',
  DiscardDraft = 'discardDraft',
  CreateDraft = 'createDraft',
  UpdateAclRulesRank = 'updateAclRulesRank',
}

export type PageableTaskData = { response: PagableResponse<AclRule>; params: PageableRequestParams }
export type WriteRuleTaskData = { id?: string; data?: AclRule; expectedRank?: number }

export interface AclRulesState {
  tasks?: {
    [TaskId.FetchDraftAclRules]?: Task<PageableTaskData>
    [TaskId.FetchCommittedAclRules]?: Task<PageableTaskData>
    [TaskId.FetchDraftAclRulesProfile]?: Task<AclRulesProfile>
    [TaskId.FetchCommittedAclRulesProfile]?: Task<AclRulesProfile>
    [TaskId.FetchAclRule]?: Task<Partial<AclRule>>
    [TaskId.AddAclRule]?: Task<WriteRuleTaskData>
    [TaskId.UpdateAclRule]?: Task<WriteRuleTaskData>
    [TaskId.DeleteAclRule]?: Task<WriteRuleTaskData>
    [TaskId.CommitDraft]?: Task
    [TaskId.DiscardDraft]?: Task
    [TaskId.CreateDraft]?: Task
    [TaskId.CreateDraft]?: Task
    [TaskId.UpdateAclRulesRank]?: Task
  }
  ui?: {
    localAclRuleData?: Partial<AclRule>
    listRankModeEnabled?: boolean
    localAclRulesData?: AclRule[]
  }
}

export type AclRulesActions =
  | ReturnType<typeof actions.fetchCommittedAclRulesStart>
  | ReturnType<typeof actions.fetchCommittedAclRulesSuccess>
  | ReturnType<typeof actions.fetchCommittedAclRulesError>
  | ReturnType<typeof actions.fetchDraftAclRulesStart>
  | ReturnType<typeof actions.fetchDraftAclRulesSuccess>
  | ReturnType<typeof actions.fetchDraftAclRulesError>
  | ReturnType<typeof actions.fetchCommittedAclRulesProfileStart>
  | ReturnType<typeof actions.fetchCommittedAclRulesProfileSuccess>
  | ReturnType<typeof actions.fetchCommittedAclRulesProfileError>
  | ReturnType<typeof actions.fetchDraftAclRulesProfileStart>
  | ReturnType<typeof actions.fetchDraftAclRulesProfileSuccess>
  | ReturnType<typeof actions.fetchDraftAclRulesProfileError>
  | ReturnType<typeof actions.fetchAclRuleStart>
  | ReturnType<typeof actions.fetchAclRuleSuccess>
  | ReturnType<typeof actions.fetchAclRuleError>
  | ReturnType<typeof actions.addAclRuleStart>
  | ReturnType<typeof actions.addAclRuleSuccess>
  | ReturnType<typeof actions.addAclRuleError>
  | ReturnType<typeof actions.updateAclRuleStart>
  | ReturnType<typeof actions.updateAclRuleSuccess>
  | ReturnType<typeof actions.updateAclRuleError>
  | ReturnType<typeof actions.deleteAclRuleStart>
  | ReturnType<typeof actions.deleteAclRuleSuccess>
  | ReturnType<typeof actions.deleteAclRuleError>
  | ReturnType<typeof actions.commitDraftStart>
  | ReturnType<typeof actions.commitDraftSuccess>
  | ReturnType<typeof actions.commitDraftError>
  | ReturnType<typeof actions.discardDraftStart>
  | ReturnType<typeof actions.discardDraftSuccess>
  | ReturnType<typeof actions.discardDraftError>
  | ReturnType<typeof actions.createDraftStart>
  | ReturnType<typeof actions.createDraftSuccess>
  | ReturnType<typeof actions.createDraftError>
  | ReturnType<typeof actions.updateAclRulesRankStart>
  | ReturnType<typeof actions.updateAclRulesRankError>
  | ReturnType<typeof actions.updateAclRulesRankSuccess>
  | ReturnType<typeof actions.updateLocalAclRuleData>
  | ReturnType<typeof actions.toggleListRankModeEnabled>
  | ReturnType<typeof actions.bootstrapDraft>
  | ReturnType<typeof actions.clearAclRule>

export const ReduxSlice: UesReduxSlices = 'app.gateway.acl'

export enum ActionType {
  FetchCommittedAclRulesStart = `app.gateway.acl/fetch-committed-acl-rules-start`,
  FetchCommittedAclRulesError = `app.gateway.acl/fetch-committed-acl-rules-error`,
  FetchCommittedAclRulesSuccess = `app.gateway.acl/fetch-committed-acl-rules-success`,

  FetchDraftAclRulesStart = `app.gateway.acl/fetch-draft-acl-rules-start`,
  FetchDraftAclRulesError = `app.gateway.acl/fetch-draft-acl-rules-error`,
  FetchDraftAclRulesSuccess = `app.gateway.acl/fetch-draft-acl-rules-success`,

  FetchCommittedAclRulesProfileStart = `app.gateway.acl/fetch-committed-acl-rules-profile-start`,
  FetchCommittedAclRulesProfileError = `app.gateway.acl/fetch-committed-acl-rules-profile-error`,
  FetchCommittedAclRulesProfileSuccess = `app.gateway.acl/fetch-committed-acl-rules-profile-success`,

  FetchDraftAclRulesProfileStart = `app.gateway.acl/fetch-draft-acl-rules-profile-start`,
  FetchDraftAclRulesProfileError = `app.gateway.acl/fetch-draft-acl-rules-profile-error`,
  FetchDraftAclRulesProfileSuccess = `app.gateway.acl/fetch-draft-acl-rules-profile-success`,

  FetchAclRuleStart = `app.gateway.acl/fetch-acl-rule-start`,
  FetchAclRuleError = `app.gateway.acl/fetch-acl-rule-error`,
  FetchAclRuleSuccess = `app.gateway.acl/fetch-acl-rule-success`,

  AddAclRuleStart = `app.gateway.acl/add-acl-rule-start`,
  AddAclRuleError = `app.gateway.acl/add-acl-rule-error`,
  AddAclRuleSuccess = `app.gateway.acl/add-acl-rule-success`,

  UpdateAclRuleStart = `app.gateway.acl/update-acl-rule-start`,
  UpdateAclRuleError = `app.gateway.acl/update-acl-rule-error`,
  UpdateAclRuleSuccess = `app.gateway.acl/update-acl-rule-success`,

  DeleteAclRuleStart = `app.gateway.acl/delete-acl-rule-start`,
  DeleteAclRuleError = `app.gateway.acl/delete-acl-rule-error`,
  DeleteAclRuleSuccess = `app.gateway.acl/delete-acl-rule-success`,

  CommitDraftStart = `app.gateway.acl/commit-draft-start`,
  CommitDraftError = `app.gateway.acl/commit-draft-error`,
  CommitDraftSuccess = `app.gateway.acl/commit-draft-success`,

  DiscardDraftStart = `app.gateway.acl/discard-draft-start`,
  DiscardDraftError = `app.gateway.acl/discard-draft-error`,
  DiscardDraftSuccess = `app.gateway.acl/discard-draft-success`,

  BootstrapDraft = `app.gateway.acl/bootstrap-draft`,
  CreateDraftStart = `app.gateway.acl/create-draft-start`,
  CreateDraftError = `app.gateway.acl/create-draft-error`,
  CreateDraftSuccess = `app.gateway.acl/create-draft-success`,

  UpdateAclRulesRankStart = `app.gateway.acl/update-acl-rules-rank-start`,
  UpdateAclRulesRankError = `app.gateway.acl/update-acl-rules-rank-error`,
  UpdateAclRulesRankSuccess = `app.gateway.acl/update-acl-rules-rank-success`,

  UpdateLocalAclRuleData = `app.gateway.acl/update-local-acl-rule-data`,
  ToggleListRankMode = `app.gateway.acl/toggle-list-rank-mode`,
  ClearAclRule = `app.gateway.acl/clear-acl-rule`,
}
