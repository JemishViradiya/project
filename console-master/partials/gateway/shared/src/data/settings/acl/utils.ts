//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { merge, omit } from 'lodash-es'

import type { AclRule } from '@ues-data/gateway'
import { TableSortDirection } from '@ues/behaviours'

import { DEFAULT_ACL_RULE, DEFAULT_ACL_RULE_DATA } from '../../../config'
import { isNotApplicableMatch, updateTasks } from '../../../utils'
import type { AclRulesState, PageableTaskData, WriteRuleTaskData } from './types'
import { TaskId } from './types'

export const checkIsDescSortDir = (params: PageableTaskData['params']) =>
  params?.sortBy?.toLowerCase()?.includes(TableSortDirection.Desc.toLowerCase())

export const resetLocalAclDraftState = (state: AclRulesState): AclRulesState =>
  updateTasks(state, [
    [TaskId.FetchDraftAclRules, { data: null }],
    [TaskId.FetchDraftAclRulesProfile, { data: null }],
  ])
export const mapRankToIndexInArray = (record: Partial<AclRule>) => record?.rank - 1

export const isLoadingMoreData = (payload: PageableTaskData) => payload.params?.offset > 0

export const makePageableAclRulesStateAfter = (
  state: AclRulesState,
  action: { type: any; payload: PageableTaskData },
): AclRulesState => {
  let data: AclRule[] = []

  if (isLoadingMoreData(action.payload)) {
    data = [...state.ui.localAclRulesData, ...action.payload.response.elements]
  } else {
    data = action.payload.response.elements
  }

  const isDescSortDir = checkIsDescSortDir(action.payload.params)
  const allDataLoaded = action.payload.response.totals?.elements === data?.length

  if (allDataLoaded && !isDescSortDir) {
    data = [...data, DEFAULT_ACL_RULE]
  }

  const hasDefaultRule = data?.[0]?.id === DEFAULT_ACL_RULE.id
  if (isDescSortDir && !hasDefaultRule) {
    data = [DEFAULT_ACL_RULE, ...data]
  }

  return { ...state, ui: { ...state.ui, localAclRulesData: data } }
}

export const makePageableAclRulesStateBefore = (
  state: AclRulesState,
  action: { type: any; payload: PageableTaskData },
): AclRulesState => (isLoadingMoreData(action.payload) ? state : { ...state, ui: { ...state.ui, localAclRulesData: [] } })

const updateStateAfterWriteRule = (
  state: AclRulesState,
  newData?: AclRule[],
  getNewDataCount?: (currentDataCount: number) => number,
) => {
  const fetchDraftAclRulesTask = state.tasks?.[TaskId.FetchDraftAclRules]?.data

  if (getNewDataCount && fetchDraftAclRulesTask?.response?.totals) {
    fetchDraftAclRulesTask.response.totals.elements = getNewDataCount(fetchDraftAclRulesTask.response.totals.elements)
  }

  return {
    ...updateTasks(state, [
      [TaskId.FetchAclRule, { data: {} }],
      [TaskId.FetchDraftAclRules, { data: fetchDraftAclRulesTask }],
    ]),
    ui: {
      ...state.ui,
      localAclRuleData: DEFAULT_ACL_RULE_DATA,
      localAclRulesData: newData ?? state.ui.localAclRulesData,
    },
  }
}

export const removeRecord = (state: AclRulesState, payload: WriteRuleTaskData): AclRulesState => {
  const deletedRule = payload.data
  const deletedRuleIndex = mapRankToIndexInArray(deletedRule)

  if (state.ui.localAclRulesData[deletedRuleIndex]) {
    // slice and skip removed record
    const upToDeletedRuleArrayPart = state.ui.localAclRulesData.slice(0, deletedRuleIndex)
    const afterDeletedRuleArrayPart = state.ui.localAclRulesData.slice(deletedRuleIndex + 1)

    // iterate over the rest of records starting with record after deleted record, to decrement rank
    afterDeletedRuleArrayPart.forEach((record, index) => (afterDeletedRuleArrayPart[index] = { ...record, rank: record.rank - 1 }))

    return updateStateAfterWriteRule(state, [...upToDeletedRuleArrayPart, ...afterDeletedRuleArrayPart], dataCount => dataCount - 1)
  }

  return updateStateAfterWriteRule(state, state.ui.localAclRulesData)
}

export const updateRecord = (state: AclRulesState, payload: WriteRuleTaskData): AclRulesState => {
  const updatedRule = payload.data
  const updatedRuleIndex = mapRankToIndexInArray(updatedRule)

  if (state.ui.localAclRulesData[updatedRuleIndex]) {
    const newLocalAclRulesData = [...state.ui.localAclRulesData]

    const previousRuleData = newLocalAclRulesData[updatedRuleIndex]

    newLocalAclRulesData[updatedRuleIndex] = merge({}, previousRuleData, updatedRule)

    return updateStateAfterWriteRule(state, newLocalAclRulesData)
  }

  return updateStateAfterWriteRule(state, state.ui.localAclRulesData)
}

export const addRecord = (state: AclRulesState, payload: WriteRuleTaskData): AclRulesState => {
  const newLocalAclRulesData = [...state.ui.localAclRulesData]

  const addedRule = payload.data
  const expectedRank = payload.expectedRank

  if (typeof expectedRank === 'number' && expectedRank > 0) {
    // insert record at expected rank in the array
    newLocalAclRulesData.splice(mapRankToIndexInArray({ rank: payload.expectedRank }), 0, addedRule)
  } else {
    // since infinity scrolling is supported, only push new record when all data has been loaded
    if (newLocalAclRulesData.length === state.tasks[TaskId.FetchDraftAclRules]?.data?.response?.totals?.elements) {
      newLocalAclRulesData.push(addedRule)
    }
  }

  return updateStateAfterWriteRule(state, newLocalAclRulesData, dataCount => dataCount + 1)
}

export const updateRanks = (state: AclRulesState, payload: { data: AclRule[] }): AclRulesState => {
  const newLocalAclRulesData = [...payload.data, DEFAULT_ACL_RULE]

  return {
    ...state,
    ui: { ...state.ui, listRankModeEnabled: false, localAclRulesData: newLocalAclRulesData },
  }
}

export const mergeCustomizer = (_, newValue) => {
  // supports merge for deeply nested arrays e.g. criteria.selector.conjunctions
  if (Array.isArray(newValue)) {
    return newValue
  }
}

export const sanitizePayload = (data: AclRule): AclRule => {
  const change: AclRule = { ...data }

  Object.keys(change?.criteria ?? {}).forEach(criteriaPropertyName => {
    if (isNotApplicableMatch(change.criteria[criteriaPropertyName])) {
      change.criteria[criteriaPropertyName] = {
        ...change.criteria[criteriaPropertyName],
        ...omit(DEFAULT_ACL_RULE_DATA.criteria[criteriaPropertyName], ['ignorePort']),
      }
    }
  })

  return change
}
