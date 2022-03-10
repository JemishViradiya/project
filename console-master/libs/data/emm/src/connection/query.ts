//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { AsyncQuery } from '@ues-data/shared'
import { Permission } from '@ues-data/shared'

import { Connection } from './connection'
import { ConnectionMock } from './connection-mock'

export const queryConnections: AsyncQuery<unknown> = {
  query: async () => {
    const data = await Connection.getConnections()
    return data.data
  },
  mockQueryFn: async () => {
    const data = await ConnectionMock.getConnections()
    return data.data
  },
  permissions: new Set([Permission.ECS_MDM_READ]),
}
