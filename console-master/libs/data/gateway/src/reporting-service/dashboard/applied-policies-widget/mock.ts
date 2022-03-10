//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { ReconciliationEntityType } from '@ues-data/shared'

import type { ReportingServiceTunnelAggResponse } from '../../types'

export const appliedPoliciesMock: Record<ReconciliationEntityType.NetworkAccessControl, ReportingServiceTunnelAggResponse> = {
  [ReconciliationEntityType.NetworkAccessControl]: {
    tenant: {
      tunnelAgg: {
        buckets: [
          {
            key: 'policyid3',
            count: 20,
          },
          {
            key: 'Big Policy Profile',
            count: 15,
          },
          {
            key: 'Policy 1',
            count: 3,
          },
        ],
      },
    },
  },
}
