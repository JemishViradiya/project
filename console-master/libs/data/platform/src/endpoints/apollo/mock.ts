/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import { usersMock } from '../../users'
import type { AggregatedEndpoint, PlatformEndpoint } from './types'
import { DeviceOs, EmmConnectionRegistrationStatus, EmmConnectionType, RiskLevelStatus } from './types'

const riskLevels: RiskLevelStatus[] = Object.entries(RiskLevelStatus).map(x => x[1])

export function mockEndpoint({ id }): PlatformEndpoint {
  return {
    guid: id,
    userId: btoa(`userId-${id}`),
    tenantId: 'mock',
    appBundleId: 'com.blackberry.protect',
    appVersion: '1.0.0',
    created: mockDate(100000),
    modified: mockDate(10000),
    expires: mockDate(-10000),
    deviceInfo: {
      deviceId: `device-${id}`,
      extDeviceId: `extDevice-${id}`,
      deviceModelAlias: 'modelAlias',
      deviceModelName: 'Galaxy S8',
      manufacturer: 'manufacturer',
      osVersion: '11.1',
      platform: 'Android',
      securityPatch: 'never',
    },
  }
}

export function mockAggregatedEndpoint({ id }): AggregatedEndpoint {
  const user = usersMock.elements.find(u => u.id.includes(id))
  const connectionType = Object.values(EmmConnectionType)[Math.floor(Math.random() * 1)]
  const result: AggregatedEndpoint = {
    endpointId: id,
    deviceId: `device-${id}`,
    userDisplayName: user?.displayName,
    userEmailAddress: user?.emailAddress,
    osVersion: '11.1',
    osPlatform: id % 2 === 0 ? DeviceOs.ANDROID : DeviceOs.IOS,
    device: 'Galaxy S8',
    agent: '1.0.0 com.blackberry.protect',
    appBundleId: 'com.blackberry.protect',
    appVersion: '1.0.0',
    mobile: true,
    lastOnline: mockDate(500),
    enrollmentTime: mockDate(10000),
    userId: btoa(`userId-${id}`),
    tenantId: 'mock',
    osSecurityPatch: '2021-08-01',
    riskLevelStatus: riskLevels[Math.floor(Math.random() * 5)],
    emmType: connectionType,
    emmRegistrationStatus:
      connectionType === EmmConnectionType.INTUNE
        ? Object.values(EmmConnectionRegistrationStatus)[Math.floor(Math.random() * 4)]
        : null,
  }
  const randId = Math.floor(Math.random() * 6)
  if (randId < 5 || id % 3 !== 0) result.riskLevelStatus = riskLevels[randId]
  if (randId > 2) {
    result.emmType = Object.values(EmmConnectionType)[Math.floor(Math.random() * 2)]
    if (randId > 3) result.emmRegistrationStatus = Object.values(EmmConnectionRegistrationStatus)[Math.floor(Math.random() * 4)]
  }

  return result
}

function mockDate(offset: number): Date {
  const d = new Date()
  d.setTime(Date.now() - offset)
  return d
}
