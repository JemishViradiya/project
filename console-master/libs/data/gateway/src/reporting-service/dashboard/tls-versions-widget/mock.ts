// //******************************************************************************
// // Copyright 2020 BlackBerry. All Rights Reserved.

import type { ReportingServiceTunnelAggResponse } from '../../types'

export const tlsVersionsMock: ReportingServiceTunnelAggResponse = {
  tenant: {
    tunnelAgg: {
      buckets: [
        {
          key: 'TLS 1.2',
          count: 135,
        },
        {
          key: 'TLS 1.3',
          count: 92,
        },
      ],
    },
  },
}
