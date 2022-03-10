//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.
import type { Response } from '@ues-data/shared'

import type ComplianceInterface from './compliance-interface'
import type { ComplianceInfo, ComplianceType } from './compliance-types'

const remediationDateTimeInPast = Date.parse('2010-01-26T13:57:44.457Z')
const remediationDateTimeFarInFuture = Date.parse('2050-02-26T13:57:44.457Z')

const complianceListWithThreats: ComplianceType[] = [
  // case of threat type with multiple count and with notifications
  {
    threatType: 'maliciousApplication',
    remediationTime: remediationDateTimeFarInFuture,
    threats: [
      {
        id: 'b9ad0bd4-d5e8-4618-b9df-a50fe89ad100',
      },
      {
        id: 'b9ad0bd4-d5e8-4618-b9df-a50fe89ad101',
      },
      {
        id: 'b9ad0bd4-d5e8-4618-b9df-a50fe89ad102',
      },
      {
        id: 'b9ad0bd4-d5e8-4618-b9df-a50fe89ad103',
      },
      {
        id: 'b9ad0bd4-d5e8-4618-b9df-a50fe89ad104',
      },
      {
        id: 'b9ad0bd4-d5e8-4618-b9df-a50fe89ad105',
      },
      {
        id: 'b9ad0bd4-d5e8-4618-b9df-a50fe89ad106',
      },
      {
        id: 'b9ad0bd4-d5e8-4618-b9df-a50fe89ad107',
      },
      {
        id: 'b9ad0bd4-d5e8-4618-b9df-a50fe89ad108',
      },
      {
        id: 'b9ad0bd4-d5e8-4618-b9df-a50fe89ad109',
      },
    ],
    notifications: {
      totalCount: 8,
      sentCount: 2,
      nextSentTime: Date.parse('2049-12-26T13:57:44.457Z'),
      lastSentTime: Date.parse('2049-11-26T13:57:44.457Z'),
    },
  },
  // case when threat type can have multiple count, but it just have one
  {
    threatType: 'sideLoadedApplication',
    remediationTime: remediationDateTimeFarInFuture,
    threats: [
      {
        id: 'c8ad0bd4-d5e8-4618-b9df-a50fe89ad110',
      },
    ],
    notifications: {
      totalCount: 8,
      sentCount: 3,
      nextSentTime: Date.parse('2049-12-26T13:57:44.457Z'),
      lastSentTime: Date.parse('2049-11-26T13:57:44.457Z'),
    },
  },
  // case when all notification sent
  {
    threatType: 'jailbrokenOrRooted',
    remediationTime: remediationDateTimeInPast,
    threats: [
      {
        id: 'c8ad0bd4-d5e8-4618-b9df-a50fe89ad151',
      },
    ],
    notifications: {
      totalCount: 4,
      sentCount: 4,
      nextSentTime: null,
      lastSentTime: Date.parse('2009-12-26T13:57:44.457Z'),
    },
  },
  // case when there is no notification and just remediation date
  {
    threatType: 'unsupportedOS',
    remediationTime: remediationDateTimeInPast,
    threats: [
      {
        id: 'c8ad0bd4-d5e8-4618-b9df-a50fe89ad111',
      },
    ],
  },
  {
    threatType: 'restrictedApplication',
    remediationTime: remediationDateTimeInPast,
    threats: [
      {
        id: 'c8ad0bd4-d5e8-4618-b9df-a50fe89ad112',
      },
    ],
  },
  {
    threatType: 'deviceEncryption',
    remediationTime: remediationDateTimeInPast,
    threats: [
      {
        id: 'c8ad0bd4-d5e8-4618-b9df-a50fe89ad113',
      },
    ],
  },
  {
    threatType: 'deviceScreenlock',
    remediationTime: remediationDateTimeInPast,
    threats: [
      {
        id: 'c8ad0bd4-d5e8-4618-b9df-a50fe89ad114',
      },
    ],
  },
  {
    threatType: 'unsupportedModel',
    remediationTime: remediationDateTimeInPast,
    threats: [
      {
        id: 'c8ad0bd4-d5e8-4618-b9df-a50fe89ad115',
      },
    ],
  },
  {
    threatType: 'unsupportedSecurityPatch',
    remediationTime: remediationDateTimeInPast,
    threats: [
      {
        id: 'c8ad0bd4-d5e8-4618-b9df-a50fe89ad116',
      },
    ],
  },
  {
    threatType: 'unsafeMessage',
    remediationTime: remediationDateTimeInPast,
    threats: [
      {
        id: 'c8ad0bd4-d5e8-4618-b9df-a50fe89ad117',
      },
    ],
  },
  {
    threatType: 'androidHWFailure',
    remediationTime: remediationDateTimeInPast,
    threats: [
      {
        id: 'c8ad0bd4-d5e8-4618-b9df-a50fe89ad118',
      },
    ],
  },
  {
    threatType: 'androidSafetyNetFailure',
    remediationTime: remediationDateTimeInPast,
    threats: [
      {
        id: 'c8ad0bd4-d5e8-4618-b9df-a50fe89ad119',
      },
    ],
  },
  {
    threatType: 'iOsIntegrityFailure',
    remediationTime: remediationDateTimeInPast,
    threats: [
      {
        id: 'c8ad0bd4-d5e8-4618-b9df-a50fe89ad120',
      },
    ],
  },
  {
    threatType: 'compromisedNetwork',
    remediationTime: remediationDateTimeInPast,
    threats: [
      {
        id: 'c8ad0bd4-d5e8-4618-b9df-a50fe89ad121',
      },
    ],
  },
  {
    threatType: 'unresponsiveAgent',
    remediationTime: remediationDateTimeInPast,
    threats: [
      {
        id: 'c8ad0bd4-d5e8-4618-b9df-a50fe89ad122',
      },
    ],
  },
  {
    threatType: 'insecureWiFi',
    remediationTime: remediationDateTimeInPast,
    threats: [
      {
        id: 'c8ad0bd4-d5e8-4618-b9df-a50fe89ad108',
        eventValues: [
          {
            key: 'ssid',
            value: 'someWifi',
          },
        ],
      },
    ],
  },
]

