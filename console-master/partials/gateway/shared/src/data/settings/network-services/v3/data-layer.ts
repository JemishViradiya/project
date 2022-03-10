// ******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { NetworkServicesV3 } from '@ues-data/gateway'
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
  fetchNetworkServiceStart,
  updateNetworkServiceStart,
} from './actions'
import {
  getCreateNetworkServiceTask,
  getDeleteNetworkServiceTask,
  getNetworkServiceTask,
  getUpdateNetworkServiceTask,
} from './selectors'

export const queryNetworkService: ReduxQuery<
  NetworkServicesV3.NetworkServiceEntity,
  Parameters<typeof fetchNetworkServiceStart>[0],
  ReturnType<typeof getNetworkServiceTask>
> = {
  query: payload => fetchNetworkServiceStart(payload, GatewayApi),
  mockQuery: payload => fetchNetworkServiceStart(payload, GatewayApiMock),
  permissions: NetworkServicesReadPermissions,
  selector: () => getNetworkServiceTask,
}

export const mutationCreateNetworkService: ReduxMutation<
  { id: string },
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
