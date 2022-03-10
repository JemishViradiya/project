//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty, isEqual } from 'lodash-es'
import { createSelector } from 'reselect'

import { DEFAULT_ACL_RULE, DEFAULT_ACL_RULES_COUNT } from '../../../config'
import { isDestinationsValid } from '../../../utils'
import type { AclRulesState } from './types'
import { ReduxSlice, TaskId } from './types'
import { checkIsDescSortDir } from './utils'

export const getAclState = (state): AclRulesState => state[ReduxSlice]

export const getAclTasks = createSelector(getAclState, state => state?.tasks)

export const getFetchCommittedAclRulesTask = createSelector(getAclTasks, tasks => tasks[TaskId.FetchCommittedAclRules])

export const getFetchDraftAclRulesTask = createSelector(getAclTasks, tasks => tasks[TaskId.FetchDraftAclRules])

export const getFetchCommittedAclRulesProfileTask = createSelector(
  getAclTasks,
  tasks => tasks[TaskId.FetchCommittedAclRulesProfile],
)

export const getFetchDraftAclRulesProfileTask = createSelector(getAclTasks, tasks => tasks[TaskId.FetchDraftAclRulesProfile])

export const getHasAclRulesDraft = createSelector(
  getFetchDraftAclRulesProfileTask,
  getFetchDraftAclRulesTask,
  (fetchDraftProfileTask, fetchDraftRulesTask) =>
    isEmpty(fetchDraftProfileTask?.error) && (fetchDraftProfileTask?.data !== null || fetchDraftRulesTask?.data !== null),
)

export const getHasAclVersionsConflict = createSelector(
  getFetchDraftAclRulesProfileTask,
  getFetchCommittedAclRulesProfileTask,
  (fetchDraftProfileTask, fetchCommittedProfileTask) => {
    const draftAclVersion = fetchDraftProfileTask?.data?.version
    const committedAclVersion = fetchCommittedProfileTask?.data?.version

    return typeof draftAclVersion === 'number' && typeof committedAclVersion === 'number' && draftAclVersion !== committedAclVersion
  },
)

export const getDeleteAclRuleTask = createSelector(getAclTasks, tasks => tasks[TaskId.DeleteAclRule])

export const getFetchAclRuleTask = createSelector(getAclTasks, tasks => tasks[TaskId.FetchAclRule])

export const getInitialAclRuleConditions = createSelector(
  getFetchAclRuleTask,
  task => task?.data?.criteria?.selector?.conjunctions ?? [],
)

export const getInitialAclRuleRiskRange = createSelector(getFetchAclRuleTask, task => task?.data?.criteria?.riskRange)

export const getInitialAclRuleCategories = createSelector(
  getFetchAclRuleTask,
  task => task?.data?.criteria?.categorySet?.categories ?? [],
)

export const getAddAclRuleTask = createSelector(getAclTasks, tasks => tasks[TaskId.AddAclRule])

export const getUpdateAclRuleTask = createSelector(getAclTasks, tasks => tasks[TaskId.UpdateAclRule])

export const getCommitDraftTask = createSelector(getAclTasks, tasks => tasks[TaskId.CommitDraft])

export const getDiscardDraftTask = createSelector(getAclTasks, tasks => tasks[TaskId.DiscardDraft])

export const getCreateDraftTask = createSelector(getAclTasks, tasks => tasks[TaskId.CreateDraft])

export const getUpdateAclRulesRankTask = createSelector(getAclTasks, tasks => tasks[TaskId.UpdateAclRulesRank])

export const getLocalAclRuleData = createSelector(getAclState, state => state?.ui.localAclRuleData)

export const getListRankModeEnabled = createSelector(getAclState, state => state?.ui.listRankModeEnabled)

const getUILocalAclRulesListData = createSelector(getAclState, state => state?.ui.localAclRulesData)

export const getLocalAclRulesListData = createSelector(
  getUILocalAclRulesListData,
  getListRankModeEnabled,
  (localListData, rankModeEnabled) =>
    rankModeEnabled ? localListData.filter(item => item.id !== DEFAULT_ACL_RULE.id) : localListData,
)

export const getHasLoadedAllDraftRules = createSelector(
  getLocalAclRulesListData,
  getFetchDraftAclRulesTask,
  (localListData, fetchDraftTask) => {
    const localListDataCount = localListData.length - DEFAULT_ACL_RULES_COUNT
    return (
      localListDataCount === fetchDraftTask?.data?.response?.totals?.elements && !checkIsDescSortDir(fetchDraftTask.data.params)
    )
  },
)

export const getHasUnsavedAclRuleChanges = createSelector(
  getFetchAclRuleTask,
  getLocalAclRuleData,
  (fetchAclRuleTask, localAclRuleData) => !isEqual(fetchAclRuleTask?.data, localAclRuleData),
)

export const getIsAclRuleDefinitionValid = createSelector(getLocalAclRuleData, localAclRuleData => {
  const hasDestinationInValid =
    localAclRuleData?.criteria?.destination?.enabled && !isDestinationsValid(localAclRuleData?.criteria?.destination)
  const hasCategoriesInValid =
    localAclRuleData?.criteria?.categorySet?.enabled && isEmpty(localAclRuleData?.criteria?.categorySet?.categories)
  const hasSelectorInValid =
    localAclRuleData?.criteria?.selector?.enabled && isEmpty(localAclRuleData?.criteria?.selector?.conjunctions)

  if (hasDestinationInValid || hasCategoriesInValid || hasSelectorInValid) {
    return false
  }

  return true
})
