//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import type { ReportingServiceResponse, ReportingServiceTrafficEntity } from '../../types'

export const transferredBytesMock: ReportingServiceResponse<{ traffic: ReportingServiceTrafficEntity }> = {
  tenant: {
    traffic: {
      bytes_total: 5153214,
    },
  },
}