const complianceListWithFeatureDisabledInsecuredWifiThreat: ComplianceType[] = [
  {
    threatType: 'insecureWiFi',
    remediationTime: remediationDateTimeInPast,
    threats: [
      {
        id: 'c8ad0bd4-d5e8-4618-b9df-a50fe89ad108',
      },
    ],
  },
]

const compliantMock = {
  policyId: 'policyId-1',
  policyName: 'Policy name 1',
  complianceList: [],
}

export const nonCompliantMock = {
  policyId: 'policyId-0',
  policyName: 'Policy name 0',
  complianceList: complianceListWithThreats,
}

const nonCompliantMockFeatureDisabledInsecuredWifi = {
  policyId: 'policyId-2',
  policyName: 'Policy name 2',
  complianceList: complianceListWithFeatureDisabledInsecuredWifiThreat,
}

class ComplianceClass implements ComplianceInterface {
  getCompliance(userId: string, deviceId: string): Response<ComplianceInfo> {
    deviceId = atob(deviceId)
    return Promise.resolve(
      (userId === 'userId-0' && deviceId === 'device-0') ||
        (userId === btoa('userId-1') && deviceId === '8bb31f75-42ec-47bb-b910-20e101ae76ab')
        ? { data: compliantMock }
        : deviceId === '8bb31f75-42ec-47bb-b910-20e101ae76ag'
        ? { data: nonCompliantMockFeatureDisabledInsecuredWifi }
        : { data: nonCompliantMock },
    )
  }
}

const ComplianceMock = new ComplianceClass()

export { ComplianceMock }
