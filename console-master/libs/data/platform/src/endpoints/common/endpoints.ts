/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { Response } from '@ues-data/shared'
import { UesAxiosClient } from '@ues-data/shared'

import type { DeleteResponse, ServerSideSelectionModel } from '../../shared/types'
import type { TenantProperty } from './endpoint-types'
import type EndpointsInterface from './endpoints-interface'

class EndpointsClass implements EndpointsInterface {
  deleteEndpoints(selection: ServerSideSelectionModel): Response<{ totalCount: number; failedCount: number }> {
    return UesAxiosClient().delete(`/platform/v1/bffgrid/deleteEndpoints`, {
      data: selection,
    })
  }
  deviceDeactivation(endpointIds: string[]): Response<{ totalCount: number; failedCount: number }> {
    return UesAxiosClient().delete(`/platform/v1/endpoints/admin/manage`, { data: [endpointIds] })
  }
  getTenantProperty(propertyName: string): Response<TenantProperty> {
    return UesAxiosClient().get(`/platform/v1/endpoints/admin/properties/${propertyName}`)
  }
  updateTenantProperty(propertyId: string, propertyValue: string): Response<TenantProperty> {
    return UesAxiosClient().patch(`/platform/v1/endpoints/admin/properties`, [{ name: propertyId, value: propertyValue }])
  }
}

export const Endpoints = new EndpointsClass()
