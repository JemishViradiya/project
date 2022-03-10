//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import type { Effect } from 'redux-saga/effects'
import { call, takeLeading } from 'redux-saga/effects'

import { GatewayApiMock, networkProtectionConfigMock } from '@ues-data/gateway'
import { UesSessionApi } from '@ues-data/shared'

const TENANT_ID = '1234'

import * as actions from './actions'
import * as sagas from './sagas'
import { ActionType } from './types'

describe('Network Protection Config sagas', () => {
  describe('rootSaga', () => {
    it('should call root saga', () => {
      const gen = sagas.rootSaga()
      const effect = gen.next().value as Effect

      expect(effect.type).toBe('ALL')
      expect(effect.payload).toStrictEqual(
        expect.arrayContaining([
          takeLeading(ActionType.FetchNetworkProtectionConfigStart, sagas.fetchNetworkProtectionConfigSaga),
          takeLeading(ActionType.UpdateNetworkProtectionConfigStart, sagas.updateNetworkProtectionConfigSaga),
        ]),
      )
    })
  })

  describe('fetchNetworkProtectionConfigSaga', () => {
    const action: ReturnType<typeof actions.fetchNetworkProtectionConfigStartAction> = {
      type: ActionType.FetchNetworkProtectionConfigStart,
      payload: {
        apiProvider: GatewayApiMock,
      },
    }

    it('should fetch Network Protection Config with success', () => {
      return expectSaga(sagas.fetchNetworkProtectionConfigSaga, action)
        .provide([
          [call(UesSessionApi.getTenantId), TENANT_ID],
          [call(action.payload.apiProvider.NetworkProtection.read, TENANT_ID), { data: networkProtectionConfigMock }],
        ])
        .put(
          actions.fetchNetworkProtectionConfigSuccessAction({
            data: networkProtectionConfigMock,
          }),
        )
        .run()
    })

    it('should fetch Network Protection Config with error', () => {
      const error = new Error('error')

      return expectSaga(sagas.fetchNetworkProtectionConfigSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.NetworkProtection.read), throwError(error)]])
        .put(actions.fetchNetworkProtectionConfigErrorAction(error))
        .run()
    })
  })
})
