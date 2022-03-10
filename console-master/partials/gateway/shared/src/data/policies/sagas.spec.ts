import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import { call, Effect, select, takeLeading } from 'redux-saga/effects'

import { GatewayApiMock, networkAccessControlPolicyMock, Policy } from '@ues-data/gateway'

import { ReconciliationEntityType, UesSessionApi } from '@ues-data/shared'
import { DEFAULT_LOCAL_POLICY_DATA } from '../../config'
import { makePolicyPayload } from './utils'

const TENANT_ID = '1234'

import * as actions from './actions'
import * as sagas from './sagas'
import * as selectors from './selectors'
import { ActionType, ReduxSlice } from './types'

const ENTITY_ID_MOCK = '9906e78b-4ccc-4080-8b6c-fd2367c45d02'

describe(`${ReduxSlice} sagas`, () => {
  describe('makePolicyPayload', () => {
    const localPolicyData = {
      name: 'Test Policy',
    } as Policy

    it(`should make payload for ${ReconciliationEntityType.GatewayApp}`, () => {
      localPolicyData.entityType = ReconciliationEntityType.GatewayApp

      expect(makePolicyPayload(localPolicyData)).toStrictEqual({
        ...localPolicyData,
        ...DEFAULT_LOCAL_POLICY_DATA.GatewayApp,
      })
    })

    it(`should make payload for ${ReconciliationEntityType.NetworkAccessControl}`, () => {
      localPolicyData.entityType = ReconciliationEntityType.NetworkAccessControl

      expect(makePolicyPayload(localPolicyData)).toStrictEqual({
        ...localPolicyData,
        ...DEFAULT_LOCAL_POLICY_DATA.NetworkAccessControl,
      })
    })
  })

  describe('rootSaga', () => {
    it('should call root saga', () => {
      const gen = sagas.rootSaga()
      const effect = gen.next().value as Effect

      expect(effect.type).toBe('ALL')
      expect(effect.payload).toStrictEqual(
        expect.arrayContaining([
          takeLeading(ActionType.FetchPolicyStart, sagas.fetchPolicySaga),
          takeLeading(ActionType.AddPolicyStart, sagas.addPolicySaga),
          takeLeading(ActionType.UpdatePolicyStart, sagas.updatePolicySaga),
          takeLeading(ActionType.DeletePolicyStart, sagas.deletePolicySaga),
          takeLeading(ActionType.DeletePoliciesStart, sagas.deletePoliciesSaga),
        ]),
      )
    })
  })

  describe('fetchPolicySaga', () => {
    const action: ReturnType<typeof actions.fetchPolicyStart> = {
      type: ActionType.FetchPolicyStart,
      payload: {
        id: ENTITY_ID_MOCK,
        entityType: ReconciliationEntityType.NetworkAccessControl,
        apiProvider: GatewayApiMock,
      },
    }

    it('should fetch a policy', () => {
      return expectSaga(sagas.fetchPolicySaga, action)
        .provide([
          [call(UesSessionApi.getTenantId), TENANT_ID],
          [
            call(
              action.payload.apiProvider.Policies.readOne,
              TENANT_ID,
              action.payload.id,
              ReconciliationEntityType.NetworkAccessControl,
            ),
            { data: networkAccessControlPolicyMock[0] },
          ],
        ])
        .put(
          actions.fetchPolicySuccess({
            data: networkAccessControlPolicyMock[0],
          }),
        )
        .run()
    })

    it('should handle error when fetching a policy', () => {
      const error = new Error('error')

      return expectSaga(sagas.fetchPolicySaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.Policies.readOne), throwError(error)]])
        .put(actions.fetchPolicyError(error))
        .run()
    })
  })

  describe('addPolicySaga', () => {
    const expectedResult = { data: { entityId: ENTITY_ID_MOCK } }

    it(`should add a ${ReconciliationEntityType.NetworkAccessControl} policy`, () => {
      const action: ReturnType<typeof actions.addPolicyStart> = {
        type: ActionType.AddPolicyStart,
        payload: {
          entityType: ReconciliationEntityType.NetworkAccessControl,
          apiProvider: GatewayApiMock,
        },
      }

      return expectSaga(sagas.addPolicySaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.Policies.create), expectedResult]])
        .put(actions.addPolicySuccess(expectedResult))
        .run()
    })

    it(`should add a ${ReconciliationEntityType.GatewayApp} policy`, () => {
      const action: ReturnType<typeof actions.addPolicyStart> = {
        type: ActionType.AddPolicyStart,
        payload: {
          entityType: ReconciliationEntityType.GatewayApp,
          apiProvider: GatewayApiMock,
        },
      }

      return expectSaga(sagas.addPolicySaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.Policies.create), expectedResult]])
        .put(actions.addPolicySuccess(expectedResult))
        .run()
    })

    it('should handle error when creating a policy', () => {
      const action: ReturnType<typeof actions.addPolicyStart> = {
        type: ActionType.AddPolicyStart,
        payload: {
          entityType: ReconciliationEntityType.NetworkAccessControl,
          apiProvider: GatewayApiMock,
        },
      }
      const error = new Error('error')

      return expectSaga(sagas.addPolicySaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.Policies.create), throwError(error)]])
        .put(actions.addPolicyError(error))
        .run()
    })
  })

  describe('updatePolicySaga', () => {
    it(`should update a policy`, () => {
      const action: ReturnType<typeof actions.updatePolicyStart> = {
        type: ActionType.UpdatePolicyStart,
        payload: {
          apiProvider: GatewayApiMock,
        },
      }

      return expectSaga(sagas.updatePolicySaga, action)
        .provide([
          [call(UesSessionApi.getTenantId), TENANT_ID],
          [select(selectors.getLocalPolicyData), { ...networkAccessControlPolicyMock[0] }],
          [call(action.payload.apiProvider.Policies.update, TENANT_ID, ENTITY_ID_MOCK, {}), undefined],
        ])
        .put(actions.updatePolicySuccess())
        .run()
    })

    it('should handle error when updating a policy', () => {
      const action: ReturnType<typeof actions.updatePolicyStart> = {
        type: ActionType.UpdatePolicyStart,
        payload: {
          apiProvider: GatewayApiMock,
        },
      }
      const error = new Error('error')

      return expectSaga(sagas.updatePolicySaga, action)
        .provide([
          [select(selectors.getLocalPolicyData), { ...networkAccessControlPolicyMock[0] }],
          [matchers.call.fn(action.payload.apiProvider.Policies.update), throwError(error)],
        ])
        .put(actions.updatePolicyError(error))
        .run()
    })
  })

  describe('deletePolicySaga', () => {
    const action: ReturnType<typeof actions.deletePolicyStart> = {
      type: ActionType.DeletePolicyStart,
      payload: {
        id: ENTITY_ID_MOCK,
        apiProvider: GatewayApiMock,
      },
    }

    it('should delete a policy', () => {
      return expectSaga(sagas.deletePolicySaga, action)
        .provide([
          [call(UesSessionApi.getTenantId), TENANT_ID],
          [call(action.payload.apiProvider.Policies.remove, TENANT_ID, action.payload.id), {}],
        ])
        .put(actions.deletePolicySuccess())
        .run()
    })

    it('should handle error when deleting a policy', () => {
      const error = new Error('error')

      return expectSaga(sagas.deletePolicySaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.Policies.remove), throwError(error)]])
        .put(actions.deletePolicyError(error))
        .run()
    })
  })

  describe('deletePoliciesSaga', () => {
    const action: ReturnType<typeof actions.deletePoliciesStart> = {
      type: ActionType.DeletePoliciesStart,
      payload: {
        ids: ['entity-id-1', 'entity-id-2', 'entity-id-3'],
        apiProvider: GatewayApiMock,
      },
    }

    it('should delete a policies', () => {
      return expectSaga(sagas.deletePoliciesSaga, action)
        .provide([
          [call(UesSessionApi.getTenantId), TENANT_ID],
          [call(action.payload.apiProvider.Policies.removeMany, TENANT_ID, action.payload.ids), {}],
        ])
        .put(actions.deletePoliciesSuccess())
        .run()
    })

    it('should handle error when deleting a policies', () => {
      const error = new Error('error')

      return expectSaga(sagas.deletePoliciesSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.Policies.removeMany), throwError(error)]])
        .put(actions.deletePoliciesError(error))
        .run()
    })
  })
})
