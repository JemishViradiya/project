//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ConnectorConfigInfo, ConnectorCreateInfo } from '@ues-data/gateway'
import { GatewayApi, GatewayApiMock } from '@ues-data/gateway'
import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'

import { TenantCreatePermissions, TenantDeletePermissions, TenantReadPermissions, TenantUpdatePermissions } from '../permissions'
import {
  createConnectorStartAction,
  deleteConnectorStartAction,
  fetchConnectorsStartAction,
  fetchConnectorStartAction,
  updateConnectorStartAction,
} from './actions'
import {
  getConnectorsTasks,
  getConnectorTask,
  getCreateConnectorTask,
  getDeleteConnectorTask,
  getUpdateConnectorTask,
} from './selectors'

export const queryConnectors: ReduxQuery<
  Partial<ConnectorConfigInfo>[],
  Parameters<typeof fetchConnectorsStartAction>[0],
  ReturnType<typeof getConnectorsTasks>
> = {
  query: () => fetchConnectorsStartAction(GatewayApi),
  mockQuery: () => fetchConnectorsStartAction(GatewayApiMock),
  permissions: TenantReadPermissions,
  selector: () => getConnectorsTasks,
}

export const queryConnector: ReduxQuery<
  Partial<ConnectorConfigInfo>,
  Parameters<typeof fetchConnectorStartAction>[0],
  ReturnType<typeof getConnectorTask>
> = {
  query: payload => fetchConnectorStartAction(payload, GatewayApi),
  mockQuery: payload => fetchConnectorStartAction(payload, GatewayApiMock),
  permissions: TenantReadPermissions,
  selector: () => getConnectorTask,
}

export const mutationCreateConnector: ReduxMutation<
  ConnectorCreateInfo,
  Parameters<typeof createConnectorStartAction>[0],
  ReturnType<typeof getCreateConnectorTask>
> = {
  mutation: payload => createConnectorStartAction(payload, GatewayApi),
  mockMutation: payload => createConnectorStartAction(payload, GatewayApiMock),
  permissions: TenantCreatePermissions,
  selector: () => getCreateConnectorTask,
}

export const mutationUpdateConnector: ReduxMutation<
  Partial<ConnectorConfigInfo>,
  Parameters<typeof updateConnectorStartAction>[0],
  ReturnType<typeof getUpdateConnectorTask>
> = {
  mutation: () => updateConnectorStartAction(GatewayApi),
  mockMutation: () => updateConnectorStartAction(GatewayApiMock),
  permissions: TenantUpdatePermissions,
  selector: () => getUpdateConnectorTask,
}

export const mutationDeleteConnector: ReduxMutation<
  { id: string },
  Parameters<typeof deleteConnectorStartAction>[0],
  ReturnType<typeof getDeleteConnectorTask>
> = {
  mutation: payload => deleteConnectorStartAction(payload, GatewayApi),
  mockMutation: payload => deleteConnectorStartAction(payload, GatewayApiMock),
  permissions: TenantDeletePermissions,
  selector: () => getDeleteConnectorTask,
}
