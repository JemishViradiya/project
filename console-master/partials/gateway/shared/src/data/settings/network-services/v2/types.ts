//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { NetworkServicesV2 } from '@ues-data/gateway'
import type { UesReduxSlices } from '@ues-data/shared'

import type { Task } from '../../../../utils'
import type * as actions from './actions'

export enum TaskId {
  NetworkServices = 'networkServices',
  CreateNetworkService = 'createNetworkService',
  UpdateNetworkService = 'updateNetworkService',
  DeleteNetworkService = 'deleteNetworkService',
}

export interface NetworkServicesState {
  tasks?: {
    [TaskId.NetworkServices]?: Task<NetworkServicesV2.NetworkServiceEntity[]>
    [TaskId.CreateNetworkService]?: Task
    [TaskId.UpdateNetworkService]?: Task
    [TaskId.DeleteNetworkService]?: Task
  }
}

export type NetworkServicesActions =
  | ReturnType<typeof actions.fetchNetworkServicesStart>
  | ReturnType<typeof actions.fetchNetworkServicesSuccess>
  | ReturnType<typeof actions.fetchNetworkServicesError>
  | ReturnType<typeof actions.createNetworkServiceStart>
  | ReturnType<typeof actions.createNetworkServiceSuccess>
  | ReturnType<typeof actions.createNetworkServiceError>
  | ReturnType<typeof actions.updateNetworkServiceStart>
  | ReturnType<typeof actions.updateNetworkServiceSuccess>
  | ReturnType<typeof actions.updateNetworkServiceError>
  | ReturnType<typeof actions.deleteNetworkServiceStart>
  | ReturnType<typeof actions.deleteNetworkServiceSuccess>
  | ReturnType<typeof actions.deleteNetworkServiceError>

export interface CreateType {
  networkServiceConfig: NetworkServicesV2.NetworkServiceEntity
}

export interface CreateSuccessType {
  networkServiceId: string
  networkServiceConfig: NetworkServicesV2.NetworkServiceEntity
}

export interface ReadType {
  networkServiceId?: string
}

export interface ReadSuccessType {
  data: NetworkServicesV2.NetworkServiceEntity | NetworkServicesV2.NetworkServiceEntity[]
}

export interface UpdateType {
  networkServiceId: string
  networkServiceConfig: NetworkServicesV2.NetworkServiceEntity
}

export interface DeleteType {
  networkServiceId: string
}

export const ReduxSlice: UesReduxSlices = 'app.gateway.networkServices.v2'

export enum ActionType {
  FetchNetworkServicesStart = 'app.gateway.networkServices.v2/fetch-network-services-start',
  FetchNetworkServicesError = 'app.gateway.networkServices.v2/fetch-network-services-error',
  FetchNetworkServicesSuccess = 'app.gateway.networkServices.v2/fetch-network-services-success',

  CreateNetworkServiceStart = 'app.gateway.networkServices.v2/create-network-service-start',
  CreateNetworkServiceError = 'app.gateway.networkServices.v2/create-network-service-error',
  CreateNetworkServiceSuccess = 'app.gateway.networkServices.v2/create-network-service-success',

  UpdateNetworkServiceStart = 'app.gateway.networkServices.v2/update-network-service-start',
  UpdateNetworkServiceError = 'app.gateway.networkServices.v2/update-network-service-error',
  UpdateNetworkServiceSuccess = 'app.gateway.networkServices.v2/update-network-service-success',

  DeleteNetworkServiceStart = 'app.gateway.networkServices.v2/delete-network-service-start',
  DeleteNetworkServiceError = 'app.gateway.networkServices.v2/delete-network-service-error',
  DeleteNetworkServiceSuccess = 'app.gateway.networkServices.v2/delete-network-service-success',
}
