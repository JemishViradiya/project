//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { Response } from '@ues-data/shared-types'

import type { TOTP } from './totp-types'

export default interface TOTPInterface {
  getTOTPEnrollmentStatus(ecsUserId: string): Response<TOTP>
  removeTOTPEnrollmentStatus(ecsUserId: string): Response<Record<string, unknown>>
}
