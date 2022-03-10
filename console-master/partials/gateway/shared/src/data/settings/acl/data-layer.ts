// ******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { AclRule, AclRulesProfile } from '@ues-data/gateway'
import { GatewayApi, GatewayApiMock } from '@ues-data/gateway'
import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'

import { AclReadPermissions, AclUpdatePermissions } from '../permissions'
import {
  addAclRuleStart,
  bootstrapDraft,
  commitDraftStart,
  deleteAclRuleStart,
  discardDraftStart,
  fetchAclRuleStart,
  fetchCommittedAclRulesProfileStart,
  fetchCommittedAclRulesStart,
  fetchDraftAclRulesProfileStart,
  fetchDraftAclRulesStart,
  updateAclRulesRankStart,
  updateAclRuleStart,
} from './actions'
import {
  getAddAclRuleTask,
  getCommitDraftTask,
  getCreateDraftTask,
  getDeleteAclRuleTask,
  getDiscardDraftTask,
  getFetchAclRuleTask,
  getFetchCommittedAclRulesProfileTask,
  getFetchCommittedAclRulesTask,
  getFetchDraftAclRulesProfileTask,
  getFetchDraftAclRulesTask,
  getUpdateAclRulesRankTask,
  getUpdateAclRuleTask,
} from './selectors'
import type { PageableTaskData } from './types'

export const queryCommittedAclRules: ReduxQuery<
  PageableTaskData,
  Parameters<typeof fetchCommittedAclRulesStart>[0],
  ReturnType<typeof getFetchCommittedAclRulesTask>
> = {
  query: payload => fetchCommittedAclRulesStart(payload, GatewayApi),
  mockQuery: payload => fetchCommittedAclRulesStart(payload, GatewayApiMock),
  selector: () => getFetchCommittedAclRulesTask,
  permissions: AclReadPermissions,
}

export const queryDraftAclRules: ReduxQuery<
  PageableTaskData,
  Parameters<typeof fetchDraftAclRulesStart>[0],
  ReturnType<typeof getFetchDraftAclRulesTask>
> = {
  query: payload => fetchDraftAclRulesStart(payload, GatewayApi),
  mockQuery: payload => fetchDraftAclRulesStart(payload, GatewayApiMock),
  selector: () => getFetchDraftAclRulesTask,
  permissions: AclReadPermissions,
}

export const queryCommittedAclRulesProfile: ReduxQuery<
  AclRulesProfile,
  Parameters<typeof fetchCommittedAclRulesProfileStart>[0],
  ReturnType<typeof getFetchCommittedAclRulesProfileTask>
> = {
  query: () => fetchCommittedAclRulesProfileStart(GatewayApi),
  mockQuery: () => fetchCommittedAclRulesProfileStart(GatewayApiMock),
  selector: () => getFetchCommittedAclRulesProfileTask,
  permissions: AclReadPermissions,
}

export const queryDraftAclRulesProfile: ReduxQuery<
  AclRulesProfile,
  Parameters<typeof fetchDraftAclRulesProfileStart>[0],
  ReturnType<typeof getFetchDraftAclRulesProfileTask>
> = {
  query: () => fetchDraftAclRulesProfileStart(GatewayApi),
  mockQuery: () => fetchDraftAclRulesProfileStart(GatewayApiMock),
  selector: () => getFetchDraftAclRulesProfileTask,
  permissions: AclReadPermissions,
}

export const queryAclRule: ReduxQuery<AclRule, Parameters<typeof fetchAclRuleStart>[0], ReturnType<typeof getFetchAclRuleTask>> = {
  query: payload => fetchAclRuleStart(payload, GatewayApi),
  mockQuery: payload => fetchAclRuleStart(payload, GatewayApiMock),
  selector: () => getFetchAclRuleTask,
  permissions: AclReadPermissions,
}

export const mutationAddAclRule: ReduxMutation<
  { id: string },
  Parameters<typeof addAclRuleStart>[0],
  ReturnType<typeof getAddAclRuleTask>
> = {
  mutation: payload => addAclRuleStart(payload, GatewayApi),
  mockMutation: payload => addAclRuleStart(payload, GatewayApiMock),
  selector: () => getAddAclRuleTask,
  permissions: AclUpdatePermissions,
}

export const mutationBootstrapDraft: ReduxMutation<
  { id: string },
  Parameters<typeof bootstrapDraft>[0],
  ReturnType<typeof getCreateDraftTask>
> = {
  mutation: () => bootstrapDraft(GatewayApi),
  mockMutation: () => bootstrapDraft(GatewayApiMock),
  selector: () => getCreateDraftTask,
  permissions: AclUpdatePermissions,
}

export const mutationUpdateAclRule: ReduxMutation<
  unknown,
  Parameters<typeof updateAclRuleStart>[0],
  ReturnType<typeof getUpdateAclRuleTask>
> = {
  mutation: payload => updateAclRuleStart(payload, GatewayApi),
  mockMutation: payload => updateAclRuleStart(payload, GatewayApiMock),
  selector: () => getUpdateAclRuleTask,
  permissions: AclUpdatePermissions,
}

export const mutationDeleteAclRule: ReduxMutation<
  unknown,
  Parameters<typeof deleteAclRuleStart>[0],
  ReturnType<typeof getDeleteAclRuleTask>
> = {
  mutation: payload => deleteAclRuleStart(payload, GatewayApi),
  mockMutation: payload => deleteAclRuleStart(payload, GatewayApiMock),
  selector: () => getDeleteAclRuleTask,
  permissions: AclUpdatePermissions,
}

export const mutationCommitDraft: ReduxMutation<
  unknown,
  Parameters<typeof commitDraftStart>[0],
  ReturnType<typeof getCommitDraftTask>
> = {
  mutation: () => commitDraftStart(GatewayApi),
  mockMutation: () => commitDraftStart(GatewayApiMock),
  selector: () => getCommitDraftTask,
  permissions: AclUpdatePermissions,
}

export const mutationDiscardDraft: ReduxMutation<
  unknown,
  Parameters<typeof discardDraftStart>[0],
  ReturnType<typeof getDiscardDraftTask>
> = {
  mutation: () => discardDraftStart(GatewayApi),
  mockMutation: () => discardDraftStart(GatewayApiMock),
  selector: () => getDiscardDraftTask,
  permissions: AclUpdatePermissions,
}

export const mutationUpdateAclRulesRank: ReduxMutation<
  unknown,
  Parameters<typeof updateAclRulesRankStart>[0],
  ReturnType<typeof getUpdateAclRulesRankTask>
> = {
  mutation: payload => updateAclRulesRankStart(payload, GatewayApi),
  mockMutation: payload => updateAclRulesRankStart(payload, GatewayApiMock),
  selector: () => getUpdateAclRulesRankTask,
  permissions: AclUpdatePermissions,
}
