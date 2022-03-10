/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { Response } from '@ues-data/shared'

import type { DeleteResponse, ServerSideSelectionModel } from '../../shared/types'
import type { TenantProperty } from './endpoint-types'
import type EndpointsInterface from './endpoints-interface'

class EndpointsClass implements EndpointsInterface {
  deleteEndpoints(selection: ServerSideSelectionModel): Response<{ totalCount: number; failedCount: number }> {
    return Promise.resolve({ data: { totalCount: 1, failedCount: 1 } })
  }
  deviceDeactivation(deviceIds: string[]): Response<{ totalCount: number; failedCount: number }> {
    return Promise.resolve({ data: { totalCount: 1, failedCount: 1 } })
  }
  getTenantProperty(propertyName: string): Response<TenantProperty> {
    return Promise.resolve({
      data: { name: propertyName, value: propertyName == 'user.passcode.ttl.minutes' ? '21600' : 'propertyValue' },
    })
  }
  updateTenantProperty(propertyName: string, propertyValue: string): Response<TenantProperty> {
    return Promise.resolve({ data: { name: propertyName, value: propertyValue } })
  }
}

const EndpointsMock = new EndpointsClass()

export { EndpointsMock }
