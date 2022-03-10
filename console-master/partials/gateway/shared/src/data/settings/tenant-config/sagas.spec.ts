//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import type { Effect } from 'redux-saga/effects'
import { call, takeLeading } from 'redux-saga/effects'

import { GatewayApiMock, tenantConfigurationMock, TenantHealth } from '@ues-data/gateway'
import { UesSessionApi } from '@ues-data/shared'

const TENANT_ID = '1234'

import * as actions from './actions'
import * as sagas from './sagas'
import { ActionType } from './types'

describe('Tenant Config sagas', () => {
  describe('rootSaga', () => {
    it('should call root saga', () => {
      const gen = sagas.rootSaga()
      const effect = gen.next().value as Effect

      expect(effect.type).toBe('ALL')
      expect(effect.payload).toStrictEqual(
        expect.arrayContaining([
          takeLeading(ActionType.FetchTenantConfigStart, sagas.fetchTenantConfigSaga),
          takeLeading(ActionType.UpdateTenantConfigStart, sagas.updateTenantConfigSaga),
        ]),
      )
    })
  })

  describe('fetchTenantConfigSaga', () => {
    const action: ReturnType<typeof actions.fetchTenantConfigStartAction> = {
      type: ActionType.FetchTenantConfigStart,
      payload: {
        apiProvider: GatewayApiMock,
      },
    }

    it('should fetch Tenant Config with success', () => {
      return expectSaga(sagas.fetchTenantConfigSaga, action)
        .provide([
          [call(UesSessionApi.getTenantId), TENANT_ID],
          [call(action.payload.apiProvider.Tenants.readConfig, TENANT_ID), { data: tenantConfigurationMock }],
        ])
        .put(
          actions.fetchTenantConfigSuccessAction({
            data: tenantConfigurationMock,
          }),
        )
        .run()
    })

    it('should fetch Tenant Config with error', () => {
      const error = new Error('error')

      return expectSaga(sagas.fetchTenantConfigSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.Tenants.readConfig), throwError(error)]])
        .put(actions.fetchTenantConfigErrorAction(error))
        .run()
    })
  })

  describe('fetchTenantHealthSaga', () => {
    const action: ReturnType<typeof actions.fetchTenantHealthStartAction> = {
      type: ActionType.FetchTenantHealthStart,
      payload: {
        apiProvider: GatewayApiMock,
      },
    }

    it('should fetch Tenant Health with success', () => {
      return expectSaga(sagas.fetchTenantHealthSaga, action)
        .provide([
          [call(UesSessionApi.getTenantId), TENANT_ID],
          [call(action.payload.apiProvider.Tenants.readHealth, TENANT_ID), { data: { health: TenantHealth.Red } }],
        ])
        .put(
          actions.fetchTenantHealthSuccessAction({
            data: { health: TenantHealth.Red },
          }),
        )
        .run()
    })

    it('should fetch Tenant Health with error', () => {
      const error = new Error('error')

      return expectSaga(sagas.fetchTenantHealthSaga, action)
        .provide([[matchers.call.fn(action.payload.apiProvider.Tenants.readHealth), throwError(error)]])
        .put(actions.fetchTenantHealthErrorAction(error))
        .run()
    })
  })
})
