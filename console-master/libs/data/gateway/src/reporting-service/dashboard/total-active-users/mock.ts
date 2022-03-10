//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import type { ReportingServiceResponse } from '../../types'

export const totalActiveUsersMock: ReportingServiceResponse<{
  counters: { users: number }
}> = {
  tenant: {
    counters: {
      users: 118,
    },
  },
}
