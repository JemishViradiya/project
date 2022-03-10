//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import type { Effect } from 'redux-saga/effects'
import { call, takeLeading } from 'redux-saga/effects'

import { GatewayApiMock, NetworkServicesV3 } from '@ues-data/gateway'
import { UesSessionApi } from '@ues-data/shared'

import * as actions from './actions'
import * as sagas from './sagas'
import { ActionType } from './types'

const TENANT_ID = '1234'
const NETWORK_SERVICE_ID = '380dea71-e423-47b5-b93c-2934a66f209c'
const networkService = NetworkServicesV3.networkServices.find(item => item.id === NETWORK_SERVICE_ID)

describe('Network Services sagas', () => {
  describe('rootSaga', () => {
    it('should call root saga', () => {
      const gen = sagas.rootSaga()
      const effect = gen.next().value as Effect

      expect(effect.type).toBe('ALL')
      expect(effect.payload).toStrictEqual(
        expect.arrayContaining([
          takeLeading(ActionType.CreateNetworkServiceStart, sagas.createNetworkServiceSaga),
          takeLeading(ActionType.UpdateNetworkServiceStart, sagas.updateNetworkServiceSaga),
          takeLeading(ActionType.DeleteNetworkServiceStart, sagas.deleteNetworkServiceSaga),
        ]),
      )
    })
  })

  describe('fetchNetworkServiceSaga', () => {
    it('should fetch network service with given ID', () => {
      const action: ReturnType<typeof actions.fetchNetworkServiceStart> = {
        type: ActionType.FetchNetworkServiceStart,
        payload: {
          id: NETWORK_SERVICE_ID,
          apiProvider: GatewayApiMock,
        },
      }

      return expectSaga(sagas.fetchNetworkServiceSaga, action)
        .provide([
          [call(UesSessionApi.getTenantId), TENANT_ID],
          [call(action.payload.apiProvider.NetworkServicesV3.readOne, TENANT_ID, action.payload.id), { data: networkService }],
        ])
        .put(
          actions.fetchNetworkServiceSuccess({
            data: networkService,
          }),
        )
        .run()
    })

    it('should handle error when fetching network service', () => {
      const action: ReturnType<typeof actions.fetchNetworkServiceStart> = {
        type: ActionType.FetchNetworkServiceStart,
        payload: {
          id: undefined,
          apiProvider: GatewayApiMock,
        },
      }
      const error = new Error('error')

      return expectSaga(sagas.fetchNetworkServiceSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.NetworkServicesV3.readOne), throwError(error)]])
        .put(actions.fetchNetworkServiceError(error))
        .run()
    })
  })

  describe('deleteNetworkServiceSaga', () => {
    const action: ReturnType<typeof actions.deleteNetworkServiceStart> = {
      type: ActionType.DeleteNetworkServiceStart,
      payload: {
        id: NETWORK_SERVICE_ID,
        apiProvider: GatewayApiMock,
      },
    }

    it('should remove network service', () => {
      return expectSaga(sagas.deleteNetworkServiceSaga, action)
        .provide([
          [call(UesSessionApi.getTenantId), TENANT_ID],
          [call(action.payload.apiProvider.NetworkServicesV3.remove, TENANT_ID, action.payload.id), {}],
        ])
        .put(
          actions.deleteNetworkServiceSuccess({
            id: NETWORK_SERVICE_ID,
          }),
        )
        .run()
    })

    it('should handle error when removing network service', () => {
      const error = new Error('error')

      return expectSaga(sagas.deleteNetworkServiceSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.NetworkServicesV3.remove), throwError(error)]])
        .put(actions.deleteNetworkServiceError(error))
        .run()
    })
  })
})
