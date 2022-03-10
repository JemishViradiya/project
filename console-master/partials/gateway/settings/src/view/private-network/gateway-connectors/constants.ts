//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import { EgressHealthConnectorErrorType } from '@ues-data/gateway'

export const CONNECTOR_ERROR_KEYS = {
  [EgressHealthConnectorErrorType.InvalidToken]: 'connectors.InvalidToken',
  [EgressHealthConnectorErrorType.TokenExpired]: 'connectors.TokenExpired',
  [EgressHealthConnectorErrorType.InvalidRequest]: 'connectors.InvalidRequest',
  [EgressHealthConnectorErrorType.InvalidUser]: 'connectors.InvalidUser',
  [EgressHealthConnectorErrorType.InvalidIp]: 'connectors.InvalidIp',
  [EgressHealthConnectorErrorType.InvalidConnector]: 'connectors.InvalidConnector',
  [EgressHealthConnectorErrorType.InternalServerError]: 'connectors.InternalServerError',
  [EgressHealthConnectorErrorType.ServerBusy]: 'connectors.ServerBusy',
  [EgressHealthConnectorErrorType.OperationTimedOut]: 'connectors.OperationTimedOut',
  [EgressHealthConnectorErrorType.UnknownError]: 'connectors.UnknownError',
}
