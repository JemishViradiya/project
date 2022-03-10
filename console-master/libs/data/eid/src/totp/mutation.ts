//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { AsyncMutation } from '@ues-data/shared'

import { TOTPProcessor } from './totp'
import { TOTPMock } from './totp-mock'

export const mutateRemoveTOTPEnrollmentStatus: AsyncMutation<unknown, { ecsUserId: string }> = {
  mutation: async ({ ecsUserId }) => {
    const data = await TOTPProcessor.removeTOTPEnrollmentStatus(ecsUserId)
    return data.data
  },
  mockMutationFn: async ({ ecsUserId }) => {
    const data = await TOTPMock.removeTOTPEnrollmentStatus(ecsUserId)
    return data.data
  },
}
