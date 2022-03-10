//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import type { AsyncQuery } from '@ues-data/shared'
import { FeatureName, FeaturizationApi } from '@ues-data/shared'

import { DirectoryReadPermissions, UserReadPermissions } from '../shared/permissions'
import { Directory } from './directory'
import { DirectoryMock } from './directory-mock'
import type { DirectoryInstance, DirectoryUser } from './directory-types'
import { convertDirectoryFromRest } from './directoryUtils'

export const queryDirectoryUsers: AsyncQuery<DirectoryUser[], { tenantId: string; search: string }> = {
  query: async ({ tenantId, search }) => {
    const data = await Directory.searchUsers(tenantId, search)

    return data.data
  },
  mockQueryFn: async ({ tenantId, search }) => {
    const data = await DirectoryMock.searchUsers(tenantId, search)

    return data.data
  },
  permissions: DirectoryReadPermissions,
}

export const queryDirectoryInstance: AsyncQuery<DirectoryInstance, { directoryInstanceId: string }> = {
  query: async ({ directoryInstanceId }) => {
    if (directoryInstanceId) {
      const data = await Directory.getDirectoryInstance(directoryInstanceId)

      return convertDirectoryFromRest(data.data)
    } else {
      return undefined
    }
  },
  mockQueryFn: async ({ directoryInstanceId }) => {
    if (directoryInstanceId) {
      const data = FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode)
        ? await Directory.getDirectoryInstance(directoryInstanceId)
        : await DirectoryMock.getDirectoryInstance(directoryInstanceId)

      return convertDirectoryFromRest(data.data)
    } else {
      return undefined
    }
  },
  permissions: DirectoryReadPermissions,
}

export const queryDirectoryInstances: AsyncQuery<DirectoryInstance[], void> = {
  query: async () => {
    const data = await Directory.getDirectories()
    return data.data
  },
  mockQueryFn: async () => {
    const data = await DirectoryMock.getDirectories()
    return data.data
  },
  permissions: DirectoryReadPermissions,
}

export const queryDirectoryConfigured: AsyncQuery<boolean, void> = {
  query: async () => {
    const data = await Directory.getDirectoryConfigured()
    return data.data
  },
  mockQueryFn: async () => {
    const data = await (FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode)
      ? Directory.getDirectoryConfigured()
      : DirectoryMock.getDirectoryConfigured())
    return data.data
  },
  permissions: UserReadPermissions,
}
