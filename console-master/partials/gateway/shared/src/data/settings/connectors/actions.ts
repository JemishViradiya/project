//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { ConnectorConfigInfo, ConnectorCreateInfo } from '@ues-data/gateway'

import type { ApiProvider } from '../../../types'
import type { Task } from '../../../utils'
import { createAction } from '../../../utils'
import { ActionType } from './types'

export const fetchConnectorsStartAction = (apiProvider: ApiProvider) =>
  createAction(ActionType.FetchConnectorsStart, { apiProvider })

export const fetchConnectorsSuccessAction = (payload: Task<ConnectorConfigInfo[]>) =>
  createAction(ActionType.FetchConnectorsSuccess, payload)

export const fetchConnectorsErrorAction = (error: Error) => createAction(ActionType.FetchConnectorsError, { error })

export const fetchConnectorStartAction = (payload: { id: string }, apiProvider: ApiProvider) =>
  createAction(ActionType.FetchConnectorStart, { ...payload, apiProvider })

export const fetchConnectorSuccessAction = (payload: Task<ConnectorConfigInfo>) =>
  createAction(ActionType.FetchConnectorSuccess, payload)

export const fetchConnectorErrorAction = (error: Error) => createAction(ActionType.FetchConnectorError, { error })

export const deleteConnectorStartAction = (payload: { id: string }, apiProvider: ApiProvider) =>
  createAction(ActionType.DeleteConnectorStart, { ...payload, apiProvider })

export const deleteConnectorSuccessAction = () => createAction(ActionType.DeleteConnectorSuccess)

export const deleteConnectorErrorAction = (error: Error) => createAction(ActionType.DeleteConnectorError, { error })

export const updateConnectorStartAction = (apiProvider: ApiProvider) =>
  createAction(ActionType.UpdateConnectorStart, { apiProvider })

export const updateConnectorSuccessAction = (payload: Task<ConnectorConfigInfo>) =>
  createAction(ActionType.UpdateConnectorSuccess, payload)

export const updateConnectorErrorAction = (error: Error) => createAction(ActionType.UpdateConnectorError, { error })

export const updateLocalConnectorData = (payload: { id: string; connectorConfig: ConnectorConfigInfo } | undefined) =>
  createAction(ActionType.UpdateLocalConnectorData, { ...payload })

export const createConnectorStartAction = (payload: { connectorConfig: Partial<ConnectorConfigInfo> }, apiProvider: ApiProvider) =>
  createAction(ActionType.CreateConnectorStart, { ...payload, apiProvider })

export const createConnectorErrorAction = (error: Error) => createAction(ActionType.CreateConnectorError, { error })

export const createConnectorSuccessAction = (payload: Task<ConnectorCreateInfo>) =>
  createAction(ActionType.CreateConnectorSuccess, payload)

export const clearConnectorAction = () => createAction(ActionType.ClearConnector)
