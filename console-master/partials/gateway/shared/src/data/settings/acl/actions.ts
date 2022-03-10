// ******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { AclRule, AclRuleRank, AclRulesProfile } from '@ues-data/gateway'

import type { ApiProvider } from '../../../types'
import type { Task } from '../../../utils'
import { createAction } from '../../../utils'
import type { PageableTaskData, WriteRuleTaskData } from './types'
import { ActionType } from './types'

export const fetchCommittedAclRulesStart = (payload: Omit<PageableTaskData, 'response'>, apiProvider: ApiProvider) =>
  createAction(ActionType.FetchCommittedAclRulesStart, { ...payload, apiProvider })
export const fetchCommittedAclRulesSuccess = (payload: PageableTaskData) =>
  createAction(ActionType.FetchCommittedAclRulesSuccess, payload)
export const fetchCommittedAclRulesError = (error: Task['error']) => createAction(ActionType.FetchCommittedAclRulesError, { error })

export const fetchDraftAclRulesStart = (payload: Omit<PageableTaskData, 'response'>, apiProvider: ApiProvider) =>
  createAction(ActionType.FetchDraftAclRulesStart, { ...payload, apiProvider })
export const fetchDraftAclRulesSuccess = (payload: PageableTaskData) => createAction(ActionType.FetchDraftAclRulesSuccess, payload)
export const fetchDraftAclRulesError = (error: Task['error']) => createAction(ActionType.FetchDraftAclRulesError, { error })

export const fetchCommittedAclRulesProfileStart = (apiProvider: ApiProvider) =>
  createAction(ActionType.FetchCommittedAclRulesProfileStart, { apiProvider })
export const fetchCommittedAclRulesProfileSuccess = (payload: Task<AclRulesProfile>) =>
  createAction(ActionType.FetchCommittedAclRulesProfileSuccess, payload)
export const fetchCommittedAclRulesProfileError = (error: Task['error']) =>
  createAction(ActionType.FetchCommittedAclRulesProfileError, { error })

export const fetchDraftAclRulesProfileStart = (apiProvider: ApiProvider) =>
  createAction(ActionType.FetchDraftAclRulesProfileStart, { apiProvider })
export const fetchDraftAclRulesProfileSuccess = (payload: Task<AclRulesProfile>) =>
  createAction(ActionType.FetchDraftAclRulesProfileSuccess, payload)
export const fetchDraftAclRulesProfileError = (error: Task['error']) =>
  createAction(ActionType.FetchDraftAclRulesProfileError, { error })

export const fetchAclRuleStart = (payload: { id: string; isCommittedView: boolean }, apiProvider: ApiProvider) =>
  createAction(ActionType.FetchAclRuleStart, { ...payload, apiProvider })
export const fetchAclRuleSuccess = (payload: Task<Partial<AclRule> | AclRule>) =>
  createAction(ActionType.FetchAclRuleSuccess, payload)
export const fetchAclRuleError = (error: Error) => createAction(ActionType.FetchAclRuleError, { error })

export const addAclRuleStart = (payload: WriteRuleTaskData, apiProvider: ApiProvider) =>
  createAction(ActionType.AddAclRuleStart, { ...payload, apiProvider })
export const addAclRuleSuccess = (payload: WriteRuleTaskData) => createAction(ActionType.AddAclRuleSuccess, payload)
export const addAclRuleError = (error: Error) => createAction(ActionType.AddAclRuleError, { error })

export const updateAclRuleStart = (payload: WriteRuleTaskData, apiProvider: ApiProvider) =>
  createAction(ActionType.UpdateAclRuleStart, { ...payload, apiProvider })
export const updateAclRuleSuccess = (payload: WriteRuleTaskData) => createAction(ActionType.UpdateAclRuleSuccess, payload)
export const updateAclRuleError = (error: Error) => createAction(ActionType.UpdateAclRuleError, { error })

export const deleteAclRuleStart = (payload: WriteRuleTaskData, apiProvider: ApiProvider) =>
  createAction(ActionType.DeleteAclRuleStart, { ...payload, apiProvider })
export const deleteAclRuleSuccess = (payload: WriteRuleTaskData) => createAction(ActionType.DeleteAclRuleSuccess, payload)
export const deleteAclRuleError = (error: Error) => createAction(ActionType.DeleteAclRuleError, { error })

export const commitDraftStart = (apiProvider: ApiProvider) => createAction(ActionType.CommitDraftStart, { apiProvider })
export const commitDraftSuccess = () => createAction(ActionType.CommitDraftSuccess)
export const commitDraftError = (error: Error) => createAction(ActionType.CommitDraftError, { error })

export const discardDraftStart = (apiProvider: ApiProvider) => createAction(ActionType.DiscardDraftStart, { apiProvider })
export const discardDraftSuccess = () => createAction(ActionType.DiscardDraftSuccess)
export const discardDraftError = (error: Error) => createAction(ActionType.DiscardDraftError, { error })

export const updateAclRulesRankStart = (payload: { ranksUpdate: AclRuleRank[]; dataUpdate: AclRule[] }, apiProvider: ApiProvider) =>
  createAction(ActionType.UpdateAclRulesRankStart, { ...payload, apiProvider })
export const updateAclRulesRankSuccess = (payload: { data: AclRule[] }) =>
  createAction(ActionType.UpdateAclRulesRankSuccess, payload)
export const updateAclRulesRankError = (error: Error) => createAction(ActionType.UpdateAclRulesRankError, { error })

export const bootstrapDraft = (apiProvider: ApiProvider) => createAction(ActionType.BootstrapDraft, { apiProvider })

export const createDraftStart = () => createAction(ActionType.CreateDraftStart)
export const createDraftSuccess = () => createAction(ActionType.CreateDraftSuccess)
export const createDraftError = (error: Error) => createAction(ActionType.CreateDraftError, { error })

export const updateLocalAclRuleData = (payload: Partial<AclRule> | undefined) =>
  createAction(ActionType.UpdateLocalAclRuleData, payload)

export const toggleListRankModeEnabled = () => createAction(ActionType.ToggleListRankMode)

export const clearAclRule = () => createAction(ActionType.ClearAclRule)
