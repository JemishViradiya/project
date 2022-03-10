//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import * as httpStatus from 'http-status-codes'
import { isNil, omit, omitBy } from 'lodash-es'
import { all, call, put, select, takeLatest, takeLeading } from 'redux-saga/effects'

import type { AclRule } from '@ues-data/gateway'
import { UesSessionApi } from '@ues-data/shared'

import type { ApiProvider } from '../../../types'
import * as actions from './actions'
import {
  getFetchCommittedAclRulesProfileTask,
  getHasAclRulesDraft,
  getHasAclVersionsConflict,
  getLocalAclRuleData,
} from './selectors'
import type { WriteRuleTaskData } from './types'
import { ActionType } from './types'
import { sanitizePayload } from './utils'

export const mapCommittedAclRuleIdToDraftRuleIdSaga = function* (payload: WriteRuleTaskData & { apiProvider: ApiProvider }) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)

    const { data } = yield call(payload.apiProvider.Acl.readDraftRuleFromCommittedRule, tenantId, payload.id)

    return data.id
  } catch (error) {
    throw Error(error)
  }
}

export const createAclRulesDraftIfNotExistSaga = function* (
  { payload }: { type?: any; payload?: WriteRuleTaskData & { apiProvider: ApiProvider } },
  shouldMapCommittedRuleIdToDraftRule?: boolean,
) {
  const hasAclRulesDraft = yield select(getHasAclRulesDraft)

  if (!hasAclRulesDraft) {
    try {
      const tenantId = yield call(UesSessionApi.getTenantId)
      const fetchCommittedAclRulesProfileTask = yield select(getFetchCommittedAclRulesProfileTask)

      yield put(actions.createDraftStart())
      yield call(payload.apiProvider.Acl.createDraft, tenantId, fetchCommittedAclRulesProfileTask.data)
      yield put(actions.createDraftSuccess())

      if (shouldMapCommittedRuleIdToDraftRule) {
        const mappedDraftRuleId = yield call(mapCommittedAclRuleIdToDraftRuleIdSaga, payload)

        return { shouldContinue: true, mappedDraftRuleId }
      }

      return { shouldContinue: true }
    } catch (error) {
      yield put(actions.createDraftError(error as Error))

      return { shouldContinue: false }
    }
  }

  return { shouldContinue: true }
}

export const writeDraftTask = function* (
  taskFunction: any,
  action: { type: any; payload?: WriteRuleTaskData & { apiProvider: ApiProvider } },
  shouldMapCommittedRuleIdToDraftRule = true,
) {
  const { shouldContinue, mappedDraftRuleId } = yield call(
    createAclRulesDraftIfNotExistSaga,
    action,
    shouldMapCommittedRuleIdToDraftRule,
  )

  if (!shouldContinue) return

  yield call(taskFunction, { payload: { ...action.payload, id: mappedDraftRuleId ?? action.payload.id } })
}

export const fetchAclCommittedRuleSaga = function* ({
  payload: { apiProvider, id },
}: ReturnType<typeof actions.fetchAclRuleStart>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)

    const { data } = yield call(apiProvider.Acl.readCommittedRule, tenantId, id)

    yield put(actions.fetchAclRuleSuccess({ data }))
  } catch (error) {
    yield put(actions.fetchAclRuleError(error as Error))
  }
}

export const fetchAclDraftRuleSaga = function* ({ payload: { apiProvider, id } }: ReturnType<typeof actions.fetchAclRuleStart>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)

    const { data } = yield call(apiProvider.Acl.readDraftRule, tenantId, id)

    yield put(actions.fetchAclRuleSuccess({ data }))
  } catch (error) {
    yield put(actions.fetchAclRuleError(error as Error))
  }
}

export const fetchAclRuleSaga = function* (action: ReturnType<typeof actions.fetchAclRuleStart>) {
  if (action.payload?.isCommittedView) {
    yield call(fetchAclCommittedRuleSaga, action)
  } else {
    yield call(fetchAclDraftRuleSaga, action)
  }
}

export const addAclRuleTask = function* ({ payload: { apiProvider, expectedRank } }: ReturnType<typeof actions.addAclRuleStart>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    const localAclRuleData: AclRule = yield select(getLocalAclRuleData)

    const payload = sanitizePayload(omitBy<AclRule>({ ...localAclRuleData, rank: expectedRank }, isNil) as AclRule)

    const { data } = yield call(apiProvider.Acl.createDraftRule, tenantId, payload)

    yield put(actions.addAclRuleSuccess({ data: { ...payload, id: data.id }, expectedRank }))
  } catch (error) {
    yield put(actions.addAclRuleError(error as Error))
  }
}

export const addAclRuleSaga = function* (action: ReturnType<typeof actions.addAclRuleStart>) {
  yield call(writeDraftTask, addAclRuleTask, action, false)
}

export const updateAclRuleTask = function* ({ payload: { apiProvider, id, data } }: ReturnType<typeof actions.updateAclRuleStart>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    const localAclRuleData: AclRule = yield select(getLocalAclRuleData)

    const payload = sanitizePayload({ ...(data ?? localAclRuleData), id })

    yield call(apiProvider.Acl.updateDraftRule, tenantId, id, omit(payload, ['id']))

    yield put(actions.updateAclRuleSuccess({ data: payload }))
  } catch (error) {
    yield put(actions.updateAclRuleError(error as Error))
  }
}

export const updateAclRuleSaga = function* (action: ReturnType<typeof actions.updateAclRuleStart>) {
  yield call(writeDraftTask, updateAclRuleTask, action)
}

