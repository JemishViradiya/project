// //******************************************************************************
// // Copyright 2020 BlackBerry. All Rights Reserved.

import type { ReportingServiceResponse } from '../../types'

export const networkTrafficMock: ReportingServiceResponse<{
  counters: { allowed: number; blocked: number }
}> = {
  tenant: {
    counters: {
      allowed: 18,
      blocked: 6,
    },
  },
}
