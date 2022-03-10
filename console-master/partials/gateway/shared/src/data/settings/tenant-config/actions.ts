//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { TenantConfiguration, TenantHealthEntity } from '@ues-data/gateway'

import type { ApiProvider } from '../../../types'
import type { Task } from '../../../utils'
import { createAction } from '../../../utils'
import { ActionType } from './types'

export const fetchTenantConfigStartAction = (apiProvider: ApiProvider) =>
  createAction(ActionType.FetchTenantConfigStart, { apiProvider })

export const fetchTenantConfigSuccessAction = (payload: Task<TenantConfiguration>) =>
  createAction(ActionType.FetchTenantConfigSuccess, payload)

export const fetchTenantConfigErrorAction = (error: Error) => createAction(ActionType.FetchTenantConfigError, { error })

export const updateTenantConfigStartAction = (payload: { configuration: Partial<TenantConfiguration> }, apiProvider: ApiProvider) =>
  createAction(ActionType.UpdateTenantConfigStart, { ...payload, apiProvider })

export const updateTenantConfigErrorAction = payload => createAction(ActionType.UpdateTenantConfigError, payload)

export const updateTenantConfigSuccessAction = (payload: Task<Partial<TenantConfiguration>>) =>
  createAction(ActionType.UpdateTenantConfigSuccess, payload)

export const updateLocalTenantConfig = (payload: Partial<TenantConfiguration> | undefined) =>
  createAction(ActionType.UpdateLocalTenantConfig, payload)

export const clearLocalTenantConfig = () => createAction(ActionType.ClearLocalTenantConfig)

export const fetchTenantHealthStartAction = (apiProvider: ApiProvider) =>
  createAction(ActionType.FetchTenantHealthStart, { apiProvider })

export const fetchTenantHealthSuccessAction = (payload: Task<TenantHealthEntity>) =>
  createAction(ActionType.FetchTenantHealthSuccess, payload)

export const fetchTenantHealthErrorAction = (error: Error) => createAction(ActionType.FetchTenantHealthError, { error })
