//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { ActionType, ReduxSlice, TaskId } from './types'
import { defaultState } from './reducer'
import { expectSaga } from 'redux-saga-test-plan'
import * as sagas from './sagas'
import * as actions from './actions'
import {
  committedAclRulesMock,
  committedAclRulesProfileMock,
  draftAclRulesProfileMock,
  GatewayApiMock,
  RequestError,
} from '@ues-data/gateway'
import { call, Effect, select, takeLatest } from 'redux-saga/effects'
import { UesSessionApi } from '@ues-data/shared'
import { throwError } from 'redux-saga-test-plan/providers'
import { getHasAclRulesDraft } from './selectors'
import * as httpStatus from 'http-status-codes'
import { makePageableResponse } from '@ues-data/shared'

const TENANT_ID = '1234'
const RULE_ID = committedAclRulesMock[0].id

describe(`${ReduxSlice} sagas`, () => {
  const mockStateObj = { [ReduxSlice]: defaultState }

  describe('rootSaga', () => {
    it('should call root saga', () => {
      const gen = sagas.rootSaga()
      const effect = gen.next().value as Effect
      expect(effect.type).toBe('ALL')
      expect(effect.payload).toStrictEqual(
        expect.arrayContaining([takeLatest(ActionType.FetchAclRuleStart, sagas.fetchAclRuleSaga)]),
      )
    })
  })

  describe('fetchAclRuleSaga', () => {
    it('should fetch committed acl rules', async () => {
      const action = actions.fetchAclRuleStart({ id: RULE_ID, isCommittedView: true }, GatewayApiMock)
      return expectSaga(sagas.fetchAclRuleSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), TENANT_ID]])
        .put(actions.fetchAclRuleSuccess({ data: committedAclRulesMock[0] }))
        .run()
    })

    it('should handle committed acl rules error', () => {
      const action = actions.fetchAclRuleStart({ id: RULE_ID, isCommittedView: true }, GatewayApiMock)
      const error = new Error('error')
      return expectSaga(sagas.fetchAclRuleSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), throwError(error)]])
        .put(actions.fetchAclRuleError(error))
        .run()
    })

    it('should fetch draft acl rules', async () => {
      const action = actions.fetchAclRuleStart({ id: RULE_ID, isCommittedView: false }, GatewayApiMock)
      return expectSaga(sagas.fetchAclRuleSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), TENANT_ID]])
        .put(actions.fetchAclRuleSuccess({ data: {} }))
        .run()
    })

    it('should handle draft acl rules error', () => {
      const action = actions.fetchAclRuleStart({ id: RULE_ID, isCommittedView: false }, GatewayApiMock)
      const error = new Error('error')
      return expectSaga(sagas.fetchAclRuleSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), throwError(error)]])
        .put(actions.fetchAclRuleError(error))
        .run()
    })
  })

  describe('createAclRulesDraftIfNotExistSaga', () => {
    it('should create acl rule', () => {
      const action = actions.bootstrapDraft(GatewayApiMock)
      return expectSaga(sagas.createAclRulesDraftIfNotExistSaga, action)
        .withState({
          [ReduxSlice]: {
            ...defaultState,
            tasks: {
              ...defaultState.tasks,
              [TaskId.FetchCommittedAclRulesProfile]: {
                ...defaultState.tasks[TaskId.FetchCommittedAclRulesProfile],
                data: committedAclRulesMock[0],
              },
            },
          },
        })
        .provide([
          [select(getHasAclRulesDraft), false],
          [call(UesSessionApi.getTenantId), TENANT_ID],
        ])
        .put(actions.createDraftStart())
        .put(actions.createDraftSuccess())
        .returns({ shouldContinue: true })
        .run()
    })
    it('should create acl rule and remap', () => {
      const action = actions.bootstrapDraft(GatewayApiMock)
      return expectSaga(sagas.createAclRulesDraftIfNotExistSaga, action, true)
        .withState({
          [ReduxSlice]: {
            ...defaultState,
            tasks: {
              ...defaultState.tasks,
              [TaskId.FetchCommittedAclRulesProfile]: {
                ...defaultState.tasks[TaskId.FetchCommittedAclRulesProfile],
                data: committedAclRulesMock[0],
              },
            },
          },
        })
        .provide([
          [select(getHasAclRulesDraft), false],
          [call(UesSessionApi.getTenantId), TENANT_ID],
        ])
        .put(actions.createDraftStart())
        .put(actions.createDraftSuccess())
        .call(sagas.mapCommittedAclRuleIdToDraftRuleIdSaga, action.payload)
        .run()
    })

    it('should handle error in create acl rule', () => {
      const action = actions.bootstrapDraft(GatewayApiMock)
      const error = new Error('error')
      return expectSaga(sagas.createAclRulesDraftIfNotExistSaga, action)
        .withState({
          [ReduxSlice]: {
            ...defaultState,
            tasks: {
              ...defaultState.tasks,
              [TaskId.FetchCommittedAclRulesProfile]: {
                ...defaultState.tasks[TaskId.FetchCommittedAclRulesProfile],
                data: committedAclRulesMock[0],
              },
            },
          },
        })
        .provide([
          [select(getHasAclRulesDraft), false],
          [call(UesSessionApi.getTenantId), throwError(error)],
        ])
        .put(actions.createDraftError(error))
        .run()
    })
  })

  describe('fetchCommittedAclRulesProfileSaga', () => {
    it('should fetch committed acl rules profile saga', () => {
      const action = actions.fetchCommittedAclRulesProfileStart(GatewayApiMock)
      return expectSaga(sagas.fetchCommittedAclRulesProfileSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), TENANT_ID]])
        .put(actions.fetchCommittedAclRulesProfileSuccess({ data: committedAclRulesProfileMock }))
        .run()
    })
    it('should handle error when fetch committed acl rules profile saga', () => {
      const action = actions.fetchCommittedAclRulesProfileStart(GatewayApiMock)
      const error = new Error('error')
      return expectSaga(sagas.fetchCommittedAclRulesProfileSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), throwError(error)]])
        .put(actions.fetchCommittedAclRulesProfileError(error))
        .run()
    })
  })

  describe('fetchDraftAclRulesProfileSaga', () => {
    it('should fetch draft acl rules profile saga', () => {
      const action = actions.fetchDraftAclRulesProfileStart(GatewayApiMock)
      return expectSaga(sagas.fetchDraftAclRulesProfileSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), TENANT_ID]])
        .put(actions.fetchDraftAclRulesProfileSuccess({ data: draftAclRulesProfileMock }))
        .run()
    })
    it('should handle error when fetch draft acl rules profile saga', () => {
      const action = actions.fetchDraftAclRulesProfileStart(GatewayApiMock)
      const error = new Error('error')
      return expectSaga(sagas.fetchDraftAclRulesProfileSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), throwError(error)]])
        .put(actions.fetchDraftAclRulesProfileError(error))
        .run()
    })
  })

  describe('commitDraftSaga', () => {
    it('should fetch draft acl rules profile saga', () => {
      const action = actions.commitDraftStart(GatewayApiMock)
      return expectSaga(sagas.commitDraftSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), TENANT_ID]])
        .put(actions.commitDraftSuccess())
        .put(actions.fetchCommittedAclRulesProfileStart(GatewayApiMock))
        .run()
    })
    it('should handle error when fetch draft acl rules profile saga', () => {
      const action = actions.commitDraftStart(GatewayApiMock)
      const error = new Error('error')
      return expectSaga(sagas.commitDraftSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), throwError(error)]])
        .put(actions.commitDraftError(error))
        .run()
    })
  })

  describe('discardDraftSaga', () => {
    it('should discard draft', () => {
      const action = actions.discardDraftStart(GatewayApiMock)
      return expectSaga(sagas.discardDraftSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), TENANT_ID]])
        .put(actions.discardDraftSuccess())
        .put(actions.fetchCommittedAclRulesProfileStart(GatewayApiMock))
        .run()
    })
    it('should handle error when discard draft', () => {
      const action = actions.discardDraftStart(GatewayApiMock)
      const error = new Error('error')
      return expectSaga(sagas.discardDraftSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), throwError(error)]])
        .put(actions.discardDraftError(error))
        .run()
    })
  })

  describe('addAclRuleSaga', () => {
    it('should add acl rule', () => {
      const action = actions.addAclRuleStart({}, GatewayApiMock)
      return expectSaga(sagas.addAclRuleSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), TENANT_ID]])
        .call(sagas.writeDraftTask, sagas.addAclRuleTask, action, false)
        .run()
    })
    it('should handle error when add acl rule', () => {
      const action = actions.addAclRuleStart({}, GatewayApiMock)

      return expectSaga(sagas.addAclRuleSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), TENANT_ID]])
        .call(sagas.writeDraftTask, sagas.addAclRuleTask, action, false)
        .put(
          actions.addAclRuleError({
            response: {
              status: httpStatus.BAD_REQUEST,
              data: { error: RequestError.NameAlreadyUsed },
            },
          } as any),
        )
        .run()
    })
  })

  describe('deleteAclRuleSaga', () => {
    it('should delete acl rule', () => {
      const action = actions.deleteAclRuleStart({ id: RULE_ID }, GatewayApiMock)
      return expectSaga(sagas.deleteAclRuleSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), TENANT_ID]])
        .call(sagas.writeDraftTask, sagas.deleteAclRuleTask, action)
        .put(actions.deleteAclRuleSuccess({ data: { id: RULE_ID } as any }))
        .run()
    })
    it('should handle error when delete acl rule', () => {
      const action = actions.deleteAclRuleStart({}, GatewayApiMock)
      const error = new Error('error')

      return expectSaga(sagas.deleteAclRuleSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), throwError(error)]])
        .call(sagas.writeDraftTask, sagas.deleteAclRuleTask, action)
        .put(actions.deleteAclRuleError(error))
        .run()
    })
  })

  describe('updateAclRuleSaga', () => {
    it('should update acl rule', () => {
      const action = actions.updateAclRuleStart({ id: RULE_ID, data: committedAclRulesMock[0] }, GatewayApiMock)

      return expectSaga(sagas.updateAclRuleSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), TENANT_ID]])
        .call(sagas.writeDraftTask, sagas.updateAclRuleTask, action)
        .put(actions.updateAclRuleSuccess({ data: committedAclRulesMock[0] }))
        .run()
    })
    it('should handle error when update acl rule', () => {
      const action = actions.updateAclRuleStart({}, GatewayApiMock)
      const error = new Error('error')

      return expectSaga(sagas.updateAclRuleSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), throwError(error)]])
        .call(sagas.writeDraftTask, sagas.updateAclRuleTask, action)
        .put(actions.updateAclRuleError(error))
        .run()
    })
  })

  describe('fetchCommittedAclRulesSaga', () => {
    it('should fetch committed acl rule', () => {
      const action = actions.fetchCommittedAclRulesStart({ params: {} }, GatewayApiMock)

      return expectSaga(sagas.fetchCommittedAclRulesSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), TENANT_ID]])
        .put(actions.fetchCommittedAclRulesSuccess({ response: makePageableResponse(committedAclRulesMock), params: {} }))
        .run()
    })
    it('should handle error when fetch committed acl rule', () => {
      const action = actions.fetchCommittedAclRulesStart({ params: {} }, GatewayApiMock)
      const error = new Error('error')

      return expectSaga(sagas.fetchCommittedAclRulesSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), throwError(error)]])
        .put(actions.fetchCommittedAclRulesError(error))
        .run()
    })
  })

  describe('fetchDraftAclRulesSaga', () => {
    it('should fetch draft acl rule', () => {
      const action = actions.fetchDraftAclRulesStart({ params: {} }, GatewayApiMock)
      GatewayApiMock.Acl.createDraft(TENANT_ID)

      return expectSaga(sagas.fetchDraftAclRulesSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), TENANT_ID]])
        .put(actions.fetchDraftAclRulesSuccess({ response: makePageableResponse(committedAclRulesMock), params: {} }))
        .run()
    })
    it('should handle error when fetch committed acl rule', () => {
      const action = actions.fetchDraftAclRulesStart({ params: {} }, GatewayApiMock)
      const error = new Error('error')

      return expectSaga(sagas.fetchDraftAclRulesSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), throwError(error)]])
        .put(actions.fetchDraftAclRulesError(error))
        .run()
    })
  })

  describe('updateAclRulesRankSaga', () => {
    it('should update acl rule rank', () => {
      const action = actions.updateAclRulesRankStart({ ranksUpdate: [], dataUpdate: [] }, GatewayApiMock)

      return expectSaga(sagas.updateAclRulesRankSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), TENANT_ID]])
        .put(actions.updateAclRulesRankSuccess({ data: [] }))
        .run()
    })
    it('should handle error when update acl rule rank', () => {
      const action = actions.updateAclRulesRankStart({ ranksUpdate: [], dataUpdate: [] }, GatewayApiMock)
      const error = new Error('error')

      return expectSaga(sagas.updateAclRulesRankSaga, action)
        .withState(mockStateObj)
        .provide([[call(UesSessionApi.getTenantId), throwError(error)]])
        .put(actions.updateAclRulesRankError(error))
        .run()
    })
  })
})
