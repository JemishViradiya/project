//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.
import { UesAxiosClient } from '@ues-data/shared'
import type { Response } from '@ues-data/shared-types'

import { baseUrl } from '../config.rest'
import TOTPInterface from './totp-interface'
import { TOTP } from './totp-types'

const pathPrefix = `${baseUrl}/totp`

export const TOTPProcessor: TOTPInterface = {
  getTOTPEnrollmentStatus(ecsUserId: string): Response<TOTP> {
    return UesAxiosClient().get(`${pathPrefix}/${ecsUserId}`)
  },
  removeTOTPEnrollmentStatus(ecsUserId: string): Response<Record<string, unknown>> {
    return UesAxiosClient().delete(`${pathPrefix}/${ecsUserId}`)
  },
}

export { TOTP }
export { TOTPInterface }
