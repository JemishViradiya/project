//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared'

import { axiosInstance, baseUrl } from '../config.rest'
import type ComplianceInterface from './compliance-interface'
import type { ComplianceInfo } from './compliance-types'

export const makeEndpoint = (userId: string, deviceId: string): string =>
  `/v1/compliance/users/${userId}/devices/${encodeURIComponent(deviceId)}/compliance`

export const makeUrl = (userId: string, deviceId: string): string => `${baseUrl}${makeEndpoint(userId, deviceId)}`

class ComplianceClass implements ComplianceInterface {
  getCompliance(userId: string, deviceId: string): Response<ComplianceInfo> {
    return axiosInstance().get(makeUrl(userId, deviceId))
  }
}

const Compliance = new ComplianceClass()

export { Compliance }
