//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ConnectorConfigInfo, ConnectorCreateInfo } from '@ues-data/gateway'
import type { UesReduxSlices } from '@ues-data/shared'

import type { Task } from '../../../utils'
import type * as actions from './actions'

export enum TaskId {
  FetchConnectorsTask = 'fetchConnectorsTask',
  FetchConnectorTask = 'fetchConnectorTask',
  DeleteConnectorTask = 'deleteConnectorTask',
  UpdateConnectorTask = 'updateConnectorTask',
  CreateConnectorTask = 'createConnectorTask',
}

export interface ConnectorsState {
  tasks: {
    [TaskId.FetchConnectorsTask]?: Task<ConnectorConfigInfo[]>
    [TaskId.FetchConnectorTask]?: Task<ConnectorConfigInfo>
    [TaskId.DeleteConnectorTask]?: Task
    [TaskId.UpdateConnectorTask]?: Task
    [TaskId.CreateConnectorTask]?: Task<ConnectorCreateInfo>
  }
  ui: {
    localConnectorData?: Partial<ConnectorConfigInfo>
  }
}

export type ConnectorsActions =
  | ReturnType<typeof actions.fetchConnectorsStartAction>
  | ReturnType<typeof actions.fetchConnectorsSuccessAction>
  | ReturnType<typeof actions.fetchConnectorsErrorAction>
  | ReturnType<typeof actions.fetchConnectorStartAction>
  | ReturnType<typeof actions.fetchConnectorSuccessAction>
  | ReturnType<typeof actions.fetchConnectorErrorAction>
  | ReturnType<typeof actions.updateLocalConnectorData>
  | ReturnType<typeof actions.deleteConnectorStartAction>
  | ReturnType<typeof actions.deleteConnectorSuccessAction>
  | ReturnType<typeof actions.deleteConnectorErrorAction>
  | ReturnType<typeof actions.updateConnectorStartAction>
  | ReturnType<typeof actions.updateConnectorSuccessAction>
  | ReturnType<typeof actions.updateConnectorErrorAction>
  | ReturnType<typeof actions.createConnectorStartAction>
  | ReturnType<typeof actions.createConnectorSuccessAction>
  | ReturnType<typeof actions.createConnectorErrorAction>
  | ReturnType<typeof actions.clearConnectorAction>

export const ReduxSlice: UesReduxSlices = 'app.gateway.connectors'

export enum ActionType {
  FetchConnectorsStart = 'app.gateway.connectors/fetch-connectors-start',
  FetchConnectorsError = 'app.gateway.connectors/fetch-connectors-error',
  FetchConnectorsSuccess = 'app.gateway.connectors/fetch-connectors-success',

  FetchConnectorStart = 'app.gateway.connectors/fetch-connector-start',
  FetchConnectorError = 'app.gateway.connectors/fetch-connector-error',
  FetchConnectorSuccess = 'app.gateway.connectors/fetch-connector-success',

  UpdateLocalConnectorData = 'app.gateway.connectors/update-local-connector-data',

  ClearConnector = 'app.gateway.connectors/clear-connector',

  DeleteConnectorStart = 'app.gateway.connectors/delete-connector-start',
  DeleteConnectorError = 'app.gateway.connectors/delete-connector-error',
  DeleteConnectorSuccess = 'app.gateway.connectors/delete-connector-success',

  UpdateConnectorStart = 'app.gateway.connectors/update-connector-start',
  UpdateConnectorError = 'app.gateway.connectors/update-connector-error',
  UpdateConnectorSuccess = 'app.gateway.connectors/update-connector-success',

  CreateConnectorStart = 'app.gateway.connectors/create-connector-start',
  CreateConnectorError = 'app.gateway.connectors/create-connector-error',
  CreateConnectorSuccess = 'app.gateway.connectors/create-connector-success',
}
