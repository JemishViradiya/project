/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import { ACCEPTED } from 'http-status-codes'

import type { AsyncMutation, AsyncQuery } from '@ues-data/shared'

import {
  ActivationSettingsReadPermissions,
  ActivationSettingsUpdatePermissions,
  DeviceDeletePermissions,
} from '../../shared/permissions'
import type { ServerSideSelectionModel } from '../../shared/types'
import { Endpoints, EndpointsMock } from '../common'
import type { TenantProperty } from '../common/endpoint-types'

export const deactivateDevice: AsyncMutation<any, { endpointIds: string[] }> = {
  mutation: async ({ endpointIds }) => {
    const response = await Endpoints.deviceDeactivation(endpointIds)

    return response.data
  },
  mockMutationFn: async ({ endpointIds }) => {
    const response = await EndpointsMock.deviceDeactivation(endpointIds)

    return response.data
  },
  permissions: DeviceDeletePermissions,
}

export const getTenantProperty: AsyncQuery<TenantProperty, { propertyName: string }> = {
  query: async ({ propertyName }) => {
    if (propertyName) {
      const data = await Endpoints.getTenantProperty(propertyName)
      return data.data
    } else {
      return undefined
    }
  },
  mockQueryFn: async ({ propertyName }) => {
    if (propertyName) {
      const data = await EndpointsMock.getTenantProperty(propertyName)

      return data.data
    } else {
      return undefined
    }
  },
  permissions: ActivationSettingsReadPermissions,
}

export const updateTenantProperty: AsyncMutation<any, { propertyName: string; propertyValue: string }> = {
  mutation: async ({ propertyName, propertyValue }) => {
    const response = await Endpoints.updateTenantProperty(propertyName, propertyValue)

    return response.data
  },
  mockMutationFn: async ({ propertyName, propertyValue }) => {
    const response = await EndpointsMock.updateTenantProperty(propertyName, propertyValue)

    return response.data
  },
  permissions: ActivationSettingsUpdatePermissions,
}

export const deleteEndpoints: AsyncMutation<any, { selectionModel: ServerSideSelectionModel }> = {
  mutation: async ({ selectionModel }) => {
    const data = await Endpoints.deleteEndpoints(selectionModel)
    return data.status === ACCEPTED ? { ...data.data, deleteIsInProcess: true } : data.data
  },
  mockMutationFn: async ({ selectionModel }) => {
    const data = await EndpointsMock.deleteEndpoints(selectionModel)
    return data.status === ACCEPTED ? { ...data.data, deleteIsInProcess: true } : data.data
  },
  permissions: DeviceDeletePermissions,
}
