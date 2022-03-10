//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'

import type { PagableResponse, Response } from '@ues-data/shared'
import { serializeParams } from '@ues-data/shared'

import { axiosInstance, baseUrl } from '../../../config.rest'
import type NetworkServicesInterface from './network-services-interface'
import type { NetworkServiceEntity, NetworkServicesRequestParams } from './network-services-types'

interface MakeNetworkServicesFnArgs {
  tenantId: string
  networkServiceId?: string
  params?: NetworkServicesRequestParams
}

export const makeNetworkServicesEndpoint = ({ tenantId, networkServiceId, params }: MakeNetworkServicesFnArgs): string => {
  const servicePath = networkServiceId ? `/${networkServiceId}` : ''
  const serializedParams = isEmpty(params) ? '' : `?${serializeParams(params)}`

  return `/policy/v3/${tenantId}/acl/networkservices${servicePath}${serializedParams}`
}

export const makeNetworkServicesUrl = ({ tenantId, networkServiceId, params }: MakeNetworkServicesFnArgs): string =>
  `${baseUrl}${makeNetworkServicesEndpoint({ tenantId, networkServiceId, params })}`

class NetworkServicesClass implements NetworkServicesInterface {
  create(tenantId: string, networkServiceConfig: NetworkServiceEntity): Response<{ id: string }> {
    return axiosInstance().post(makeNetworkServicesUrl({ tenantId }), networkServiceConfig)
  }

  readOne(tenantId: string, networkServiceId: string): Response<NetworkServiceEntity> {
    return axiosInstance().get(makeNetworkServicesUrl({ tenantId, networkServiceId }))
  }

  read(tenantId: string, params?: NetworkServicesRequestParams): Response<PagableResponse<NetworkServiceEntity>> {
    return axiosInstance().get(makeNetworkServicesUrl({ tenantId, params }))
  }

  update(tenantId: string, networkServiceId: string, networkServiceConfig: NetworkServiceEntity): Response {
    return axiosInstance().put(makeNetworkServicesUrl({ tenantId, networkServiceId }), networkServiceConfig)
  }

  remove(tenantId: string, networkServiceId: string): Response {
    return axiosInstance().delete(makeNetworkServicesUrl({ tenantId, networkServiceId }))
  }
}

const NetworkServices = new NetworkServicesClass()

export { NetworkServices }
