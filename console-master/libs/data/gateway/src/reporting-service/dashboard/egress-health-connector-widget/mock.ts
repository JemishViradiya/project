//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable sonarjs/no-duplicate-string */

import type { EgressHealthConnectorEvent, ReportingServiceResponse } from '../../types'
import { EgressHealthConnectorErrorType, EgressHealthConnectorState } from '../../types'

export const egressHealthConnectorMock: ReportingServiceResponse<{ conStates: EgressHealthConnectorEvent[] }> = {
  tenant: {
    conStates: [
      {
        id: '52087fa844b04b79b8113aa7b3a9f37a',
        name: 'NA - Waterloo',
        states: [
          {
            state: EgressHealthConnectorState.Offline,
            startTimeStamp: '1604075280001',
            endTimeStamp: '1605075280002',
            errType: EgressHealthConnectorErrorType.InternalServerError,
          },
          {
            state: EgressHealthConnectorState.Online,
            startTimeStamp: '1605075280003',
            endTimeStamp: '1607075490605',
            errType: null,
          },
          {
            state: EgressHealthConnectorState.Offline,
            startTimeStamp: '1607075490606',
            endTimeStamp: '1607077490609',
            errType: EgressHealthConnectorErrorType.InternalServerError,
          },
        ],
      },
      {
        id: '851a576612c94511a0966a56ada35bb4',
        name: 'NA - Chicago',
        states: [
          {
            state: EgressHealthConnectorState.Offline,
            startTimeStamp: '1604075280009',
            endTimeStamp: '1606575350003',
            errType: EgressHealthConnectorErrorType.OperationTimedOut,
          },
          {
            state: EgressHealthConnectorState.Online,
            startTimeStamp: '1606575350004',
            endTimeStamp: '1607075450007',
            errType: null,
          },
          {
            state: EgressHealthConnectorState.Offline,
            startTimeStamp: '1607075450008',
            endTimeStamp: '1607075850008',
            errType: EgressHealthConnectorErrorType.OperationTimedOut,
          },
        ],
      },
      {
        id: '85fda455dba143aca11269c9dc151d4a',
        name: 'EU - Paris',
        states: [
          {
            state: EgressHealthConnectorState.Online,
            startTimeStamp: '1604075280200',
            endTimeStamp: '1605075380039',
            errType: null,
          },
          {
            state: EgressHealthConnectorState.Offline,
            startTimeStamp: '1605075380040',
            endTimeStamp: '1606075391889',
            errType: EgressHealthConnectorErrorType.InternalServerError,
          },
          {
            state: EgressHealthConnectorState.Online,
            startTimeStamp: '1606075391890',
            endTimeStamp: '1607075392005',
            errType: null,
          },
          {
            state: EgressHealthConnectorState.Offline,
            startTimeStamp: '1607075392006',
            endTimeStamp: '1607075692006',
            errType: EgressHealthConnectorErrorType.InternalServerError,
          },
        ],
      },
    ],
  },
}
