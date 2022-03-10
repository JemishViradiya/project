// ******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { NetworkServicesV2 } from '@ues-data/gateway'
import { GatewayApi, GatewayApiMock } from '@ues-data/gateway'
import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'

import {
  NetworkServicesCreatePermissions,
  NetworkServicesDeletePermissions,
  NetworkServicesReadPermissions,
  NetworkServicesUpdatePermissions,
} from '../../permissions'
import {
  createNetworkServiceStart,
  deleteNetworkServiceStart,
  fetchNetworkServicesStart,
  updateNetworkServiceStart,
} from './actions'
import {
  getCreateNetworkServiceTask,
  getDeleteNetworkServiceTask,
  getNetworkServicesTask,
  getUpdateNetworkServiceTask,
} from './selectors'

export const queryNetworkServices: ReduxQuery<
  NetworkServicesV2.NetworkServiceEntity[],
  Parameters<typeof fetchNetworkServicesStart>[0],
  ReturnType<typeof getNetworkServicesTask>
> = {
  query: payload => fetchNetworkServicesStart(payload, GatewayApi),
  mockQuery: payload => fetchNetworkServicesStart(payload, GatewayApiMock),
  permissions: NetworkServicesReadPermissions,
  selector: () => getNetworkServicesTask,
}

export const mutationCreateNetworkService: ReduxMutation<
  unknown,
  Parameters<typeof createNetworkServiceStart>[0],
  ReturnType<typeof getCreateNetworkServiceTask>
> = {
  mutation: payload => createNetworkServiceStart(payload, GatewayApi),
  mockMutation: payload => createNetworkServiceStart(payload, GatewayApiMock),
  permissions: NetworkServicesCreatePermissions,
  selector: () => getCreateNetworkServiceTask,
}

export const mutationUpdateNetworkService: ReduxMutation<
  unknown,
  Parameters<typeof updateNetworkServiceStart>[0],
  ReturnType<typeof getUpdateNetworkServiceTask>
> = {
  mutation: payload => updateNetworkServiceStart(payload, GatewayApi),
  mockMutation: payload => updateNetworkServiceStart(payload, GatewayApiMock),
  permissions: NetworkServicesUpdatePermissions,
  selector: () => getUpdateNetworkServiceTask,
}

export const mutationDeleteNetworkService: ReduxMutation<
  unknown,
  Parameters<typeof deleteNetworkServiceStart>[0],
  ReturnType<typeof getDeleteNetworkServiceTask>
> = {
  mutation: payload => deleteNetworkServiceStart(payload, GatewayApi),
  mockMutation: payload => deleteNetworkServiceStart(payload, GatewayApiMock),
  permissions: NetworkServicesDeletePermissions,
  selector: () => getDeleteNetworkServiceTask,
}
