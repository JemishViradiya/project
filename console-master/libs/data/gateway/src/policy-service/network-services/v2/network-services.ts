//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import { axiosInstance, baseUrl } from '../../../config.rest'
import type NetworkServicesInterface from './network-services-interface'
import type { NetworkServiceEntity } from './network-services-types'

export const makeNetworkServicesEndpoint = (tenantId: string, networkServiceId?: string): string => {
  const servicePath = networkServiceId ? `/${networkServiceId}` : ''
  return `/policy/v2/${tenantId}/networkservices${servicePath}`
}

export const makeNetworkServicesUrl = (tenantId: string, entityId?: string): string =>
  `${baseUrl}${makeNetworkServicesEndpoint(tenantId, entityId)}`

class NetworkServicesClass implements NetworkServicesInterface {
  create(tenantId: string, networkServiceConfig: Partial<NetworkServiceEntity>): Response<{ id: string }> {
    return axiosInstance().post(makeNetworkServicesUrl(tenantId), networkServiceConfig)
  }

  read(tenantId: string, networkServiceId?: string): Response<NetworkServiceEntity | NetworkServiceEntity[]> {
    return axiosInstance().get(makeNetworkServicesUrl(tenantId, networkServiceId))
  }

  update(tenantId: string, networkServiceId: string, networkServiceConfig: NetworkServiceEntity): Response {
    return axiosInstance().put(makeNetworkServicesUrl(tenantId, networkServiceId), networkServiceConfig)
  }

  remove(tenantId: string, networkServiceId: string): Response {
    return axiosInstance().delete(makeNetworkServicesUrl(tenantId, networkServiceId))
  }
}

const NetworkServices = new NetworkServicesClass()

export { NetworkServices }
