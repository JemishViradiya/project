//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import type { Effect } from 'redux-saga/effects'
import { call, takeLeading, select } from 'redux-saga/effects'

import { connectorsMock, GatewayApiMock } from '@ues-data/gateway'
import { UesSessionApi } from '@ues-data/shared'

const TENANT_ID = '1234'

import * as actions from './actions'
import * as sagas from './sagas'
import * as selectors from './selectors'
import { ActionType } from './types'

const CONNECTOR_ID = '52087fa844b04b79b8113aa7b3a9f37a'
const connector = connectorsMock.find(item => item.connectorId === CONNECTOR_ID)

describe('Tenant Config sagas', () => {
  describe('rootSaga', () => {
    it('should call root saga', () => {
      const gen = sagas.rootSaga()
      const effect = gen.next().value as Effect

      expect(effect.type).toBe('ALL')
      expect(effect.payload).toStrictEqual(
        expect.arrayContaining([
          takeLeading(ActionType.FetchConnectorsStart, sagas.fetchConnectorsSaga),
          takeLeading(ActionType.FetchConnectorStart, sagas.fetchConnectorSaga),
          takeLeading(ActionType.DeleteConnectorStart, sagas.deleteConnectorSaga),
          takeLeading(ActionType.UpdateConnectorStart, sagas.updateConnectorSaga),
        ]),
      )
    })
  })

  describe('fetchConnectorsSaga', () => {
    const action: ReturnType<typeof actions.fetchConnectorsStartAction> = {
      type: ActionType.FetchConnectorsStart,
      payload: {
        apiProvider: GatewayApiMock,
      },
    }

    it('should fetch Connectors with success', () => {
      return expectSaga(sagas.fetchConnectorsSaga, action)
        .provide([
          [call(UesSessionApi.getTenantId), TENANT_ID],
          [call(action.payload.apiProvider.Connectors.read, TENANT_ID), { data: connectorsMock }],
        ])
        .put(
          actions.fetchConnectorsSuccessAction({
            data: connectorsMock,
          }),
        )
        .run()
    })

    it('should fetch Connectors with error', () => {
      const error = new Error('error')

      return expectSaga(sagas.fetchConnectorsSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.Connectors.read), throwError(error)]])
        .put(actions.fetchConnectorsErrorAction(error))
        .run()
    })
  })

  describe('fetchConnectorSaga', () => {
    const action: ReturnType<typeof actions.fetchConnectorStartAction> = {
      type: ActionType.FetchConnectorStart,
      payload: {
        id: CONNECTOR_ID,
        apiProvider: GatewayApiMock,
      },
    }

    it('should fetch Connector with success', () => {
      return expectSaga(sagas.fetchConnectorSaga, action)
        .provide([
          [call(UesSessionApi.getTenantId), TENANT_ID],
          [call(action.payload.apiProvider.Connectors.read, TENANT_ID, action.payload.id), { data: connector }],
        ])
        .put(
          actions.fetchConnectorSuccessAction({
            data: connector,
          }),
        )
        .run()
    })

    it('should fetch Connector with error', () => {
      const error = new Error('error')

      return expectSaga(sagas.fetchConnectorSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.Connectors.read), throwError(error)]])
        .put(actions.fetchConnectorErrorAction(error))
        .run()
    })
  })

  describe('updateConnectorSaga', () => {
    const action: ReturnType<typeof actions.updateConnectorStartAction> = {
      type: ActionType.UpdateConnectorStart,
      payload: {
        apiProvider: GatewayApiMock,
      },
    }

    it('should update Connector with success', () => {
      return expectSaga(sagas.updateConnectorSaga, action)
        .provide([
          [call(UesSessionApi.getTenantId), TENANT_ID],
          [select(selectors.getLocalConnectorConfig), connector],
          [call(action.payload.apiProvider.Connectors.update, TENANT_ID, connector.connectorId, connector), { data: connector }],
        ])
        .put(
          actions.updateConnectorSuccessAction({
            data: connector,
          }),
        )
        .run()
    })

    it('should update Connector with error', () => {
      const error = new Error('error')

      return expectSaga(sagas.updateConnectorSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.Connectors.update), throwError(error)]])
        .put(actions.updateConnectorErrorAction(error))
        .run()
    })
  })

  describe('deleteConnectorSaga', () => {
    const action: ReturnType<typeof actions.deleteConnectorStartAction> = {
      type: ActionType.DeleteConnectorStart,
      payload: {
        id: CONNECTOR_ID,
        apiProvider: GatewayApiMock,
      },
    }
    it('should remove Connector with success', () => {
      return expectSaga(sagas.deleteConnectorSaga, action)
        .provide([
          [call(UesSessionApi.getTenantId), TENANT_ID],
          [call(action.payload.apiProvider.Connectors.remove, TENANT_ID, action.payload.id), {}],
        ])
        .put(actions.deleteConnectorSuccessAction())
        .run()
    })

    it('should remove Connector with error', () => {
      const error = new Error('error')

      return expectSaga(sagas.deleteConnectorSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.Connectors.remove), throwError(error)]])
        .put(actions.deleteConnectorErrorAction(error))
        .run()
    })
  })
})
