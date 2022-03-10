//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { AsyncQuery } from '@ues-data/shared'
import { NoPermissions } from '@ues-data/shared'

import { TOTPProcessor } from './totp'
import { TOTPMock } from './totp-mock'
import type { TOTP } from './totp-types'

export const queryTOTPEnrollmentStatus: AsyncQuery<TOTP, { ecsUserId: string }> = {
  query: async ({ ecsUserId }) => {
    const data = await TOTPProcessor.getTOTPEnrollmentStatus(ecsUserId)
    return data.data
  },
  mockQueryFn: async ({ ecsUserId }) => {
    const data = await TOTPMock.getTOTPEnrollmentStatus(ecsUserId)
    return data.data
  },
  permissions: NoPermissions,
}
