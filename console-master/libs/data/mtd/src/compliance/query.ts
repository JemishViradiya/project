//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { AsyncQuery } from '@ues-data/shared'

import { Compliance } from './compliance'
import { ComplianceMock } from './compliance-mock'
import type { ComplianceInfo } from './compliance-types'
import { ComplianceReadPermissions } from './permisions'

export const queryComplianceInfo: AsyncQuery<ComplianceInfo, { userId: string; deviceId: string }> = {
  query: async ({ userId, deviceId }) => {
    const data = await Compliance.getCompliance(userId, deviceId)
    return data.data
  },
  mockQueryFn: async ({ userId, deviceId }) => {
    const data = await ComplianceMock.getCompliance(userId, deviceId)
    return data.data
  },
  permissions: ComplianceReadPermissions,
}
