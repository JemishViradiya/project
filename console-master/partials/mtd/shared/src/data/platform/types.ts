/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

export enum MobileAlertColumnNames {
  Description = 'description',
  Detected = 'detected',
  DeviceName = 'deviceName',
  Name = 'name',
  Status = 'status',
  Type = 'type',
  UserName = 'userName',
  ThreatCount = 'threatCount',
  DeviceCount = 'deviceCount',
  FirstDetected = 'firstDetected',
  LastDetected = 'lastDetected',
  EndpointIds = 'endpointIds',
}

export enum MobileAlertFilterNames {
  DeviceId = 'deviceId',
  EndpointId = 'endpointId',
  EcoId = 'ecoId',
}

export enum MobileAlertGroupBy {
  NONE = 'none',
  DETECTION = 'detection',
  DEVICE = 'device',
}
