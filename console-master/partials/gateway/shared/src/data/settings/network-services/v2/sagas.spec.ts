//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import type { Effect } from 'redux-saga/effects'
import { call, takeLeading } from 'redux-saga/effects'

import { GatewayApiMock, NetworkServicesV2 } from '@ues-data/gateway'
import { UesSessionApi } from '@ues-data/shared'

import * as actions from './actions'
import * as sagas from './sagas'
import { ActionType } from './types'

const { networkServicesMock } = NetworkServicesV2

const TENANT_ID = '1234'
const NETWORK_SERVICE_ID = '380dea71-e423-47b5-b93c-2934a66f209c'
const networkService = networkServicesMock.find(item => item.id === NETWORK_SERVICE_ID)

describe('Network Services sagas', () => {
  describe('rootSaga', () => {
    it('should call root saga', () => {
      const gen = sagas.rootSaga()
      const effect = gen.next().value as Effect

      expect(effect.type).toBe('ALL')
      expect(effect.payload).toStrictEqual(
        expect.arrayContaining([
          takeLeading(ActionType.FetchNetworkServicesStart, sagas.fetchNetworkServicesSaga),
          takeLeading(ActionType.CreateNetworkServiceStart, sagas.createNetworkServiceSaga),
          takeLeading(ActionType.UpdateNetworkServiceStart, sagas.updateNetworkServiceSaga),
          takeLeading(ActionType.DeleteNetworkServiceStart, sagas.deleteNetworkServiceSaga),
        ]),
      )
    })
  })

  describe('fetchNetworkServicesSaga', () => {
    it('should fetch all network services', () => {
      const action: ReturnType<typeof actions.fetchNetworkServicesStart> = {
        type: ActionType.FetchNetworkServicesStart,
        payload: {
          networkServiceId: undefined,
          apiProvider: GatewayApiMock,
        },
      }

      return expectSaga(sagas.fetchNetworkServicesSaga, action)
        .provide([
          [call(UesSessionApi.getTenantId), TENANT_ID],
          [
            call(action.payload.apiProvider.NetworkServicesV2.read, TENANT_ID, action.payload.networkServiceId),
            { data: networkServicesMock },
          ],
        ])
        .put(
          actions.fetchNetworkServicesSuccess({
            data: networkServicesMock,
          }),
        )
        .run()
    })

    it('should fetch network service with given ID', () => {
      const action: ReturnType<typeof actions.fetchNetworkServicesStart> = {
        type: ActionType.FetchNetworkServicesStart,
        payload: {
          networkServiceId: NETWORK_SERVICE_ID,
          apiProvider: GatewayApiMock,
        },
      }

      return expectSaga(sagas.fetchNetworkServicesSaga, action)
        .provide([
          [call(UesSessionApi.getTenantId), TENANT_ID],
          [
            call(action.payload.apiProvider.NetworkServicesV2.read, TENANT_ID, action.payload.networkServiceId),
            { data: networkService },
          ],
        ])
        .put(
          actions.fetchNetworkServicesSuccess({
            data: networkService,
          }),
        )
        .run()
    })

    it('should fetch public network services', () => {
      const action: ReturnType<typeof actions.fetchNetworkServicesStart> = {
        type: ActionType.FetchNetworkServicesStart,
        payload: {
          networkServiceId: undefined,
          apiProvider: GatewayApiMock,
        },
      }

      return expectSaga(sagas.fetchNetworkServicesSaga, action)
        .provide([
          [call(UesSessionApi.getTenantId), TENANT_ID],
          [
            call(action.payload.apiProvider.NetworkServicesV2.read, TENANT_ID, action.payload.networkServiceId),
            { data: networkServicesMock },
          ],
        ])
        .put(
          actions.fetchNetworkServicesSuccess({
            data: networkServicesMock,
          }),
        )
        .run()
    })

    it('should handle error when fetching network services', () => {
      const action: ReturnType<typeof actions.fetchNetworkServicesStart> = {
        type: ActionType.FetchNetworkServicesStart,
        payload: {
          networkServiceId: undefined,
          apiProvider: GatewayApiMock,
        },
      }
      const error = new Error('error')

      return expectSaga(sagas.fetchNetworkServicesSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.NetworkServicesV2.read), throwError(error)]])
        .put(actions.fetchNetworkServicesError(error))
        .run()
    })
  })

  describe('createNetworkServiceSaga', () => {
    const action: ReturnType<typeof actions.createNetworkServiceStart> = {
      type: ActionType.CreateNetworkServiceStart,
      payload: {
        networkServiceConfig: networkService,
        apiProvider: GatewayApiMock,
      },
    }

    it('should create network service', () => {
      return expectSaga(sagas.createNetworkServiceSaga, action)
        .provide([
          [call(UesSessionApi.getTenantId), TENANT_ID],
          [
            call(action.payload.apiProvider.NetworkServicesV2.create, TENANT_ID, action.payload.networkServiceConfig),
            { data: { id: NETWORK_SERVICE_ID } },
          ],
        ])
        .put(
          actions.createNetworkServiceSuccess({
            networkServiceId: NETWORK_SERVICE_ID,
            networkServiceConfig: networkService,
          }),
        )
        .run()
    })

    it('should handle error when creating network service', () => {
      const error = new Error('error')

      return expectSaga(sagas.createNetworkServiceSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.NetworkServicesV2.create), throwError(error)]])
        .put(actions.createNetworkServiceError(error))
        .run()
    })
  })

  describe('deleteNetworkServiceSaga', () => {
    const action: ReturnType<typeof actions.deleteNetworkServiceStart> = {
      type: ActionType.DeleteNetworkServiceStart,
      payload: {
        networkServiceId: NETWORK_SERVICE_ID,
        apiProvider: GatewayApiMock,
      },
    }

    it('should remove network service', () => {
      return expectSaga(sagas.deleteNetworkServiceSaga, action)
        .provide([
          [call(UesSessionApi.getTenantId), TENANT_ID],
          [call(action.payload.apiProvider.NetworkServicesV2.remove, TENANT_ID, action.payload.networkServiceId), {}],
        ])
        .put(
          actions.deleteNetworkServiceSuccess({
            networkServiceId: NETWORK_SERVICE_ID,
          }),
        )
        .run()
    })

    it('should handle error when removing network service', () => {
      const error = new Error('error')

      return expectSaga(sagas.deleteNetworkServiceSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.NetworkServicesV2.remove), throwError(error)]])
        .put(actions.deleteNetworkServiceError(error))
        .run()
    })
  })
})