export const deleteAclRuleTask = function* ({ payload: { id, data, apiProvider } }: ReturnType<typeof actions.deleteAclRuleStart>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)

    yield call(apiProvider.Acl.removeDraftRule, tenantId, id)

    yield put(actions.deleteAclRuleSuccess({ data: { ...data, id } }))
  } catch (error) {
    yield put(actions.deleteAclRuleError(error))
  }
}

export const deleteAclRuleSaga = function* (action: ReturnType<typeof actions.deleteAclRuleStart>) {
  yield call(writeDraftTask, deleteAclRuleTask, action)
}

export const fetchCommittedAclRulesSaga = function* ({
  payload: { apiProvider, params },
}: ReturnType<typeof actions.fetchCommittedAclRulesStart>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)

    const { data } = yield call(apiProvider.Acl.readCommittedRules, tenantId, params)

    yield put(actions.fetchCommittedAclRulesSuccess({ response: data, params }))
  } catch (error) {
    yield put(actions.fetchCommittedAclRulesError(error))
  }
}

export const fetchDraftAclRulesSaga = function* ({
  payload: { apiProvider, params },
}: ReturnType<typeof actions.fetchDraftAclRulesStart>) {
  const hasAclRulesDraft = yield select(getHasAclRulesDraft)

  try {
    const tenantId = yield call(UesSessionApi.getTenantId)

    const { data } = yield call(apiProvider.Acl.readDraftRules, tenantId, params)

    yield put(actions.fetchDraftAclRulesSuccess({ response: data, params }))
  } catch (error) {
    if (error?.response?.status === httpStatus.NOT_FOUND && hasAclRulesDraft) {
      yield put(actions.fetchDraftAclRulesProfileStart(apiProvider))
    }

    yield put(actions.fetchDraftAclRulesError(error))
  }
}

export const commitDraftSaga = function* ({ payload: { apiProvider } }: ReturnType<typeof actions.commitDraftStart>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)
    const hasAclVersionsConflict = yield select(getHasAclVersionsConflict)

    yield call(apiProvider.Acl.commitDraft, tenantId, hasAclVersionsConflict && { force: true })

    yield put(actions.commitDraftSuccess())

    yield put(actions.fetchCommittedAclRulesProfileStart(apiProvider))
  } catch (error) {
    yield put(actions.commitDraftError(error))
  }
}

export const discardDraftSaga = function* ({ payload: { apiProvider } }: ReturnType<typeof actions.discardDraftStart>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)

    yield call(apiProvider.Acl.discardDraft, tenantId)

    yield put(actions.discardDraftSuccess())

    yield put(actions.fetchCommittedAclRulesProfileStart(apiProvider))
  } catch (error) {
    yield put(actions.discardDraftError(error))
  }
}

export const fetchDraftAclRulesProfileSaga = function* ({
  payload: { apiProvider },
}: ReturnType<typeof actions.fetchDraftAclRulesProfileStart>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)

    const { data } = yield call(apiProvider.Acl.readDraftRulesProfile, tenantId)

    yield put(actions.fetchDraftAclRulesProfileSuccess({ data }))
  } catch (error) {
    yield put(actions.fetchDraftAclRulesProfileError(error))
  }
}

export const fetchCommittedAclRulesProfileSaga = function* ({
  payload: { apiProvider },
}: ReturnType<typeof actions.fetchCommittedAclRulesProfileStart>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)

    const { data } = yield call(apiProvider.Acl.readCommittedRulesProfile, tenantId)

    yield put(actions.fetchCommittedAclRulesProfileSuccess({ data }))
  } catch (error) {
    yield put(actions.fetchCommittedAclRulesProfileError(error))
  }
}

export const updateAclRulesRankSaga = function* ({
  payload: { ranksUpdate, dataUpdate, apiProvider },
}: ReturnType<typeof actions.updateAclRulesRankStart>) {
  try {
    const tenantId = yield call(UesSessionApi.getTenantId)

    yield call(apiProvider.Acl.updateDraftRulesRank, tenantId, ranksUpdate)

    yield put(actions.updateAclRulesRankSuccess({ data: dataUpdate }))
  } catch (error) {
    yield put(actions.updateAclRulesRankError(error))
  }
}

export const rootSaga = function* (): Generator {
  yield all([
    takeLatest(ActionType.FetchAclRuleStart, fetchAclRuleSaga),
    takeLatest(ActionType.FetchCommittedAclRulesProfileStart, fetchCommittedAclRulesProfileSaga),
    takeLatest(ActionType.FetchDraftAclRulesProfileStart, fetchDraftAclRulesProfileSaga),
    takeLeading(ActionType.AddAclRuleStart, addAclRuleSaga),
    takeLeading(ActionType.BootstrapDraft, createAclRulesDraftIfNotExistSaga),
    takeLeading(ActionType.CommitDraftStart, commitDraftSaga),
    takeLeading(ActionType.DeleteAclRuleStart, deleteAclRuleSaga),
    takeLeading(ActionType.DiscardDraftStart, discardDraftSaga),
    takeLeading(ActionType.FetchCommittedAclRulesStart, fetchCommittedAclRulesSaga),
    takeLeading(ActionType.FetchDraftAclRulesStart, fetchDraftAclRulesSaga),
    takeLeading(ActionType.UpdateAclRulesRankStart, updateAclRulesRankSaga),
    takeLeading(ActionType.UpdateAclRuleStart, updateAclRuleSaga),
  ])
}
