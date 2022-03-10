//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { NetworkServicesV3 } from '@ues-data/gateway'
import type { UesReduxSlices } from '@ues-data/shared'

import type { Task } from '../../../../utils'
import type * as actions from './actions'

export enum TaskId {
  FetchNetworkService = 'fetchNetworkService',
  CreateNetworkService = 'createNetworkService',
  UpdateNetworkService = 'updateNetworkService',
  DeleteNetworkService = 'deleteNetworkService',
}

export interface NetworkServicesState {
  tasks?: {
    [TaskId.FetchNetworkService]?: Task<Partial<NetworkServicesV3.NetworkServiceEntity>>
    [TaskId.CreateNetworkService]?: Task
    [TaskId.UpdateNetworkService]?: Task
    [TaskId.DeleteNetworkService]?: Task
  }
  ui?: {
    localNetworkServiceData?: Partial<NetworkServicesV3.NetworkServiceEntity>
  }
}

export type NetworkServicesActions =
  | ReturnType<typeof actions.fetchNetworkServiceStart>
  | ReturnType<typeof actions.fetchNetworkServiceSuccess>
  | ReturnType<typeof actions.fetchNetworkServiceError>
  | ReturnType<typeof actions.clearNetworkService>
  | ReturnType<typeof actions.createNetworkServiceStart>
  | ReturnType<typeof actions.createNetworkServiceSuccess>
  | ReturnType<typeof actions.createNetworkServiceError>
  | ReturnType<typeof actions.updateNetworkServiceStart>
  | ReturnType<typeof actions.updateNetworkServiceSuccess>
  | ReturnType<typeof actions.updateNetworkServiceError>
  | ReturnType<typeof actions.deleteNetworkServiceStart>
  | ReturnType<typeof actions.deleteNetworkServiceSuccess>
  | ReturnType<typeof actions.deleteNetworkServiceError>
  | ReturnType<typeof actions.updateLocalNetworkServiceData>

export interface CreateType {
  networkServiceConfig: NetworkServicesV3.NetworkServiceEntity
}

export interface CreateSuccessType {
  id: string
  networkServiceConfig: NetworkServicesV3.NetworkServiceEntity
}

export interface UpdateType {
  id: string
  networkServiceConfig: NetworkServicesV3.NetworkServiceEntity
}

export interface DeleteType {
  id: string
}

export const ReduxSlice: UesReduxSlices = 'app.gateway.networkServices.v3'

export enum ActionType {
  FetchNetworkServiceStart = 'app.gateway.networkServices.v3/fetch-network-service-start',
  FetchNetworkServiceError = 'app.gateway.networkServices.v3/fetch-network-service-error',
  FetchNetworkServiceSuccess = 'app.gateway.networkServices.v3/fetch-network-service-success',
  ClearNetworkService = 'app.gateway.networkServices.v3/clear-network-service',

  CreateNetworkServiceStart = 'app.gateway.networkServices.v3/create-network-service-start',
  CreateNetworkServiceError = 'app.gateway.networkServices.v3/create-network-service-error',
  CreateNetworkServiceSuccess = 'app.gateway.networkServices.v3/create-network-service-success',

  UpdateNetworkServiceStart = 'app.gateway.networkServices.v3/update-network-service-start',
  UpdateNetworkServiceError = 'app.gateway.networkServices.v3/update-network-service-error',
  UpdateNetworkServiceSuccess = 'app.gateway.networkServices.v3/update-network-service-success',

  DeleteNetworkServiceStart = 'app.gateway.networkServices.v3/delete-network-service-start',
  DeleteNetworkServiceError = 'app.gateway.networkServices.v3/delete-network-service-error',
  DeleteNetworkServiceSuccess = 'app.gateway.networkServices.v3/delete-network-service-success',

  UpdateLocalNetworkServiceData = 'app.gateway.networkServices.v3/update-local-network-service-data',
}
